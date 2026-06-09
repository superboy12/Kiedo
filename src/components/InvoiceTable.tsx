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
    'minmax(0, 2fr)', // Produk
    'minmax(0, 3fr)', // Deskripsi
    'minmax(0, 1fr)', // Kuantitas
    'minmax(0, 1.5fr)', // Harga
    data.settings.showDiscount ? 'minmax(0, 1fr)' : null,
    data.settings.showTax ? 'minmax(0, 1.5fr)' : null,
    'minmax(0, 1.5fr)', // Jumlah
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
            className="grid group border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors relative"
            style={{ gridTemplateColumns: gridColumns }}
          >
            <div className="p-3">
              <EditableField
                value={item.product}
                onChange={(val) => handleItemChange(index, 'product', val)}
                className="bg-transparent"
              />
            </div>
            <div className="p-3 text-gray-500">
              <EditableField
                value={item.description}
                onChange={(val) => handleItemChange(index, 'description', val)}
                className="bg-transparent"
                multiline={true}
              />
            </div>
            <div className="p-3 flex justify-center items-center gap-1">
              <EditableField
                type="number"
                value={item.quantity.toString()}
                onChange={(val) => handleItemChange(index, 'quantity', Number(val))}
                align="center"
                className="bg-transparent w-12"
              />
              <select 
                value={item.unit || 'pcs'} 
                onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                className="bg-transparent text-gray-600 outline-none cursor-pointer text-left hover:bg-gray-100 p-1 rounded"
              >
                <option value="pcs">pcs</option>
                <option value="lbr">lbr</option>
                <option value="sak">sak</option>
                <option value="meter">meter</option>
                <option value="m²">m²</option>
                <option value="m³">m³</option>
                <option value="hari">hari</option>
                <option value="unit">unit</option>
                <option value="set">set</option>
                <option value="kg">kg</option>
                <option value="ls">ls</option>
                <option value="">-</option>
              </select>
            </div>
            <div className="p-3 flex justify-between items-start">
              <span className="text-gray-600 mr-2">Rp</span>
              <EditableField
                type="number"
                value={item.price.toString()}
                onChange={(val) => handleItemChange(index, 'price', Number(val))}
                align="right"
                className="bg-transparent w-full"
                displayValue={formatCurrency(item.price)}
              />
            </div>
            {data.settings.showDiscount && (
              <div className="p-3 whitespace-nowrap text-center">
                <EditableField
                  type="number"
                  value={item.discount.toString()}
                  onChange={(val) => handleItemChange(index, 'discount', Number(val))}
                  align="center"
                  className="bg-transparent inline-block w-8"
                />
                <span className="text-gray-500 ml-1">%</span>
              </div>
            )}
            {data.settings.showTax && (
              <div className="p-3 whitespace-nowrap text-center text-gray-500">
                <EditableField
                  value={item.tax.toString()}
                  onChange={(val) => handleItemChange(index, 'tax', Number(val))}
                  align="center"
                  className="bg-transparent inline-block w-8 mr-1 text-gray-800"
                />
                %
              </div>
            )}
            <div className="p-3 flex justify-between items-start font-medium">
              <span className="text-gray-600 mr-2">Rp</span>
              <div className="text-right">
                {formatCurrency(calculateRowTotal(item))}
              </div>
            </div>
            <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
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
    </div>
  );
};
