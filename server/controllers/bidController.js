const Bid = require('../models/Bid');
const Tender = require('../models/Tender');

// Submit Bid
exports.submitBid = async (req, res) => {
  try {
    const { amount, proposal } = req.body;
    const tenderId = req.params.tenderId;

    const tender = await Tender.findById(tenderId);
    if (!tender) return res.status(404).json({ message: 'Tender not found' });
    if (tender.status !== 'Open') return res.status(400).json({ message: 'Tender is not open for bidding' });

    const existing = await Bid.findOne({ tender: tenderId, vendor: req.user.id });
    if (existing) return res.status(400).json({ message: 'You have already submitted a bid for this tender' });

    const documents = req.files?.map(f => ({
      filename: f.filename,
      originalname: f.originalname
    })) || [];

    const bid = await Bid.create({
      tender: tenderId,
      vendor: req.user.id,
      amount, proposal, documents
    });

    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all bids for a tender (admin)
exports.getBidsByTender = async (req, res) => {
  try {
    const bids = await Bid.find({ tender: req.params.tenderId })
      .populate('vendor', 'name email company phone')
      .sort({ createdAt: -1 });
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all bids by vendor
exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ vendor: req.user.id })
      .populate('tender', 'title category budget deadline status')
      .sort({ createdAt: -1 });
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all bids (admin)
exports.getAllBids = async (req, res) => {
  try {
    const bids = await Bid.find()
      .populate('vendor', 'name email company')
      .populate('tender', 'title category budget')
      .sort({ createdAt: -1 });
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Accept bid (admin)
exports.acceptBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ message: 'Bid not found' });

    // Reject all other bids for same tender
    await Bid.updateMany(
      { tender: bid.tender, _id: { $ne: bid._id } },
      { status: 'Rejected' }
    );

    // Accept this bid
    bid.status = 'Accepted';
    await bid.save();

    // Mark tender as Awarded
    await Tender.findByIdAndUpdate(bid.tender, { status: 'Awarded' });

    res.json({ message: 'Bid accepted and tender awarded' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};