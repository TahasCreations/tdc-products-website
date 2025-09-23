import { NextRequest, NextResponse } from 'next/server';

interface Invoice {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  customerTaxNumber: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  type: 'invoice' | 'receipt' | 'credit_note' | 'debit_note' | 'proforma';
  currency: string;
  exchangeRate: number;
  dueDate: string;
  createdDate: string;
  sentDate?: string;
  paidDate?: string;
  paymentMethod?: string;
  notes?: string;
  eInvoiceStatus?: 'pending' | 'sent' | 'accepted' | 'rejected';
  eInvoiceId?: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  productId?: string;
  category?: string;
}

interface Customer {
  id: string;
  code: string;
  name: string;
  taxNumber: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  phone: string;
  email: string;
  type: 'individual' | 'corporate';
  status: 'active' | 'inactive' | 'blocked';
  creditLimit: number;
  currentBalance: number;
  paymentTerms: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parentId?: string;
  level: number;
  isActive: boolean;
  description?: string;
  createdAt: string;
}

interface JournalEntry {
  id: string;
  number: string;
  date: string;
  description: string;
  entries: JournalEntryLine[];
  totalDebit: number;
  totalCredit: number;
  status: 'draft' | 'posted' | 'reversed';
  createdBy: string;
  createdAt: string;
  postedAt?: string;
}

interface JournalEntryLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
  reference?: string;
}

interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  currency: string;
  balance: number;
  isActive: boolean;
  lastSyncDate?: string;
  createdAt: string;
}

interface TaxReport {
  id: string;
  period: string;
  totalSales: number;
  totalPurchases: number;
  vatCollected: number;
  vatPaid: number;
  vatPayable: number;
  status: 'draft' | 'submitted' | 'approved';
  submittedDate?: string;
  createdAt: string;
}

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'FAT-2024-001',
    customerId: '1',
    customerName: 'ABC Teknoloji A.Ş.',
    customerTaxNumber: '1234567890',
    customerAddress: 'İstanbul, Türkiye',
    items: [
      {
        id: '1',
        description: 'Web Tasarım Hizmeti',
        quantity: 1,
        unitPrice: 5000,
        taxRate: 20,
        taxAmount: 1000,
        total: 6000,
        productId: 'P001',
        category: 'Hizmet'
      }
    ],
    subtotal: 5000,
    taxAmount: 1000,
    total: 6000,
    status: 'paid',
    type: 'invoice',
    currency: 'TRY',
    exchangeRate: 1,
    dueDate: '2024-02-15',
    createdDate: '2024-01-15',
    sentDate: '2024-01-15',
    paidDate: '2024-01-20',
    paymentMethod: 'Bank Transfer',
    eInvoiceStatus: 'accepted',
    eInvoiceId: 'EINV-2024-001'
  }
];

const mockCustomers: Customer[] = [
  {
    id: '1',
    code: 'CUST-001',
    name: 'ABC Teknoloji A.Ş.',
    taxNumber: '1234567890',
    address: 'Maslak Mah. Büyükdere Cad. No:123',
    city: 'İstanbul',
    district: 'Şişli',
    postalCode: '34485',
    phone: '+90 212 555 0123',
    email: 'info@abcteknoloji.com',
    type: 'corporate',
    status: 'active',
    creditLimit: 50000,
    currentBalance: 15000,
    paymentTerms: 30,
    currency: 'TRY',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  }
];

