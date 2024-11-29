import React, { useState, useEffect } from 'react';
import { getProducts, updateProduct, deleteProduct, createProduct } from '../services/productService';
import { useCart } from '../context/CartContext';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import Toast from './Toast';
import './ProductsList.css';

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { dispatch } = useCart();
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            const sortedData = data.sort((a, b) => {
                if (a.createdAt && b.createdAt) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                return b._id.localeCompare(a._id);
            });
            setProducts(sortedData);
            setError(null);
        } catch (err) {
            console.error('Szczegóły błędu:', err);
            setError('Błąd podczas pobierania produktów: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryTranslation = (category) => {
        const translations = {
            'books': 'Książki',
            'electronics': 'Elektronika',
            'clothing': 'Ubrania',
            'sports': 'Sport',
            'home': 'Dom',
            'other': 'Inne'
        };
        return translations[category] || category;
    };

    const handleAddToCart = (product) => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: product
        });
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (updatedProduct) => {
        try {
            await updateProduct(updatedProduct._id, updatedProduct);
            await fetchProducts(); // Odświeżamy listę
            setIsEditModalOpen(false);
            setSelectedProduct(null);
            alert('Produkt został zaktualizowany!');
        } catch (error) {
            alert('Wystąpił błąd podczas aktualizacji produktu');
            console.error('Error updating product:', error);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten produkt?')) {
            try {
                await deleteProduct(productId);
                await fetchProducts(); // Odświeżamy listę
                alert('Produkt został usunięty!');
            } catch (error) {
                alert('Wystąpił błąd podczas usuwania produktu');
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleAddProduct = async (newProduct) => {
        try {
            const addedProduct = await createProduct(newProduct);
            setProducts(prevProducts => [addedProduct, ...prevProducts]);
            setIsAddModalOpen(false);
            setToast({
                show: true,
                message: 'Produkt został dodany pomyślnie!',
                type: 'success'
            });
        } catch (error) {
            setToast({
                show: true,
                message: 'Wystąpił błąd podczas dodawania produktu',
                type: 'error'
            });
            console.error('Error adding product:', error);
        }
    };

    if (loading) return <div className="loading">Ładowanie produktów...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="products-container">
            <div className="products-header">
                <h2>Lista Produktów</h2>
                <button 
                    className="add-product-btn"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Dodaj produkt
                </button>
            </div>
            
            <div className="table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Lp.</th>
                            <th>Nazwa produktu</th>
                            <th>Kategoria</th>
                            <th>Cena</th>
                            <th>Ilość</th>
                            <th>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product._id}>
                                <td>{index + 1}</td>
                                <td>{product.name}</td>
                                <td>{getCategoryTranslation(product.category)}</td>
                                <td>{product.price.toFixed(2)} zł</td>
                                <td>
                                    <span className={product.quantity > 0 ? 'in-stock' : 'out-of-stock'}>
                                        {product.quantity}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    <button 
                                        className="edit-btn"
                                        onClick={() => handleEdit(product)}
                                    >
                                        Edytuj
                                    </button>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDelete(product._id)}
                                    >
                                        Usuń
                                    </button>
                                    <button 
                                        className="add-to-cart-btn"
                                        disabled={product.quantity === 0}
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        Do koszyka
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                    duration={2000}
                />
            )}
            
            <AddProductModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddProduct}
            />
            
            <EditProductModal 
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedProduct(null);
                }}
                onSubmit={handleEditSubmit}
                product={selectedProduct}
            />
        </div>
    );
};

export default ProductsList;