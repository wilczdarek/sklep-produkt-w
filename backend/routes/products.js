const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Pobierz wszystkie produkty
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().lean();
        console.log('Pobrane produkty:', products);
        res.json(products);
    } catch (err) {
        console.error('Błąd podczas pobierania produktów:', err);
        res.status(500).json({ message: err.message });
    }
});

// Dodaj nowy produkt
router.post('/', async (req, res) => {
    try {
        console.log('Otrzymane dane produktu:', req.body);
        
        const product = new Product({
            name: req.body.name,
            category: req.body.category.toLowerCase(), // konwertujemy na małe litery
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity
        });

        const newProduct = await product.save();
        console.log('Zapisany produkt:', newProduct);
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Szczegóły błędu:', {
            name: err.name,
            message: err.message,
            errors: err.errors
        });
        
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Błąd walidacji',
                details: Object.values(err.errors).map(error => ({
                    field: error.path,
                    message: error.message
                }))
            });
        }
        
        res.status(500).json({ message: 'Błąd podczas dodawania produktu' });
    }
});

// Pobierz pojedynczy produkt
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Nie znaleziono produktu' });
        }
    } catch (err) {
        console.error('Błąd podczas pobierania produktu:', err);
        res.status(500).json({ message: err.message });
    }
});

// Aktualizuj produkt
router.patch('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Nie znaleziono produktu' });
        }

        if (req.body.name) product.name = req.body.name;
        if (req.body.category) product.category = req.body.category;
        if (req.body.description) product.description = req.body.description;
        if (req.body.price) product.price = req.body.price;
        if (req.body.quantity !== undefined) product.quantity = req.body.quantity;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        console.error('Błąd podczas aktualizacji produktu:', err);
        res.status(400).json({ message: err.message });
    }
});

// Usuń produkt
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Nie znaleziono produktu' });
        }
        await product.deleteOne();
        res.json({ message: 'Produkt został usunięty' });
    } catch (err) {
        console.error('Błąd podczas usuwania produktu:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;