const mockChartOfAccounts: ChartOfAccount[] = [
  {
    id: '1',
    code: '100',
    name: 'DÖNEN VARLIKLAR',
    type: 'asset',
    level: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    code: '120',
    name: 'Ticari Alacaklar',
    type: 'asset',
    parentId: '1',
    level: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    code: '600',
    name: 'YURTİÇİ SATIŞLAR',
    type: 'revenue',
    level: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const mockBankAccounts: BankAccount[] = [
  {
    id: '1',
    name: 'Ana Hesap',
    bankName: 'Türkiye İş Bankası',
    accountNumber: '1234567890',
    iban: 'TR1234567890123456789012345',
    currency: 'TRY',
    balance: 125000,
    isActive: true,
    lastSyncDate: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const module = searchParams.get('module');
    const limit = parseInt(searchParams.get('limit') || '10');

    switch (module) {
      case 'invoices':
        return NextResponse.json({
          success: true,
          data: {
            invoices: mockInvoices.slice(0, limit),
            total: mockInvoices.length,
            summary: {
              totalAmount: mockInvoices.reduce((sum, inv) => sum + inv.total, 0),
              paidAmount: mockInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
              pendingAmount: mockInvoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total, 0),
              overdueAmount: mockInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0)
            }
          }
        });

      case 'customers':
        return NextResponse.json({
          success: true,
          data: {
            customers: mockCustomers.slice(0, limit),
            total: mockCustomers.length,
            summary: {
              totalCustomers: mockCustomers.length,
              activeCustomers: mockCustomers.filter(c => c.status === 'active').length,
              totalReceivables: mockCustomers.reduce((sum, c) => sum + c.currentBalance, 0),
              averageCreditLimit: mockCustomers.reduce((sum, c) => sum + c.creditLimit, 0) / mockCustomers.length
            }
          }
        });

      case 'chart-of-accounts':
        return NextResponse.json({
          success: true,
          data: {
            accounts: mockChartOfAccounts,
            total: mockChartOfAccounts.length
          }
        });

      case 'bank-accounts':
        return NextResponse.json({
          success: true,
          data: {
            accounts: mockBankAccounts,
            total: mockBankAccounts.length,
            totalBalance: mockBankAccounts.reduce((sum, acc) => sum + acc.balance, 0)
          }
        });

      case 'dashboard':
        const totalRevenue = mockInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
        const totalReceivables = mockCustomers.reduce((sum, c) => sum + c.currentBalance, 0);
        const totalBankBalance = mockBankAccounts.reduce((sum, acc) => sum + acc.balance, 0);

        return NextResponse.json({
          success: true,
          data: {
            summary: {
              totalRevenue,
              totalReceivables,
              totalBankBalance,
              netProfit: totalRevenue - totalReceivables,
              monthlyGrowth: 15.5,
              quarterlyGrowth: 42.3
            },
            recentInvoices: mockInvoices.slice(0, 5),
            topCustomers: mockCustomers.slice(0, 5),
            bankAccounts: mockBankAccounts
          }
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            modules: [
              'invoices', 'customers', 'chart-of-accounts', 
              'bank-accounts', 'journal-entries', 'tax-reports',
              'dashboard', 'reports', 'settings'
            ]
          }
        });
    }

  } catch (error) {
    console.error('Advanced Accounting API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Muhasebe verileri alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'create_invoice':
        const newInvoice: Invoice = {
          id: Date.now().toString(),
          number: `FAT-2024-${String(mockInvoices.length + 1).padStart(3, '0')}`,
          ...data,
          status: 'draft',
          createdDate: new Date().toISOString(),
          currency: data.currency || 'TRY',
          exchangeRate: data.exchangeRate || 1
        };

        // Calculate totals
        newInvoice.subtotal = newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        newInvoice.taxAmount = newInvoice.items.reduce((sum, item) => sum + item.taxAmount, 0);
        newInvoice.total = newInvoice.subtotal + newInvoice.taxAmount;

        mockInvoices.unshift(newInvoice);

        return NextResponse.json({
          success: true,
          data: newInvoice,
          message: 'Fatura başarıyla oluşturuldu'
        });

      case 'create_customer':
        const newCustomer: Customer = {
          id: Date.now().toString(),
          code: `CUST-${String(mockCustomers.length + 1).padStart(3, '0')}`,
          ...data,
          status: 'active',
          currentBalance: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        mockCustomers.push(newCustomer);

        return NextResponse.json({
          success: true,
          data: newCustomer,
          message: 'Müşteri başarıyla oluşturuldu'
        });

      case 'send_invoice':
        const invoice = mockInvoices.find(inv => inv.id === data.invoiceId);
        if (invoice) {
          invoice.status = 'sent';
          invoice.sentDate = new Date().toISOString();
        }

        return NextResponse.json({
          success: true,
          message: 'Fatura başarıyla gönderildi'
        });

      case 'mark_paid':
        const paidInvoice = mockInvoices.find(inv => inv.id === data.invoiceId);
        if (paidInvoice) {
          paidInvoice.status = 'paid';
          paidInvoice.paidDate = new Date().toISOString();
          paidInvoice.paymentMethod = data.paymentMethod;
        }

        return NextResponse.json({
          success: true,
          message: 'Fatura ödendi olarak işaretlendi'
        });

      case 'create_journal_entry':
        const newEntry: JournalEntry = {
          id: Date.now().toString(),
          number: `YEV-2024-${String(Date.now()).slice(-6)}`,
          ...data,
          status: 'draft',
          createdBy: 'admin',
          createdAt: new Date().toISOString(),
          totalDebit: data.entries.reduce((sum: number, line: any) => sum + line.debit, 0),
          totalCredit: data.entries.reduce((sum: number, line: any) => sum + line.credit, 0)
        };

        return NextResponse.json({
          success: true,
          data: newEntry,
          message: 'Yevmiye kaydı başarıyla oluşturuldu'
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Geçersiz işlem' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Advanced Accounting Action Error:', error);
    return NextResponse.json(
      { success: false, error: 'İşlem sırasında hata oluştu' },
      { status: 500 }
    );
  }
}
