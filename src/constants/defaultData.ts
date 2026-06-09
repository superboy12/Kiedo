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
      unit: 'pcs',
      price: 0,
      discount: 0,
      tax: 10,
    }
  ],

  notes: '',

  signatureImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMTAwIiB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCI+PHBhdGggZD0iTSAzMCA3MCBDIDIwIDUwLCA0MCAxMCwgNjAgMTAgQyA4MCAxMCwgNDAgODAsIDcwIDgwIEMgMTAwIDgwLCAxMTAgNTAsIDEzMCA2MCBDIDE1MCA3MCwgMTYwIDQwLCAxODAgNTAgQyAyMDAgNjAsIDIxMCA1MCwgMjMwIDYwIEMgMjUwIDcwLCAyNzAgNTAsIDI4MCA1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWUzYThhIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==',
  signatoryName: 'Lukman Hakim',
  signatoryRole: 'Finance Manager',

  amountPaid: 0,

  settings: {
    showDiscount: true,
    showTax: true,
    showUnit: true,
    templateId: 'template1',
    status: 'Dibayar Sebagian'
  }
};
