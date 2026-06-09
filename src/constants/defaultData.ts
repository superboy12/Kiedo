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
  
  signatureImage: '',
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
