import express from 'express';
import orderController from '../controllers/orderController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/', auth, orderController.createOrder);
router.get('/user', auth, orderController.getUserOrders);
router.get('/:id', auth, orderController.getOrderById);
router.put('/:id/status', auth, orderController.updateOrderStatus);
router.post('/:id/feedback', auth, orderController.submitFeedback);

export default router;
