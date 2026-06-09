export interface InvoiceData {
  companyLogo: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;

  invoiceTitle: string;
  referenceNo: string;
  date: string;
  dueDate: string;

  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;

  items: InvoiceItem[];

  notes: string;
  
  signatureImage: string;
  signatoryName: string;
  signatoryRole: string;

  settings: {
    showDiscount: boolean;
    showTax: boolean;
    showUnit: boolean;
  };
}

export interface InvoiceItem {
  id: string;
  product: string;
  description: string;
  quantity: number;
  price: number;
  discount: number; // in percentage
  tax: number; // in percentage, usually 10%
}
