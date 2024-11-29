const { Server } = require('socket.io');

class WebSocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket) => {
      console.log('Nowe połączenie WebSocket:', socket.id);

      socket.on('disconnect', () => {
        console.log('Rozłączono:', socket.id);
      });
    });
  }

  // Metoda do wysyłania powiadomień o niskim stanie magazynowym
  notifyLowStock(product) {
    this.io.emit('lowStock', {
      productId: product._id,
      name: product.name,
      quantity: product.quantity
    });
  }

  // Metoda do powiadamiania o nowym zamówieniu
  notifyNewOrder(order) {
    this.io.emit('newOrder', {
      orderNumber: order.orderNumber,
      totalQuantity: order.totalQuantity,
      createdAt: order.createdAt
    });
  }

  // Metoda do aktualizacji statusu produktu
  notifyProductUpdate(product) {
    this.io.emit('productUpdate', {
      productId: product._id,
      name: product.name,
      status: product.status,
      quantity: product.quantity
    });
  }
}

module.exports = WebSocketService;