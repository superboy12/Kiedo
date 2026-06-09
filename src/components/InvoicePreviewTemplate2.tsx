import React from 'react';
import { InvoiceData } from '../types/invoice';
import { EditableField } from './EditableField';
import { ImageUpload } from './ImageUpload';
import { InvoiceTableTemplate2 } from './InvoiceTableTemplate2';

interface InvoicePreviewTemplate2Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  innerRef?: React.Ref<HTMLDivElement>;
}

export const InvoicePreviewTemplate2: React.FC<InvoicePreviewTemplate2Props> = ({ data, onChange, innerRef }) => {
  const updateField = (field: keyof InvoiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="w-full overflow-x-auto">
      <div ref={innerRef} className="bg-white w-[1280px] mx-auto p-12 shadow-sm font-sans text-black relative print:shadow-none print:p-0">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-12">
        <div className="w-[45%] flex flex-col items-center">
          <ImageUpload
            value={data.companyLogo}
            onChange={(val) => updateField('companyLogo', val)}
            label="Upload Logo"
            width="250px"
            className="mb-4"
          />
          <EditableField value={data.companyAddress} onChange={(val) => updateField('companyAddress', val)} className="text-sm text-center block mb-1" align="center" />
          <EditableField value={data.companyPhone} onChange={(val) => updateField('companyPhone', val)} className="text-sm text-center block mb-1" align="center" />
        </div>
        
        <div className="w-[50%] flex flex-col justify-start">
          <EditableField
            value={data.invoiceTitle}
            onChange={(val) => updateField('invoiceTitle', val)}
            className="text-[32px] font-bold text-[#1a202c] mb-6"
            align="left"
          />
          <div className="grid grid-cols-[120px_auto] gap-y-1 text-sm mb-8">
            <div className="text-left text-gray-800">Referensi</div>
            <div className="flex"><span className="mr-2">:</span><EditableField value={data.referenceNo} onChange={(val) => updateField('referenceNo', val)} /></div>
            
            <div className="text-left text-gray-800">Tanggal</div>
            <div className="flex"><span className="mr-2">:</span><EditableField value={data.date} onChange={(val) => updateField('date', val)} /></div>
            
            <div className="text-left text-gray-800">Tgl. Jatuh Tempo</div>
            <div className="flex"><span className="mr-2">:</span><EditableField value={data.dueDate} onChange={(val) => updateField('dueDate', val)} /></div>
            
            <div className="text-left text-gray-800">Status</div>
            <div className="flex"><span className="mr-2">:</span><EditableField value={data.settings.status || 'Dibayar Sebagian'} onChange={(val) => onChange({ ...data, settings: { ...data.settings, status: val } })} /></div>
          </div>

          <div>
            <h2 className="font-bold text-sm mb-4 text-gray-800">Tagihan Kepada</h2>
            <EditableField value={data.customerName} onChange={(val) => updateField('customerName', val)} className="font-bold text-[#1a202c] block mb-2" />
            <EditableField value={data.customerAddress} onChange={(val) => updateField('customerAddress', val)} className="block text-gray-800 text-sm mb-1" />
            <EditableField value={data.customerPhone} onChange={(val) => updateField('customerPhone', val)} className="block text-gray-800 text-sm mb-1" />
            <EditableField value={data.customerEmail} onChange={(val) => updateField('customerEmail', val)} className="block text-gray-800 text-sm" />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <InvoiceTableTemplate2 data={data} onChange={onChange} />

      {/* BOTTOM SECTION */}
      <div className="flex justify-between mt-12">
        <div className="w-[45%]">
          <h2 className="font-bold text-sm mb-2 text-gray-800">Pesan</h2>
          <EditableField
            value={data.notes}
            onChange={(val) => updateField('notes', val)}
            multiline
            placeholder="Silahkan transfer ke rekening:&#10;BCA 123456789 a.n PT ABC"
            className="text-sm text-gray-700 h-[120px]"
          />
        </div>

        <div className="w-[45%] flex justify-end">
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
            <EditableField value={data.signatoryRole} onChange={(val) => updateField('signatoryRole', val)} className="text-sm text-gray-800 block w-full" align="center" />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
