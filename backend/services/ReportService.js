const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendEmail } = require('../config/email');

class ReportService {
  static async generateDailyReport() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const orders = await Order.find({
      createdAt: { 
        $gte: yesterday,
        $lt: today 
      }
    });

    const products = await Product.find({
      quantity: { $lt: 10 } // produkty z niskim stanem
    });

    const reportData = {
      ordersCount: orders.length,
      totalItems: orders.reduce((sum, order) => sum + order.totalQuantity, 0),
      lowStockProducts: products.map(p => ({
        name: p.name,
        quantity: p.quantity
      }))
    };

    return reportData;
  }

  static async sendDailyReport(email) {
    const report = await this.generateDailyReport();
    
    const html = `
      <h2>Raport dzienny</h2>
      <p>Liczba zamówień: ${report.ordersCount}</p>
      <p>Łączna ilość zamówionych produktów: ${report.totalItems}</p>
      
      <h3>Produkty z niskim stanem magazynowym:</h3>
      <ul>
        ${report.lowStockProducts.map(p => 
          `<li>${p.name} - pozostało: ${p.quantity} szt.</li>`
        ).join('')}
      </ul>
    `;

    return sendEmail({
      to: email,
      subject: 'Raport dzienny - Sklep produktów',
      html
    });
  }
}

module.exports = ReportService;