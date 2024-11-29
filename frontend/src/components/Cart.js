import React from 'react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = ({ isOpen, onClose }) => {
    const { cart, dispatch } = useCart();

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity < 1) return;
        dispatch({
            type: 'UPDATE_QUANTITY',
            payload: { id, quantity: parseInt(newQuantity) }
        });
    };

    const handleRemoveItem = (id) => {
        dispatch({
            type: 'REMOVE_FROM_CART',
            payload: id
        });
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handlePlaceOrder = async () => {
        try {
            // Tutaj możemy dodać logikę wysyłania zamówienia do API
            console.log('Składanie zamówienia:', {
                items: cart,
                totalAmount: calculateTotal()
            });
            
            // Po udanym złożeniu zamówienia możemy wyczyścić koszyk
            dispatch({ type: 'CLEAR_CART' });
            
            // Zamknij panel koszyka
            onClose();
            
            // Możemy dodać powiadomienie o sukcesie
            alert('Zamówienie zostało złożone pomyślnie!');
            
        } catch (error) {
            console.error('Błąd podczas składania zamówienia:', error);
            alert('Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.');
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="cart-overlay" onClick={onClose}></div>
            <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>Koszyk</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                {cart.length === 0 ? (
                    <div className="cart-empty">Koszyk jest pusty</div>
                ) : (
                    <>
                        <div className="cart-items">
                            {cart.map(item => (
                                <div key={item._id} className="cart-item">
                                    <div className="item-details">
                                        <h3>{item.name}</h3>
                                        <p className="item-price">{item.price.toFixed(2)} zł</p>
                                    </div>
                                    <div className="item-controls">
                                        <div className="quantity-controls">
                                            <button 
                                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                                            />
                                            <button 
                                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button 
                                            className="remove-btn"
                                            onClick={() => handleRemoveItem(item._id)}
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                    <div className="item-total">
                                        Suma: {(item.price * item.quantity).toFixed(2)} zł
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="cart-footer">
                            <div className="cart-total">
                                <strong>Suma całkowita:</strong>
                                <span>{calculateTotal().toFixed(2)} zł</span>
                            </div>
                            <button 
                                className="order-btn"
                                onClick={handlePlaceOrder}
                            >
                                Złóż zamówienie
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Cart;
