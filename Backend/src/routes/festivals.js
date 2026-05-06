const express = require('express');
const router = express.Router();
const festivalController = require('../controllers/festivalController');
const { authMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', authMiddleware, upload.single('image'), festivalController.createFestival);
router.get('/', festivalController.getAllFestivals);
router.get('/by-category', festivalController.getFestivalsByCategory);
router.get('/:id', festivalController.getFestivalById);
router.put('/:id', authMiddleware, festivalController.updateFestival);
router.delete('/:id', authMiddleware, festivalController.deleteFestival);

module.exports = router;
