import { Server } from 'socket.io';

class WebSocketService {
  constructor() {
    this.io = null;
    this.userSockets = new Map();
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on('authenticate', (userId) => {
        this.userSockets.set(userId, socket.id);
        socket.userId = userId;
        console.log(`User ${userId} authenticated`);
      });

      socket.on('join-canteen', (canteenId) => {
        socket.join(`canteen-${canteenId}`);
        console.log(`Socket ${socket.id} joined canteen-${canteenId}`);
      });

      socket.on('disconnect', () => {
        if (socket.userId) {
          this.userSockets.delete(socket.userId);
        }
        console.log(`Client disconnected: ${socket.id}`);
      });
    });

    return this.io;
  }

  emitOrderUpdate(order) {
    if (!this.io) return;

    // Notify user
    const userSocketId = this.userSockets.get(order.user.toString());
    if (userSocketId) {
      this.io.to(userSocketId).emit('order-update', {
        orderId: order._id,
        status: order.status,
        estimatedTime: order.estimatedTime,
        message: this.getStatusMessage(order.status)
      });
    }

    // Notify canteen staff
    this.io.to(`canteen-${order.canteen}`).emit('new-order', {
      orderId: order._id,
      items: order.items,
      orderMode: order.orderMode,
      status: order.status
    });
  }

  emitStatusChange(orderId, userId, canteenId, status) {
    if (!this.io) return;

    const userSocketId = this.userSockets.get(userId.toString());
    if (userSocketId) {
      this.io.to(userSocketId).emit('status-changed', {
        orderId,
        status,
        message: this.getStatusMessage(status),
        timestamp: new Date()
      });
    }

    this.io.to(`canteen-${canteenId}`).emit('order-status-updated', {
      orderId,
      status
    });
  }

  emitWalletUpdate(userId, balance, transaction) {
    if (!this.io) return;

    const userSocketId = this.userSockets.get(userId.toString());
    if (userSocketId) {
      this.io.to(userSocketId).emit('wallet-update', {
        balance,
        transaction
      });
    }
  }

  getStatusMessage(status) {
    const messages = {
      pending: 'Order received! Waiting for confirmation',
      confirmed: 'Order confirmed! Preparing your food',
      preparing: 'Your order is being prepared',
      ready: 'Order ready for pickup!',
      completed: 'Order completed. Enjoy your meal!',
      cancelled: 'Order has been cancelled'
    };
    return messages[status] || 'Order status updated';
  }
}

export default new WebSocketService();
