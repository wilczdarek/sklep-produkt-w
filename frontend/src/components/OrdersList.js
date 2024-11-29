import React, { useState, useEffect } from 'react';
import { generateOrderPDF } from '../utils/pdfGenerator';

const OrdersList = () => {
  // Inicjalizacja state jako pustej tablicy
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/orders');
      const data = await response.json();
      
      // Sprawdzenie czy data jest tablicą
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data.orders && Array.isArray(data.orders)) {
        // Jeśli dane są zagnieżdżone w obiekcie
        setOrders(data.orders);
      } else {
        console.error('Otrzymane dane nie są tablicą:', data);
        setOrders([]); // Ustaw pustą tablicę w przypadku błędu
      }
    } catch (error) {
      console.error('Błąd podczas pobierania zamówień:', error);
      setOrders([]); // Ustaw pustą tablicę w przypadku błędu
    }
  };

  const handleGeneratePDF = (order) => {
    try {
      const pdf = generateOrderPDF(order);
      pdf.open();
    } catch (error) {
      console.error('Błąd podczas generowania PDF:', error);
      alert('Wystąpił błąd podczas generowania PDF');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders(); // Odświeżenie listy po aktualizacji
      } else {
        throw new Error('Błąd podczas aktualizacji statusu');
      }
    } catch (error) {
      console.error('Błąd:', error);
      alert('Nie udało się zaktualizować statusu zamówienia');
    }
  };

  // Dodaj sprawdzenie czy orders jest tablicą przed renderowaniem
  if (!Array.isArray(orders)) {
    return <div>Ładowanie zamówień...</div>;
  }

  return (
    <div className="orders-list">
      <h2>Lista zamówień</h2>
      {orders.length === 0 ? (
        <p>Brak zamówień</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Status</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-6)}</td>
                <td>{new Date(order.createdAt).toLocaleString('pl-PL')}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="nowe">Nowe</option>
                    <option value="w realizacji">W realizacji</option>
                    <option value="zrealizowane">Zrealizowane</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleGeneratePDF(order)}>
                    Generuj PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersList;