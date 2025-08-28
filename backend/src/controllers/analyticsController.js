const mongoose = require('mongoose');
const Application = require('../models/Application');

const STAGES = ['Applied', 'Interview', 'Offer', 'Rejected'];

function buildMatch(req) {
  const match = { recruiter: new mongoose.Types.ObjectId(req.user._id) };

  const { from, to, role, status } = req.query;

  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to)   match.createdAt.$lte = new Date(to);
  }
  if (role)   match.role   = role;
  if (status) match.status = status;

  return match;
}

async function computeSummary(match) {
  const [doc] = await Application.aggregate([
    { $match: match },
    {
      $facet: {
        byStage: [
          { $group: { _id: '$status', count: { $sum: 1 } } },
          { $project: { _id: 0, status: '$_id', count: 1 } }
        ],
        byRole: [
          { $group: { _id: '$role', count: { $sum: 1 } } },
          { $project: { _id: 0, role: '$_id', count: 1 } },
          { $sort: { count: -1, role: 1 } }
        ],
        expStats: [
          { $group: {
              _id: null,
              avg: { $avg: '$experience' },
              min: { $min: '$experience' },
              max: { $max: '$experience' },
            }
          },
          { $project: { _id: 0, avg: { $round: ['$avg', 2] }, min: 1, max: 1 } }
        ],
        total: [ { $count: 'value' } ],
      }
    }
  ]);

  const stageMap = new Map((doc?.byStage || []).map(s => [s.status, s.count]));
  const byStage = STAGES.map(s => ({ status: s, count: stageMap.get(s) || 0 }));

  return {
    byStage,
    byRole: doc?.byRole || [],
    avgExperience: doc?.expStats?.[0]?.avg || 0,
    minExperience: doc?.expStats?.[0]?.min ?? null,
    maxExperience: doc?.expStats?.[0]?.max ?? null,
    totalCandidates: doc?.total?.[0]?.value || 0,
  };
}

exports.analyticsSummary = async (req, res) => {
  try {
    const match = buildMatch(req);
    const summary = await computeSummary(match);
    res.json(summary);
  } catch (err) {
    console.error('analyticsSummary error:', err);
    res.status(500).json({ message: err.message });
  }
};


// exports.analyticsSSE = async (req, res) => {
//   res.set({
//     "Content-Type": "text/event-stream",
//     "Cache-Control": "no-cache",
//     "Connection": "keep-alive",
//     "Access-Control-Allow-Origin": ["http://localhost:5173""https://ap-plyly.vercel.app/applications"],
//     "Access-Control-Allow-Credentials": "true"
//   });
//   res.flushHeaders?.();

//   const match = buildMatch(req);

//   const initial = await computeSummary(match);
//   console.log("Sending initial summary:", initial); 
//   res.write(`event: summary\ndata:${JSON.stringify(initial)}\n\n`);

//   let changeStream;
//   try {
//     const pipeline = [
//       { $match: { 'fullDocument.recruiter': new mongoose.Types.ObjectId(req.user._id) } }
//     ];
//     changeStream = Application.watch(pipeline, { fullDocument: "updateLookup" });

//     changeStream.on("change", async () => {
//       const data = await computeSummary(match);
//       console.log("Change detected, sending summary:", data); 
//       res.write(`event: summary\ndata:${JSON.stringify(data)}\n\n`);
//     });
//   } catch (e) {
//     console.warn("Change streams not available, falling back to polling:", e.message);
//     const interval = setInterval(async () => {
//       const data = await computeSummary(match);
//       res.write(`event: summary\ndata:${JSON.stringify(data)}\n\n`);
//     }, 5000);
//     req.on("close", () => clearInterval(interval));
//   }

//   req.on("close", () => {
//     changeStream?.close();
//     res.end();
//   });
// };


exports.analyticsSSE = async (req, res) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://ap-plyly.vercel.app"
  ];
  const origin = req.headers.origin;

  // ✅ Set CORS headers for SSE
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders?.();

  const match = buildMatch(req);

  // send initial summary
  const initial = await computeSummary(match);
  res.write(`event: summary\ndata:${JSON.stringify(initial)}\n\n`);

  let changeStream;
  try {
    const pipeline = [
      { $match: { "fullDocument.recruiter": new mongoose.Types.ObjectId(req.user._id) } }
    ];
    changeStream = Application.watch(pipeline, { fullDocument: "updateLookup" });

    changeStream.on("change", async () => {
      const data = await computeSummary(match);
      res.write(`event: summary\ndata:${JSON.stringify(data)}\n\n`);
    });
  } catch (e) {
    console.warn("Change streams not available, falling back to polling:", e.message);
    const interval = setInterval(async () => {
      const data = await computeSummary(match);
      res.write(`event: summary\ndata:${JSON.stringify(data)}\n\n`);
    }, 5000);
    req.on("close", () => clearInterval(interval));
  }

  req.on("close", () => {
    changeStream?.close();
    res.end();
  });
};


