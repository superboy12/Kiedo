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
  
  signatureImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMTAwIiB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCI+PHBhdGggZD0iTSA1MCA3MCBRIDcwIDIwIDgwIDUwIFQgMTEwIDUwIFQgMTQwIDcwIFEgMTYwIDMwIDE3MCA1MCBUIDIwMCA0MCBUIDIzMCA2MCBRIDI1MCA4MCAyNzAgNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFlM2E4YSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=',
  signatoryName: 'Budi Santoso',
  signatoryRole: 'Finance Manager',

  amountPaid: 0,

  settings: {
    showDiscount: true,
    showTax: true,
    showUnit: false,
    templateId: 'template1',
    status: 'Dibayar Sebagian'
  }
};
