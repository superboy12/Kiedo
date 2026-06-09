import React from 'react';
import { InvoiceData, InvoiceItem } from '../types/invoice';
import { EditableField } from './EditableField';

interface InvoiceTableTemplate2Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export const InvoiceTableTemplate2: React.FC<InvoiceTableTemplate2Props> = ({ data, onChange }) => {
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
    if (data.items.length === 1) return;
    const newItems = [...data.items];
    newItems.splice(index, 1);
    onChange({ ...data, items: newItems });
  };

  const calculateRowTotal = (item: InvoiceItem) => {
    let total = item.quantity * item.price;
    if (data.settings.showDiscount) {
      total = total - (total * (item.discount / 100));
    }
    return total;
  };

  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const totalTax = data.settings.showTax
    ? data.items.reduce((sum, item) => {
        const itemTotalAfterDiscount = (item.quantity * item.price) * (1 - item.discount / 100);
        return sum + (itemTotalAfterDiscount * (item.tax / 100));
      }, 0)
    : 0;
  const grandTotal = subtotal + totalTax;

  return (
    <div className="w-full text-sm">
      <div className="flex font-bold border border-black bg-white">
        <div className="flex-[2] p-2 border-r border-black">Produk</div>
        <div className="flex-[3] p-2 border-r border-black">Deskripsi</div>
        <div className="flex-1 p-2 border-r border-black text-center">Kuantitas</div>
        <div className="flex-[1.5] p-2 border-r border-black text-center">Harga</div>
        {data.settings.showDiscount && <div className="flex-1 p-2 border-r border-black text-center">Diskon</div>}
        {data.settings.showTax && <div className="flex-1 p-2 border-r border-black text-center">Pajak</div>}
        <div className="flex-[1.5] p-2 text-center">Jumlah</div>
      </div>

      <div className="flex flex-col border-l border-r border-b border-black">
        {data.items.map((item, index) => (
          <div key={item.id} className="flex group border-b border-black last:border-b-0 relative">
            <div className="flex-[2] p-2 border-r border-black flex items-center">
              <EditableField
                value={item.product}
                onChange={(val) => handleItemChange(index, 'product', val)}
                className="bg-transparent"
              />
            </div>
            <div className="flex-[3] p-2 border-r border-black flex items-center">
              <EditableField
                value={item.description}
                onChange={(val) => handleItemChange(index, 'description', val)}
                className="bg-transparent"
              />
            </div>
            <div className="flex-1 p-2 border-r border-black flex items-center justify-center">
              <EditableField
                type="number"
                value={item.quantity.toString()}
                onChange={(val) => handleItemChange(index, 'quantity', Number(val))}
                align="center"
                className="bg-transparent"
              />
            </div>
            <div className="flex-[1.5] p-2 border-r border-black flex items-center justify-end">
              <EditableField
                type="number"
                value={item.price.toString()}
                onChange={(val) => handleItemChange(index, 'price', Number(val))}
                align="right"
                className="bg-transparent"
              />
            </div>
            {data.settings.showDiscount && (
              <div className="flex-1 p-2 border-r border-black flex items-center justify-center">
                <EditableField
                  type="number"
                  value={item.discount.toString()}
                  onChange={(val) => handleItemChange(index, 'discount', Number(val))}
                  align="center"
                  className="bg-transparent"
                />
                %
              </div>
            )}
            {data.settings.showTax && (
              <div className="flex-1 p-2 border-r border-black flex items-center justify-center">
                PPN <EditableField
                  value={item.tax.toString()}
                  onChange={(val) => handleItemChange(index, 'tax', Number(val))}
                  align="center"
                  className="bg-transparent inline-block w-8 mx-1"
                />%
              </div>
            )}
            <div className="flex-[1.5] p-2 flex items-center justify-end">
              {formatCurrency(calculateRowTotal(item)).replace('Rp', '').trim()}
            </div>
            
            <div className="absolute -right-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 font-bold px-2">&times;</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 print:hidden">
        <button
          onClick={addItem}
          className="text-blue-500 border border-blue-500 px-4 py-2 rounded text-sm hover:bg-blue-50 flex items-center gap-1 transition-colors"
        >
          <span>+</span> Tambah Produk
        </button>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end mt-0">
        <div className="w-[350px] border-l border-r border-b border-black">
          <div className="flex border-b border-black">
            <div className="flex-1 p-2 border-r border-black">Subtotal</div>
            <div className="flex-1 p-2 text-right">{formatCurrency(subtotal)}</div>
          </div>
          {data.settings.showTax && (
            <div className="flex border-b border-black">
              <div className="flex-1 p-2 border-r border-black">Pajak</div>
              <div className="flex-1 p-2 text-right">{formatCurrency(totalTax)}</div>
            </div>
          )}
          <div className="flex border-b border-black">
            <div className="flex-1 p-2 border-r border-black">Total</div>
            <div className="flex-1 p-2 text-right">{formatCurrency(grandTotal)}</div>
          </div>
          <div className="flex border-b border-black">
            <div className="flex-1 p-2 border-r border-black">Pembayaran Diterima</div>
            <div className="flex-1 p-2 text-right">{formatCurrency(922636.36)}</div>
          </div>
          <div className="flex">
            <div className="flex-1 p-2 border-r border-black">Sisa Tagihan</div>
            <div className="flex-1 p-2 text-right">{formatCurrency(72363.64)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
