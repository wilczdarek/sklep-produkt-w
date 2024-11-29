const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Konfiguracja CORS
app.use(cors({
    origin:  ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfiguracja MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sklep-produktow';
const mongooseOptions = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    family: 4,
    maxPoolSize: 10
};

// Połączenie z MongoDB
mongoose.connect(MONGODB_URI, mongooseOptions)
    .then(() => {
        console.log('Połączono z MongoDB');
        console.log('URI:', MONGODB_URI);
    })
    .catch(err => {
        console.error('Szczegóły błędu połączenia z MongoDB:', {
            name: err.name,
            message: err.message,
            code: err.code,
            codeName: err.codeName,
            stack: err.stack
        });
    });

// Dodatkowe logi dla zdarzeń mongoose
mongoose.connection.on('connecting', () => {
    console.log('Próba połączenia z MongoDB...');
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose połączony z MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Błąd połączenia Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose rozłączony z MongoDB');
});

// Import tras
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');

// Trasy API
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

// Obsługa błędów 404
app.use((req, res, next) => {
    res.status(404).json({ message: 'Nie znaleziono zasobu' });
});

// Globalny handler błędów
app.use((err, req, res, next) => {
    console.error('Błąd serwera:', err.stack);
    res.status(500).json({
        message: 'Wystąpił błąd serwera',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Konfiguracja portu
const PORT = process.env.PORT || 5001;

// Uruchomienie serwera
const server = app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});

// Obsługa zamknięcia serwera
process.on('SIGTERM', () => {
    console.log('Otrzymano sygnał SIGTERM. Zamykanie serwera...');
    server.close(() => {
        mongoose.connection.close(false, () => {
            console.log('Zamknięto połączenie z MongoDB');
            process.exit(0);
        });
    });
});

// Obsługa nieobsłużonych wyjątków
process.on('uncaughtException', (err) => {
    console.error('Nieobsłużony wyjątek:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Nieobsłużone odrzucenie obietnicy:', reason);
    process.exit(1);
});

module.exports = app;