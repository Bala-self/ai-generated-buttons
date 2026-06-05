const Button = require('../models/Button');
const { runDailyGeneration } = require('../jobs/dailyGenerator');

exports.generateNow = async (_req, res, next) => {
  try {
    const docs = await runDailyGeneration();
    res.json({ inserted: docs.length });
  } catch (err) {
    next(err);
  }
};

exports.pending = async (_req, res, next) => {
  try {
    const buttons = await Button.find({ approved: false })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    res.json({ buttons });
  } catch (err) {
    next(err);
  }
};

exports.approve = async (req, res, next) => {
  try {
    const updated = await Button.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ button: updated });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await Button.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

exports.stats = async (_req, res, next) => {
  try {
    const [total, byCategory, top] = await Promise.all([
      Button.countDocuments({ approved: true }),
      Button.aggregate([
        { $match: { approved: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
      Button.find({ approved: true })
        .sort({ likes: -1 })
        .limit(10)
        .select('title category likes cartAdds')
        .lean(),
    ]);
    res.json({ total, byCategory, top });
  } catch (err) {
    next(err);
  }
};
