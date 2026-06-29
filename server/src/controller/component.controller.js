const Component=require('../models/Component.models');
exports.getComponents=async(req,res)=>{
    try {
        const components=await Component.find().populate('author','username').sort({createdAt:-1});
        res.json(components);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getComponentBySlug = async (req, res) => {
  try {
    const component = await Component.findOne({ slug: req.params.slug })
      .populate('author', 'username');
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }
    res.json(component);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.createComponent = async (req, res) => {
  try {
    const { name, slug, description, code, tags, dependencies } = req.body;
    const existingSlug = await Component.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({ message: 'A component with this slug already exists' });
    }
    const newComponent = await Component.create({
      name,
      slug,
      description,
      code,
      tags: tags || [],
      dependencies: dependencies || [],
      author: req.user.id, 
    });
    res.status(201).json(newComponent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComponent = async (req, res) => {
  try {
    const { name, description, code, tags, dependencies } = req.body;
    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }
    if (component.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this component' });
    }
    component.name = name || component.name;
    component.description = description || component.description;
    component.code = code || component.code;
    component.tags = tags || component.tags;
    component.dependencies = dependencies || component.dependencies;
    const updatedComponent = await component.save();
    res.json(updatedComponent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComponent = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }
    if (component.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this component' });
    }
    await component.deleteOne();
    res.json({ message: 'Component removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
