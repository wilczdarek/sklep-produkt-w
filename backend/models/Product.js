const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nazwa produktu jest wymagana'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Kategoria jest wymagana'],
        enum: {
            values: ['books', 'electronics', 'clothing', 'sports', 'home', 'other'],
            message: '{VALUE} nie jest prawidłową kategorią'
        }
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Cena jest wymagana'],
        min: [0, 'Cena nie może być ujemna']
    },
    quantity: {
        type: Number,
        required: [true, 'Ilość jest wymagana'],
        min: [0, 'Ilość nie może być ujemna'],
        default: 0
    },
    imageUrl: {
        type: String,
        default: 'default-product-image.jpg'
    },
    isAvailable: {
        type: Boolean,
        default: function() {
            return this.quantity > 0;
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Wirtualne pole do formatowania ceny
productSchema.virtual('formattedPrice').get(function() {
    return `${this.price.toFixed(2)} zł`;
});

// Metoda do sprawdzania czy produkt jest na stanie
productSchema.methods.checkAvailability = function() {
    return this.quantity > 0;
};

// Metoda do aktualizacji ilości
productSchema.methods.updateQuantity = function(newQuantity) {
    this.quantity = Math.max(0, newQuantity);
    this.isAvailable = this.quantity > 0;
    return this.save();
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 