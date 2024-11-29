import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import ProductsList from './components/ProductsList';
import Cart from './components/Cart';
import CartIcon from './components/CartIcon';
import './App.css';

function App() {
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <CartProvider>
            <div className="app">
                <CartIcon onClick={() => setIsCartOpen(true)} />
                <ProductsList />
                <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </div>
        </CartProvider>
    );
}

export default App;
