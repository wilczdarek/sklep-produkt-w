const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Pobierz wszystkie zamówienia
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().lean();
        console.log('Pobrane zamówienia:', orders);
        res.json(orders);
    } catch (err) {
        console.error('Błąd podczas pobierania zamówień:', err);
        res.status(500).json({ message: err.message });
    }
});

// Pobierz pojedyncze zamówienie
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Nie znaleziono zamówienia' });
        }
    } catch (err) {
        console.error('Błąd podczas pobierania zamówienia:', err);
        res.status(500).json({ message: err.message });
    }
});

// Utwórz nowe zamówienie
router.post('/', async (req, res) => {
    try {
        const order = new Order({
            items: req.body.items,
            status: req.body.status || 'nowe',
            totalQuantity: req.body.totalQuantity
        });
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        console.error('Błąd podczas tworzenia zamówienia:', err);
        res.status(400).json({ message: err.message });
    }
});

// Aktualizuj status zamówienia
router.patch('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Nie znaleziono zamówienia' });
        }
        
        if (req.body.status) {
            order.status = req.body.status;
        }
        
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (err) {
        console.error('Błąd podczas aktualizacji zamówienia:', err);
        res.status(400).json({ message: err.message });
    }
});

// Usuń zamówienie
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Nie znaleziono zamówienia' });
        }
        await order.remove();
        res.json({ message: 'Zamówienie zostało usunięte' });
    } catch (err) {
        console.error('Błąd podczas usuwania zamówienia:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;