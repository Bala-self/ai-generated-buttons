const mongoose = require('mongoose');
const Button = require('../models/Button');

const PAGE_SIZE = 25;

exports.latest = async (_req, res, next) => {
  try {
    const buttons = await Button.find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(PAGE_SIZE)
      .lean();
    res.json({ buttons });
  } catch (err) {
    next(err);
  }
};

exports.all = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const skip = (page - 1) * PAGE_SIZE;
    const [buttons, total] = await Promise.all([
      Button.find({ approved: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(PAGE_SIZE)
        .lean(),
      Button.countDocuments({ approved: true }),
    ]);
    res.json({
      buttons,
      page,
      pageSize: PAGE_SIZE,
      total,
      hasMore: skip + buttons.length < total,
    });
  } catch (err) {
    next(err);
  }
};

exports.byCategory = async (req, res, next) => {
  try {
    const category = String(req.params.c || '').toLowerCase();
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const skip = (page - 1) * PAGE_SIZE;
    const buttons = await Button.find({ approved: true, category })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(PAGE_SIZE)
      .lean();
    res.json({ buttons, page });
  } catch (err) {
    next(err);
  }
};

exports.like = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: 'Bad id' });

    const user = req.user;
    const already = user.likes.some((b) => b.toString() === id);

    if (already) {
      user.likes = user.likes.filter((b) => b.toString() !== id);
      await Button.findByIdAndUpdate(id, { $inc: { likes: -1 } });
    } else {
      user.likes.push(id);
      await Button.findByIdAndUpdate(id, { $inc: { likes: 1 } });
    }
    await user.save();
    res.json({ liked: !already, likes: user.likes });
  } catch (err) {
    next(err);
  }
};
