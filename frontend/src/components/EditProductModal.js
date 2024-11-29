import React, { useState, useEffect } from 'react';
import './AddProductModal.css'; // Wykorzystamy te same style co w AddProductModal

const EditProductModal = ({ isOpen, onClose, onSubmit, product }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: ''
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                category: product.category,
                price: product.price,
                quantity: product.quantity
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            _id: product._id,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity)
        });
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal">
                <div className="modal-header">
                    <h2>Edytuj produkt</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="add-product-form">
                    <div className="form-group">
                        <label htmlFor="name">Nazwa produktu</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Kategoria</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="books">Książki</option>
                            <option value="electronics">Elektronika</option>
                            <option value="clothing">Ubrania</option>
                            <option value="sports">Sport</option>
                            <option value="home">Dom</option>
                            <option value="other">Inne</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Cena</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity">Ilość</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Anuluj
                        </button>
                        <button type="submit" className="submit-btn">
                            Zapisz zmiany
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditProductModal; 