const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const {
  createTender,
  getAllTenders,
  getTenderById,
  updateTenderStatus,
  deleteTender
} = require('../controllers/tenderController');

router.post('/', auth, adminOnly, createTender);
router.get('/', auth, getAllTenders);
router.get('/:id', auth, getTenderById);
router.put('/:id/status', auth, adminOnly, updateTenderStatus);
router.delete('/:id', auth, adminOnly, deleteTender);

module.exports = router;