const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const multer = require('multer');
const path = require('path');
const {
  submitBid, getBidsByTender,
  getMyBids, getAllBids, acceptBid
} = require('../controllers/bidController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.jpg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext) ? cb(null, true) : cb(new Error('Invalid file type'));
  }
});

router.post('/:tenderId', auth, upload.array('documents', 5), submitBid);
router.get('/my/bids', auth, getMyBids);
router.get('/all', auth, adminOnly, getAllBids);
router.get('/:tenderId', auth, adminOnly, getBidsByTender);
router.put('/:bidId/accept', auth, adminOnly, acceptBid);

module.exports = router;