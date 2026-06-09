import React from 'react';
import { InvoiceData, InvoiceItem } from '../types/invoice';
import { EditableField } from './EditableField';

interface InvoiceTableProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({ data, onChange }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    onChange({
      ...data,
      items: [
        ...data.items,
        {
          id: Math.random().toString(36).substr(2, 9),
          product: 'Produk Baru',
          description: 'Deskripsi',
          quantity: 1,
          price: 0,
          discount: 0,
          tax: 10,
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    if (data.items.length === 1) return; // keep at least one
    const newItems = [...data.items];
    newItems.splice(index, 1);
    onChange({ ...data, items: newItems });
  };

  const calculateRowTotal = (item: InvoiceItem) => {
    let total = item.quantity * item.price;
    if (data.settings.showDiscount) {
      total = total - (total * (item.discount / 100));
    }
    // Note: Tax in the reference invoice is applied to the subtotal of the invoice, 
    // or to individual items? In the example, "Pajak PPN 10%" and the Total includes tax.
    // The "Jumlah" column usually doesn't include tax in some templates, but in the provided image:
    // Harga 199.000, Diskon 0%, Pajak PPN 10%, Jumlah 597.000 (for Qty 3).
    // This means "Jumlah" is exactly Qty * Harga * (1 - Diskon). Tax is calculated at the bottom.
    return total;
  };

  const gridColumns = [
    '2fr', // Produk
    '3fr', // Deskripsi
    '1fr', // Kuantitas
    '1.5fr', // Harga
    data.settings.showDiscount ? '1fr' : null,
    data.settings.showTax ? '1.5fr' : null,
    '1.5fr', // Jumlah
    '30px' // delete button spacing
  ].filter(Boolean).join(' ');

  return (
    <div className="w-full">
      <div 
        className="bg-[#2F3E56] text-white grid items-center h-[45px] px-4 font-bold text-sm mt-8"
        style={{ gridTemplateColumns: gridColumns }}
      >
        <div>Produk</div>
        <div>Deskripsi</div>
        <div className="text-right">Kuantitas</div>
        <div className="text-right">Harga</div>
        {data.settings.showDiscount && <div className="text-right">Diskon</div>}
        {data.settings.showTax && <div className="text-right">Pajak</div>}
        <div className="text-right">Jumlah</div>
        <div></div> {/* For delete button */}
      </div>

      <div className="flex flex-col">
        {data.items.map((item, index) => (
          <div 
            key={item.id} 
            className="grid min-h-[45px] items-center px-4 bg-[#F4F5F7] border-b border-gray-200 text-sm group relative"
            style={{ gridTemplateColumns: gridColumns }}
          >
            <div className="pr-2 py-2">
              <EditableField
                value={item.product}
                onChange={(val) => handleItemChange(index, 'product', val)}
                className="font-medium text-gray-800 bg-transparent"
              />
            </div>
            <div className="px-2 py-2 border-l border-gray-200">
              <EditableField
                value={item.description}
                onChange={(val) => handleItemChange(index, 'description', val)}
                className="text-gray-600 bg-transparent"
              />
            </div>
            <div className="px-2 py-2 border-l border-gray-200">
              <EditableField
                type="number"
                value={item.quantity.toString()}
                onChange={(val) => handleItemChange(index, 'quantity', Number(val))}
                align="right"
                className="bg-transparent"
              />
            </div>
            <div className="px-2 py-2 border-l border-gray-200">
              <EditableField
                type="number"
                value={item.price.toString()}
                onChange={(val) => handleItemChange(index, 'price', Number(val))}
                align="right"
                className="bg-transparent"
              />
            </div>
            {data.settings.showDiscount && (
              <div className="px-2 py-2 border-l border-gray-200">
                <EditableField
                  type="number"
                  value={item.discount.toString()}
                  onChange={(val) => handleItemChange(index, 'discount', Number(val))}
                  align="right"
                  className="bg-transparent"
                />
              </div>
            )}
            {data.settings.showTax && (
              <div className="px-2 py-2 border-l border-gray-200 text-right text-gray-600">
                <EditableField
                  value={item.tax.toString()}
                  onChange={(val) => handleItemChange(index, 'tax', Number(val))}
                  align="right"
                  className="bg-transparent inline-block w-12"
                />
              </div>
            )}
            <div className="pl-2 py-2 border-l border-gray-200 text-right text-gray-800">
              {formatCurrency(calculateRowTotal(item)).replace('Rp', '').trim()}
            </div>
            <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
              <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 font-bold px-2">&times;</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button
          onClick={addItem}
          className="text-blue-500 border border-blue-500 px-4 py-2 rounded text-sm hover:bg-blue-50 flex items-center gap-1 transition-colors"
        >
          <span>+</span> Tambah Produk
        </button>
      </div>
    </div>
  );
};
