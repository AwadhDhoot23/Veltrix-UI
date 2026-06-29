const User = require('../models/User.models');
const Component = require('../models/Component.models');

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'favorites',
        populate: { path: 'author', select: 'username' }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { componentId } = req.params;

    const component = await Component.findById(componentId);
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }
    const user = await User.findById(req.user.id);
    
    if (user.favorites.some(id => id.toString() === componentId)) {
      return res.status(400).json({ message: 'Component already favorited' });
    }

    user.favorites.push(componentId);
    await user.save();

    res.json({ message: 'Added to favorites successfully', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { componentId } = req.params;

    const user = await User.findById(req.user.id);

    if (!user.favorites.includes(componentId)) {
      return res.status(400).json({ message: 'Component not in favorites' });
    }

    user.favorites = user.favorites.filter(id => id.toString() !== componentId);
    await user.save();

    res.json({ message: 'Removed from favorites successfully', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
