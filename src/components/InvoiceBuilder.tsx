'use client';

import React, { useRef, useState, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import { InvoicePreview } from './InvoicePreview';
import { InvoicePreviewTemplate2 } from './InvoicePreviewTemplate2';
import { defaultInvoiceData } from '../constants/defaultData';
import { useAutosave } from '../hooks/useAutosave';
import { Download, Save, History, FilePlus, ClipboardPaste } from 'lucide-react';
import { InvoiceData } from '../types/invoice';
import { InvoiceHistoryModal } from './InvoiceHistoryModal';
import { AutoPasteModal } from './AutoPasteModal';

export default function InvoiceBuilder() {
  const [data, setData] = useAutosave('invoice-data-v1', defaultInvoiceData);
  const [history, setHistory] = useState<InvoiceData[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isAutoPasteOpen, setIsAutoPasteOpen] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Load history from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('invoice-history-v1');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  const saveHistoryToStorage = (newHistory: InvoiceData[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('invoice-history-v1', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  };

  const handleSaveToHistory = () => {
    // Clone data to avoid reference issues
    const newEntry = JSON.parse(JSON.stringify(data));
    
    // Check if an invoice with the same reference number already exists
    const existingIndex = history.findIndex(item => item.referenceNo === newEntry.referenceNo);
    
    let updatedHistory;
    if (existingIndex >= 0) {
      // Update existing
      updatedHistory = [...history];
      updatedHistory[existingIndex] = newEntry;
    } else {
      // Add new at the beginning
      updatedHistory = [newEntry, ...history];
    }
    
    saveHistoryToStorage(updatedHistory);
    alert(`Kuitansi ${newEntry.referenceNo} berhasil disimpan ke riwayat!`);
  };

  const handleDeleteHistoryItem = (referenceNo: string) => {
    const updatedHistory = history.filter(item => item.referenceNo !== referenceNo);
    saveHistoryToStorage(updatedHistory);
  };

  const handleNewInvoice = () => {
    if (confirm('Yakin ingin membuat kuitansi baru? Data yang belum disimpan ke riwayat akan hilang.')) {
      // Keep company info and signature, reset the rest
      setData({
        ...defaultInvoiceData,
        companyName: data.companyName,
        companyAddress: data.companyAddress,
        companyPhone: data.companyPhone,
        companyEmail: data.companyEmail,
        companyLogo: data.companyLogo,
        signatureImage: data.signatureImage,
        signatoryName: data.signatoryName,
        signatoryRole: data.signatoryRole,
        referenceNo: `INV/${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
        date: new Date().toLocaleDateString('id-ID'),
        settings: data.settings
      });
    }
  };

  const handleAutoPasteApply = (partialData: Partial<InvoiceData>) => {
    setData({
      ...data,
      ...partialData,
      // Merge items carefully if we want, but let's just replace them if they exist
      items: partialData.items && partialData.items.length > 0 ? partialData.items : data.items,
      settings: {
        ...data.settings,
        ...(partialData.settings || {})
      }
    });
    alert('Data berhasil diterapkan dari teks!');
  };

  const handleDownload = async () => {
    if (!invoiceRef.current) return;

    try {
      const element = invoiceRef.current;
      // Add class to hide print:hidden elements via CSS
      element.classList.add('hide-for-download');
      
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1,
        pixelRatio: 2,
        // Fallback filter just in case
        filter: (node) => {
          const el = node as any;
          if (el && el.classList && typeof el.classList.contains === 'function' && el.classList.contains('print:hidden')) {
            return false;
          }
          return true;
        }
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `invoice-${data.referenceNo.replace(/\//g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error('Failed to generate Image', error);
      alert('Gagal membuat Gambar: ' + (error.message || 'Unknown error'));
    } finally {
      if (invoiceRef.current) {
        invoiceRef.current.classList.remove('hide-for-download');
      }
    }
  };

  const updateSettings = (key: keyof typeof data.settings, value: any) => {
    setData({
      ...data,
      settings: {
        ...data.settings,
        [key]: value
      }
    });
  };

  const toggleTemplate = () => {
    updateSettings('templateId', data.settings.templateId === 'template2' ? 'template1' : 'template2');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-[1320px]">
        {/* Invoice Area */}
        <div className="shadow-lg mb-8">
          {data.settings.templateId === 'template2' ? (
            <InvoicePreviewTemplate2 data={data} onChange={setData} innerRef={invoiceRef} />
          ) : (
            <InvoicePreview data={data} onChange={setData} innerRef={invoiceRef} />
          )}
        </div>

        {/* Controls Section (Below Invoice) */}
        <div className="flex justify-between items-start mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 print:hidden">
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.settings.showDiscount}
                onChange={(e) => updateSettings('showDiscount', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Tampilkan diskon</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.settings.showTax}
                onChange={(e) => updateSettings('showTax', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Tampilkan pajak</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.settings.showLogo !== false}
                onChange={(e) => updateSettings('showLogo', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Tampilkan Logo (Perusahaan)</span>
            </label>

          </div>

          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-gray-700 mb-2">Template</span>
            <div className="border-2 border-blue-500 p-1 rounded cursor-pointer" onClick={toggleTemplate}>
              <div className="w-[100px] h-[140px] bg-gray-100 border border-gray-200 relative overflow-hidden">
                {data.settings.templateId === 'template2' ? (
                  // Mini preview for template 2
                  <div className="w-full h-full flex flex-col p-2">
                    <div className="w-1/2 h-4 bg-gray-300 mx-auto mb-2"></div>
                    <div className="w-full h-[1px] bg-gray-400 mb-4"></div>
                    <div className="w-full h-20 border border-black mb-1 flex flex-col">
                      <div className="w-full h-2 border-b border-black"></div>
                      <div className="w-full h-2 border-b border-black"></div>
                    </div>
                  </div>
                ) : (
                  // Mini preview for template 1
                  <div className="w-full h-full flex flex-col p-2">
                    <div className="w-full h-4 flex justify-between mb-2">
                      <div className="w-1/3 h-full bg-blue-500"></div>
                      <div className="w-1/3 h-full bg-gray-300"></div>
                    </div>
                    <div className="w-full h-20 border border-black mb-1 flex flex-col">
                      <div className="w-full h-4 bg-gray-200 border-b border-black"></div>
                      <div className="w-full flex-1"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <span className="text-xs text-gray-500 mt-1">Klik untuk ganti</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pb-20 print:hidden flex-wrap">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
          >
            Cetak PDF
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Download className="w-5 h-5" />
            Download Gambar
          </button>
          
          <div className="w-px h-12 bg-gray-300 mx-2 hidden sm:block"></div>

          <button
            onClick={() => setIsAutoPasteOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
          >
            <ClipboardPaste className="w-5 h-5" />
            Auto-Isi Teks
          </button>

          <button
            onClick={handleSaveToHistory}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <Save className="w-5 h-5" />
            Simpan Kuitansi
          </button>

          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <History className="w-5 h-5" />
            Riwayat ({history.length})
          </button>

          <button
            onClick={handleNewInvoice}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FilePlus className="w-5 h-5" />
            Kuitansi Baru
          </button>
        </div>
      </div>
      
      <InvoiceHistoryModal 
        isOpen={isHistoryModalOpen} 
        onClose={() => setIsHistoryModalOpen(false)} 
        history={history}
        onLoad={setData}
        onDelete={handleDeleteHistoryItem}
      />

      <AutoPasteModal
        isOpen={isAutoPasteOpen}
        onClose={() => setIsAutoPasteOpen(false)}
        onApply={handleAutoPasteApply}
      />
    </div>
  );
}
