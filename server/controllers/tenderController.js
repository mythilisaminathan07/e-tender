const Tender = require('../models/Tender');

// POST - Create Tender
exports.createTender = async (req, res) => {
  try {
    const { title, description, category, budget, deadline } = req.body;
    const tender = await Tender.create({
      title, description, category, budget, deadline,
      postedBy: req.user.id
    });
    res.status(201).json(tender);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET - All Tenders
exports.getAllTenders = async (req, res) => {
  try {
    const tenders = await Tender.find().populate('postedBy', 'name').sort({ createdAt: -1 });
    res.json(tenders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET - Single Tender
exports.getTenderById = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id).populate('postedBy', 'name');
    if (!tender) return res.status(404).json({ message: 'Tender not found' });
    res.json(tender);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT - Update Tender Status
exports.updateTenderStatus = async (req, res) => {
  try {
    const tender = await Tender.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(tender);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE - Delete Tender
exports.deleteTender = async (req, res) => {
  try {
    await Tender.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tender deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};