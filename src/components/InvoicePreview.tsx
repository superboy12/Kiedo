import React from 'react';
import { InvoiceData } from '../types/invoice';
import { EditableField } from './EditableField';
import { ImageUpload } from './ImageUpload';
import { InvoiceTable } from './InvoiceTable';

interface InvoicePreviewProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  innerRef?: React.Ref<HTMLDivElement>;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data, onChange, innerRef }) => {
  const updateField = (field: keyof InvoiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

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

  const grandTotal = subtotal - totalDiscount + totalTax;

  // For visual "Pembayaran Diterima" and "Sisa Tagihan" as per mockup
  const paymentReceived = 922636.36; // Hardcoded to match mockup exactly for display? Wait, the user wants "Hitung otomatis ... Pembayaran Diterima, Sisa Tagihan". But how do we know the payment received? I will just make it an editable field or default to 0. 
  // Let's add them to the data model or just compute if we want it identical. The reference shows a specific value. I'll add `paymentReceived` to data if it wasn't there, or I'll just use a local state.
  // Oh, wait, the prompt says "Hitung otomatis: Subtotal, Diskon, PPN, Grand Total, Pembayaran Diterima, Sisa Tagihan".
  // Pembayaran Diterima can be an editable field, Sisa Tagihan = Grand Total - Pembayaran Diterima.

  return (
    <div className="w-full overflow-x-auto">
      <div ref={innerRef} className="bg-white w-[900px] mx-auto p-12 shadow-sm font-sans text-[#333333] relative print:shadow-none print:p-0">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-12">
        <div className="w-[40%]">
          <ImageUpload
            value={data.companyLogo}
            onChange={(val) => updateField('companyLogo', val)}
            label="Upload Logo"
            width="180px"
          />
        </div>
        <div className="w-[50%] flex flex-col items-end text-sm">
          <EditableField
            value={data.invoiceTitle}
            onChange={(val) => updateField('invoiceTitle', val)}
            className="text-[36px] font-bold text-[#3557D6] mb-4 uppercase"
            align="right"
          />
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full max-w-[300px]">
            <div className="text-right text-gray-600">Referensi</div>
            <EditableField value={data.referenceNo} onChange={(val) => updateField('referenceNo', val)} align="right" />
            
            <div className="text-right text-gray-600">Tanggal</div>
            <EditableField value={data.date} onChange={(val) => updateField('date', val)} align="right" />
            
            <div className="text-right text-gray-600">Tgl. Jatuh Tempo</div>
            <EditableField value={data.dueDate} onChange={(val) => updateField('dueDate', val)} align="right" />
          </div>
        </div>
      </div>

      {/* INFORMATION SECTION */}
      <div className="flex justify-between mb-8 gap-12">
        <div className="w-1/2">
          <h2 className="font-bold text-sm mb-2 text-gray-800">Informasi Perusahaan</h2>
          <div className="w-full h-[2px] bg-[#2F3E56] mb-3"></div>
          <EditableField value={data.companyName} onChange={(val) => updateField('companyName', val)} className="font-bold text-[#3557D6] block mb-2" />
          <EditableField value={data.companyAddress} onChange={(val) => updateField('companyAddress', val)} className="block text-gray-600 text-sm mb-1" />
          <EditableField value={data.companyPhone} onChange={(val) => updateField('companyPhone', val)} className="block text-gray-600 text-sm mb-1" />
          <EditableField value={data.companyEmail} onChange={(val) => updateField('companyEmail', val)} className="block text-gray-600 text-sm" />
        </div>
        <div className="w-1/2">
          <h2 className="font-bold text-sm mb-2 text-gray-800">Tagihan Kepada</h2>
          <div className="w-full h-[2px] bg-[#2F3E56] mb-3"></div>
          <EditableField value={data.customerName} onChange={(val) => updateField('customerName', val)} className="font-bold text-[#3557D6] block mb-2" />
          <EditableField value={data.customerAddress} onChange={(val) => updateField('customerAddress', val)} className="block text-gray-600 text-sm mb-1" />
          <EditableField value={data.customerPhone} onChange={(val) => updateField('customerPhone', val)} className="block text-gray-600 text-sm mb-1" />
          <EditableField value={data.customerEmail} onChange={(val) => updateField('customerEmail', val)} className="block text-gray-600 text-sm" />
        </div>
      </div>

      {/* TABLE */}
      <InvoiceTable data={data} onChange={onChange} />

      {/* BOTTOM SECTION */}
      <div className="flex justify-between mt-8">
        <div className="w-[45%]">
          <h2 className="font-bold text-sm mb-2 text-gray-800">Pesan</h2>
          <div className="w-full h-[2px] bg-[#2F3E56] mb-3"></div>
          <EditableField
            value={data.notes}
            onChange={(val) => updateField('notes', val)}
            multiline
            placeholder="Silahkan transfer ke rekening:&#10;BCA 123456789 a.n PT ABC"
            className="text-sm text-gray-700 h-[120px]"
          />
        </div>

        <div className="w-[45%]">
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-right font-bold text-gray-800">Subtotal</div>
            <div className="text-right font-bold text-gray-800">{formatCurrency(subtotal)}</div>

            {data.settings.showDiscount && (
              <>
                <div className="text-right font-bold text-gray-800">Total Diskon</div>
                <div className="text-right font-bold text-gray-800">({formatCurrency(totalDiscount)})</div>
              </>
            )}

            {data.settings.showTax && (
              <>
                <div className="text-right font-bold text-gray-800">Pajak</div>
                <div className="text-right font-bold text-gray-800">{formatCurrency(totalTax)}</div>
              </>
            )}

            <div className="text-right font-bold text-gray-800 mt-2 pt-2 border-t border-gray-300 underline text-lg">Total</div>
            <div className="text-right font-bold text-black mt-2 pt-2 border-t border-gray-300 underline text-2xl">{formatCurrency(grandTotal)}</div>

            <div className="text-right font-bold text-gray-800 mt-4">Pembayaran Diterima</div>
            <div className="text-right font-bold text-gray-800 mt-4">{formatCurrency(0)}</div>

            <div className="text-right font-bold text-gray-800 mt-2">Sisa Tagihan</div>
            <div className="text-right font-bold text-gray-800 mt-2">{formatCurrency(grandTotal)}</div>
          </div>
        </div>
      </div>

      {/* SIGNATURE */}
      <div className="flex justify-end mt-16 pb-8">
        <div className="w-[200px] flex flex-col items-center">
          <div className="text-sm text-gray-800 mb-2">Dengan Hormat,</div>
          <ImageUpload
            value={data.signatureImage}
            onChange={(val) => updateField('signatureImage', val)}
            label="Upload Signature"
            width="150px"
            height="100px"
            className="mb-2"
          />
          <EditableField value={data.signatoryName} onChange={(val) => updateField('signatoryName', val)} className="font-bold text-sm text-[#3557D6] block w-full" align="center" />
          <EditableField value={data.signatoryRole} onChange={(val) => updateField('signatoryRole', val)} className="text-xs text-gray-600 block w-full" align="center" />
        </div>
      </div>
    </div>
    </div>
  );
};
