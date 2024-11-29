const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    // Sprawdź wszystkie produkty przed jakimikolwiek zmianami
    const productChecks = await Promise.all(
      req.body.items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Produkt o ID ${item.product} nie istnieje`);
        }
        if (product.quantity < item.quantity) {
          throw new Error(
            `Niewystarczająca ilość produktu "${product.name}". Dostępne: ${product.quantity}, Zamawiane: ${item.quantity}`
          );
        }
        return { product, requestedQuantity: item.quantity };
      })
    );

    // Jeśli wszystkie sprawdzenia przeszły, tworzymy zamówienie
    const order = new Order(req.body);

    // Aktualizujemy stany magazynowe
    await Promise.all(
      productChecks.map(async ({ product, requestedQuantity }) => {
        product.quantity -= requestedQuantity;
        
        // Aktualizacja statusu
        if (product.quantity === 0) {
          product.status = 'niedostępny';
        } else if (product.quantity <= 5) {
          product.status = 'mało';
        }
        
        await product.save();
      })
    );

    const savedOrder = await order.save();
    await savedOrder.populate('items.product');
    
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Błąd podczas tworzenia zamówienia:', error);
    res.status(400).json({ 
      message: error.message || 'Błąd podczas tworzenia zamówienia'
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Zamówienie nie znalezione' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
