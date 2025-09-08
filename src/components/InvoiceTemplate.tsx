'use client';

import { forwardRef } from 'react';

interface InvoiceTemplateProps {
  invoice: {
    invoice_number: string;
    customer_name: string;
    customer_email: string;
    customer_address: string;
    customer_tax_number: string;
    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    total_amount: number;
    invoice_date: string;
    due_date: string;
    notes: string;
  };
  items: Array<{
    product_name: string;
    description: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  companyInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    taxNumber: string;
    logo?: string;
  };
}

const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ invoice, items, companyInfo }, ref) => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(amount);
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('tr-TR');
    };

    return (
      <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">FATURA</h1>
            <div className="text-sm text-gray-600">
              <p><strong>Fatura No:</strong> {invoice.invoice_number}</p>
              <p><strong>Fatura Tarihi:</strong> {formatDate(invoice.invoice_date)}</p>
              {invoice.due_date && (
                <p><strong>Vade Tarihi:</strong> {formatDate(invoice.due_date)}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{companyInfo.name}</h2>
            <div className="text-sm text-gray-600">
              <p>{companyInfo.address}</p>
              <p>Tel: {companyInfo.phone}</p>
              <p>E-posta: {companyInfo.email}</p>
              <p>Vergi No: {companyInfo.taxNumber}</p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Fatura Edilecek</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold text-gray-900">{invoice.customer_name}</p>
            {invoice.customer_address && (
              <p className="text-gray-600">{invoice.customer_address}</p>
            )}
            {invoice.customer_email && (
              <p className="text-gray-600">E-posta: {invoice.customer_email}</p>
            )}
            {invoice.customer_tax_number && (
              <p className="text-gray-600">Vergi No: {invoice.customer_tax_number}</p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Ürün/Hizmet</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Açıklama</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Miktar</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Birim Fiyat</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Toplam</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{item.product_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.unit_price)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.total_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="font-semibold">Ara Toplam:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span>KDV (%{invoice.tax_rate}):</span>
              <span>{formatCurrency(invoice.tax_amount)}</span>
            </div>
            <div className="flex justify-between py-3 text-lg font-bold bg-gray-100 px-4 rounded">
              <span>TOPLAM:</span>
              <span>{formatCurrency(invoice.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Notlar</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{invoice.notes}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 border-t border-gray-300 pt-4">
          <p>Bu fatura elektronik ortamda oluşturulmuştur.</p>
          <p>Ödeme yapıldıktan sonra fatura geçerlidir.</p>
        </div>
      </div>
    );
  }
);

InvoiceTemplate.displayName = 'InvoiceTemplate';

export default InvoiceTemplate;
