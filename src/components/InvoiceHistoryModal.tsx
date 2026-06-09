import React from 'react';
import { InvoiceData } from '../types/invoice';
import { X, Clock, Trash2, Edit } from 'lucide-react';

interface InvoiceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: InvoiceData[];
  onLoad: (data: InvoiceData) => void;
  onDelete: (referenceNo: string) => void;
}

export const InvoiceHistoryModal: React.FC<InvoiceHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onLoad,
  onDelete,
}) => {
  if (!isOpen) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getGrandTotal = (data: InvoiceData) => {
    const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const totalDiscount = data.settings.showDiscount 
      ? data.items.reduce((sum, item) => sum + (item.quantity * item.price * (item.discount / 100)), 0)
      : 0;
    const totalTax = data.settings.showTax
      ? data.items.reduce((sum, item) => {
          const itemTotalAfterDiscount = (item.quantity * item.price) * (1 - item.discount / 100);
          return sum + (itemTotalAfterDiscount * (item.tax / 100));
        }, 0)
      : 0;
    return subtotal - totalDiscount + totalTax;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:hidden">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Riwayat Kuitansi</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>Belum ada riwayat kuitansi yang disimpan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((invoice, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors bg-gray-50 flex justify-between items-center group">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-blue-700">{invoice.referenceNo}</span>
                      <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">{invoice.date}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      Pelanggan: <span className="font-medium text-gray-800">{invoice.customerName || '-'}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      Total: Rp {formatCurrency(getGrandTotal(invoice))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onLoad(invoice);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Buka
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Yakin ingin menghapus kuitansi ini dari riwayat?')) {
                          onDelete(invoice.referenceNo);
                        }
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
