const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/stats', authMiddleware, adminMiddleware, adminController.getDashboardStats);
router.get('/users', authMiddleware, adminMiddleware, adminController.getAllUsers);
router.get('/users/normal', authMiddleware, adminMiddleware, adminController.getNormalUsers);
router.delete('/users/:id', authMiddleware, adminMiddleware, adminController.deleteUser);
router.put('/users/:id/make-admin', authMiddleware, adminMiddleware, adminController.makeUserAdmin);

module.exports = router;
