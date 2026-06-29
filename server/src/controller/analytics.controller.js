const Component = require('../models/Component.models');

exports.incrementCopy = async (req, res) => {
  try {
    const component = await Component.findOne({ slug: req.params.slug });
    
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }
    component.copiesCount += 1;
    await component.save();

    res.json({ message: 'Copy count updated', copiesCount: component.copiesCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const userComponents = await Component.find({ author: userId });

    const totalSubmissions = userComponents.length;
    const totalViews = userComponents.reduce((acc, curr) => acc + curr.viewsCount, 0);
    const totalCopies = userComponents.reduce((acc, curr) => acc + curr.copiesCount, 0);

    res.json({
      totalSubmissions,
      totalViews,
      totalCopies,
      components: userComponents 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
