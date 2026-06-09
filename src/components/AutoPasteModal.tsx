import React, { useState } from 'react';
import { InvoiceData, InvoiceItem } from '../types/invoice';
import { X, ClipboardPaste, CheckCircle2 } from 'lucide-react';
import { defaultInvoiceData } from '../constants/defaultData';

interface AutoPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: Partial<InvoiceData>) => void;
}

export const AutoPasteModal: React.FC<AutoPasteModalProps> = ({ isOpen, onClose, onApply }) => {
  const [text, setText] = useState('');
  
  const cleanNumber = (str: string) => {
    if (!str) return 0;
    const s = str.replace(/Rp/gi, '').replace(/\./g, '').split(',')[0].trim();
    return parseInt(s) || 0;
  };

  const extractValue = (lines: string[], keyword: string, separator = ':') => {
    const line = lines.find(l => l.toLowerCase().includes(keyword.toLowerCase()));
    if (line) {
      const parts = line.split(separator);
      if (parts.length > 1) {
        return parts.slice(1).join(separator).trim();
      }
    }
    return '';
  };

  const handleApply = () => {
    if (!text.trim()) return;

    // Filter out completely empty lines but keep structure, split by newline and tab to handle Excel pastes
    const lines = text.split(/[\n\t]+/).map(l => l.trim()).filter(l => l.length > 0);
    
    const partialData: Partial<InvoiceData> = {
      items: [],
      settings: { ...defaultInvoiceData.settings }
    };

    try {
      // 1. Company Info
      if (lines.length > 0 && !lines[0].toLowerCase().includes('invoice')) {
        partialData.companyName = lines[0];
      }
      if (lines.length > 1 && !lines[1].toLowerCase().includes('invoice') && !lines[1].includes(':')) {
        partialData.companyAddress = lines[1];
      }
      if (lines.length > 2 && !lines[2].toLowerCase().includes('invoice') && !lines[2].includes(':')) {
        partialData.companyPhone = lines[2];
      }

      // 2. Meta Data
      const ref = extractValue(lines, 'Referensi');
      if (ref) partialData.referenceNo = ref;
      
      const date = extractValue(lines, 'Tanggal');
      if (date) partialData.date = date;
      
      const dueDate = extractValue(lines, 'Tgl. Jatuh Tempo');
      if (dueDate) partialData.dueDate = dueDate;
      
      const status = extractValue(lines, 'Status');
      if (status && partialData.settings) {
        partialData.settings.status = status;
      }

      // 3. Customer Info
      const tagihanIndex = lines.findIndex(l => l.toLowerCase().includes('tagihan kepada'));
      if (tagihanIndex !== -1) {
        if (tagihanIndex + 1 < lines.length) partialData.customerName = lines[tagihanIndex + 1];
        if (tagihanIndex + 2 < lines.length) partialData.customerAddress = lines[tagihanIndex + 2];
        if (tagihanIndex + 3 < lines.length) partialData.customerPhone = lines[tagihanIndex + 3];
        if (tagihanIndex + 4 < lines.length && lines[tagihanIndex + 4].includes('@')) {
          partialData.customerEmail = lines[tagihanIndex + 4];
        } else if (tagihanIndex + 4 < lines.length && !lines[tagihanIndex + 4].includes('@') && lines[tagihanIndex + 4].toLowerCase() !== 'produk') {
           // Maybe no email, just ignore if it's "Produk"
        }
      }

      // 4. Items
      const jumlahIndex = lines.findIndex(l => l.toLowerCase() === 'jumlah');
      const subtotalIndex = lines.findIndex(l => l.toLowerCase() === 'subtotal');
      
      if (jumlahIndex !== -1 && subtotalIndex !== -1 && subtotalIndex > jumlahIndex) {
        const itemLines = lines.slice(jumlahIndex + 1, subtotalIndex);
        const items: InvoiceItem[] = [];
        for (let i = 0; i < itemLines.length; i += 7) {
          if (i + 6 < itemLines.length) {
            const qtyStr = itemLines[i + 2];
            const qtyMatch = qtyStr.match(/(\d+)\s*(.*)/);
            const quantity = qtyMatch ? parseInt(qtyMatch[1]) : 1;
            const unit = qtyMatch && qtyMatch[2] ? qtyMatch[2].trim() : 'pcs';

            const price = cleanNumber(itemLines[i + 3]);
            
            const discStr = itemLines[i + 4];
            const discount = parseInt(discStr.replace('%', '')) || 0;
            
            const taxStr = itemLines[i + 5];
            const tax = parseInt(taxStr.replace(/[^\d]/g, '')) || 0;

            items.push({
              id: Math.random().toString(36).substr(2, 9),
              product: itemLines[i],
              description: itemLines[i + 1],
              quantity,
              unit,
              price,
              discount,
              tax
            });
          }
        }
        if (items.length > 0) {
          partialData.items = items;
        }
      }

      // 4.5 Amount Paid (Default to fully paid by reading Total)
      const totalIndex = lines.findIndex(l => l.toLowerCase() === 'total' || l.toLowerCase().startsWith('total rp'));
      if (totalIndex !== -1) {
        const lineText = lines[totalIndex];
        let numStr = lineText.toLowerCase().replace('total', '').trim();
        if (!numStr && totalIndex + 1 < lines.length) {
          numStr = lines[totalIndex + 1];
        }
        if (numStr) {
          partialData.amountPaid = cleanNumber(numStr);
          if (partialData.settings) {
            partialData.settings.status = 'Lunas';
          }
        }
      }

      // 5. Notes / Pesan
      const pesanIndex = lines.findIndex(l => l.toLowerCase() === 'pesan');
      const hormatIndex = lines.findIndex(l => l.toLowerCase().includes('dengan hormat'));
      
      if (pesanIndex !== -1) {
        const endIdx = hormatIndex !== -1 ? hormatIndex : lines.length;
        const notesLines = lines.slice(pesanIndex + 1, endIdx);
        partialData.notes = notesLines.join('\n').trim();
      }

      // 6. Signatory
      if (hormatIndex !== -1 && hormatIndex + 1 < lines.length) {
        partialData.signatoryName = lines[hormatIndex + 1];
      }

    } catch (e) {
      console.error('Error parsing text:', e);
      alert('Terjadi kesalahan saat membaca teks. Sebagian data mungkin tidak terbaca sempurna.');
    }

    onApply(partialData);
    setText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:hidden">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ClipboardPaste className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-800">Auto-Isi dari Teks (Paste)</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Paste/Tempel teks kuitansi (dari WhatsApp, Excel, dll) ke dalam kotak di bawah ini. Sistem akan secara cerdas mengisi seluruh kolom secara otomatis!
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Toko Besi Jaya&#10;Jl. Pasar Baru&#10;...&#10;Tagihan Kepada&#10;..."
            className="w-full h-[300px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none font-mono text-sm"
          />
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleApply}
            disabled={!text.trim()}
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Terapkan Data
          </button>
        </div>
      </div>
    </div>
  );
};
