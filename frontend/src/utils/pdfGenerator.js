// Importy biblioteki pdfMake i czcionek
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Inicjalizacja czcionek dla pdfMake
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

export const generateOrderPDF = (order) => {
  try {
    // Pobieranie ostatnich 6 znaków ID zamówienia dla czytelności
    const shortId = order._id.slice(-6);
    
    // Definicja struktury dokumentu PDF
    const docDefinition = {
      content: [
        // Nagłówek dokumentu
        { 
          text: 'Potwierdzenie zamówienia',
          style: 'header'
        },
        // Szczegóły zamówienia
        {
          text: [
            `Numer zamówienia: #${shortId}\n`,
            `Data: ${new Date(order.createdAt).toLocaleString('pl-PL')}\n`,
            `Status: ${order.status}\n`,
          ],
          style: 'details'
        },
        // Tabela z produktami
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', 'auto'],
            body: [
              // Nagłówki tabeli
              [
                { text: 'Nazwa produktu', style: 'tableHeader' },
                { text: 'Kategoria', style: 'tableHeader' },
                { text: 'Ilość', style: 'tableHeader' }
              ],
              // Mapowanie produktów z zamówienia
              ...order.items.map(item => [
                item.product.name,
                item.product.category,
                item.quantity.toString()
              ])
            ]
          }
        },
        // Podsumowanie
        {
          text: `Łączna ilość produktów: ${order.totalQuantity}`,
          style: 'total'
        }
      ],
      // Style dokumentu
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        details: {
          fontSize: 12,
          margin: [0, 0, 0, 10]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        total: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 0]
        }
      }
    };

    // Tworzenie i zwracanie dokumentu PDF
    return pdfMake.createPdf(docDefinition);
  } catch (error) {
    console.error('Błąd podczas generowania PDF:', error);
    throw error;
  }
};