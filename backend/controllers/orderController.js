import orderService from '../services/orderService.js';
import websocketService from '../services/websocketService.js';
import ApiResponse from '../utils/apiResponse.js';

const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const order = await orderService.createOrder(userId, req.body);
    
    // Emit WebSocket event
    websocketService.emitOrderUpdate(order);

    res.status(201).json(
      new ApiResponse(201, { order }, 'Order created successfully')
    );
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json(
      new ApiResponse(500, null, error.message || 'Failed to create order')
    );
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.userId);
    res.json(new ApiResponse(200, { order }, 'Order fetched successfully'));
  } catch (error) {
    const status = error.message === 'Order not found' ? 404 : 500;
    res.status(status).json(new ApiResponse(status, null, error.message));
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const result = await orderService.getUserOrders(req.userId, { page, limit, status });
    res.json(new ApiResponse(200, result, 'Orders fetched successfully'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    
    // Emit WebSocket event
    websocketService.emitStatusChange(
      order._id,
      order.user._id,
      order.canteen._id,
      status
    );

    res.json(new ApiResponse(200, { order }, 'Order status updated'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

const submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const order = await orderService.submitFeedback(req.params.id, req.userId, { rating, comment });
    res.json(new ApiResponse(200, { order }, 'Feedback submitted successfully'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await orderService.cancelOrder(req.params.id, req.userId);
    
    // Emit WebSocket event
    websocketService.emitStatusChange(
      order._id,
      order.user,
      order.canteen,
      'cancelled'
    );

    res.json(new ApiResponse(200, { order }, 'Order cancelled successfully'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

const getCanteenOrders = async (req, res) => {
  try {
    const orders = await orderService.getCanteenActiveOrders(req.params.canteenId);
    res.json(new ApiResponse(200, { orders }, 'Canteen orders fetched'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export default {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  submitFeedback,
  cancelOrder,
  getCanteenOrders
};
