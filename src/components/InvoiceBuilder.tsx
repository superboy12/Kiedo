'use client';

import React, { useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { InvoicePreview } from './InvoicePreview';
import { InvoicePreviewTemplate2 } from './InvoicePreviewTemplate2';
import { defaultInvoiceData } from '../constants/defaultData';
import { useAutosave } from '../hooks/useAutosave';
import { Download } from 'lucide-react';

export default function InvoiceBuilder() {
  const [data, setData] = useAutosave('invoice-data-v1', defaultInvoiceData);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!invoiceRef.current) return;

    try {
      const element = invoiceRef.current;
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1,
        pixelRatio: 2,
        filter: (node) => {
          // Exclude elements that are meant to be hidden in print/image
          // Avoid instanceof HTMLElement as it can fail in cloned contexts
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
                checked={data.settings.showUnit}
                onChange={(e) => updateSettings('showUnit', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Tampilkan satuan</span>
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
                    <div className="w-1/3 h-2 bg-blue-200 mb-2"></div>
                    <div className="w-full h-[1px] bg-gray-300 mb-1"></div>
                    <div className="w-1/2 h-1 bg-gray-300 mb-4"></div>
                    <div className="w-full h-4 bg-[#2F3E56] mb-1"></div>
                    <div className="w-full h-2 bg-gray-200 mb-1"></div>
                  </div>
                )}
              </div>
            </div>
            <button onClick={toggleTemplate} className="mt-2 bg-blue-500 text-white text-xs px-4 py-2 rounded hover:bg-blue-600 transition-colors">
              Ganti Template
            </button>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-center mb-16 print:hidden">
          <button
            onClick={handleDownload}
            className="bg-[#28A745] text-white px-8 py-4 rounded-md text-xl font-bold flex items-center gap-2 hover:bg-green-600 transition-colors shadow-lg"
          >
            <Download className="w-6 h-6" />
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
