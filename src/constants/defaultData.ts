import { InvoiceData } from '../types/invoice';

export const defaultInvoiceData: InvoiceData = {
  companyLogo: '',
  companyName: 'Nama Perusahaan Anda',
  companyAddress: 'Alamat Perusahaan Anda',
  companyPhone: 'No Telp Perusahaan Anda',
  companyEmail: 'email@perusahaan.anda',

  invoiceTitle: 'Invoice',
  referenceNo: 'INV/00001',
  date: new Date().toLocaleDateString('id-ID'),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID'),

  customerName: 'Nama Pelanggan',
  customerAddress: 'Alamat Pelanggan',
  customerPhone: 'No Telp Pelanggan',
  customerEmail: 'email@perusahaan.pelanggan',

  items: [
    {
      id: '1',
      product: 'Nama Produk',
      description: 'Deskripsi produk',
      quantity: 1,
      price: 0,
      discount: 0,
      tax: 10,
    }
  ],

  notes: '',
  
  signatureImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><path d="M 50,80 C 60,40 80,10 90,20 C 100,30 80,60 70,80 C 60,100 90,80 110,60 C 130,40 150,20 160,20" fill="transparent" stroke="%23333333" stroke-width="2" stroke-linecap="round"/></svg>',
  signatoryName: 'Nama Penandatangan',
  signatoryRole: 'Peran Penandatangan',

  amountPaid: 0,

  settings: {
    showDiscount: true,
    showTax: true,
    showUnit: false,
    templateId: 'template1',
    status: 'Dibayar Sebagian'
  }
};
