const mongoose = require('mongoose');
const Button = require('../models/Button');

exports.add = async (req, res, next) => {
  try {
    const id = String(req.body.buttonId || '');
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: 'Bad id' });

    const user = req.user;
    if (!user.cart.some((b) => b.toString() === id)) {
      user.cart.push(id);
      await Button.findByIdAndUpdate(id, { $inc: { cartAdds: 1 } });
      await user.save();
    }
    res.json({ cart: user.cart });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const id = String(req.body.buttonId || '');
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: 'Bad id' });

    const user = req.user;
    user.cart = user.cart.filter((b) => b.toString() !== id);
    await user.save();
    res.json({ cart: user.cart });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const populated = await req.user.populate({
      path: 'cart',
      options: { sort: { createdAt: -1 } },
    });
    res.json({ buttons: populated.cart });
  } catch (err) {
    next(err);
  }
};
