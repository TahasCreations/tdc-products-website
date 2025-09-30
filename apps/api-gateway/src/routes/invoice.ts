import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { InvoiceService } from '@tdc/infra';
import { validateInput } from '@tdc/infra';

const router = express.Router();
const invoiceService = new InvoiceService();

// Invoice creation request schema
const createInvoiceSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  orderId: z.string().optional(),
  sellerId: z.string().optional(),
  invoiceType: z.enum(['SALES', 'COMMISSION', 'REFUND', 'CREDIT_NOTE', 'DEBIT_NOTE'], {
    errorMap: () => ({ message: 'Invalid invoice type' })
  }),
  issuer: z.object({
    id: z.string().min(1, 'Issuer ID is required'),
    name: z.string().min(1, 'Issuer name is required'),
    taxNumber: z.string().min(1, 'Issuer tax number is required'),
    address: z.string().min(1, 'Issuer address is required'),
    phone: z.string().optional(),
    email: z.string().email().optional()
  }),
  buyer: z.object({
    id: z.string().min(1, 'Buyer ID is required'),
    name: z.string().min(1, 'Buyer name is required'),
    taxNumber: z.string().optional(),
    address: z.string().min(1, 'Buyer address is required'),
    phone: z.string().optional(),
    email: z.string().email().optional()
  }),
  items: z.array(z.object({
    productId: z.string().optional(),
    productName: z.string().min(1, 'Product name is required'),
    productSku: z.string().optional(),
    description: z.string().optional(),
    quantity: z.number().positive('Quantity must be positive'),
    unitPrice: z.number().min(0, 'Unit price cannot be negative'),
    subtotal: z.number().min(0, 'Subtotal cannot be negative'),
    taxRate: z.number().min(0).max(1, 'Tax rate must be between 0 and 1'),
    taxAmount: z.number().min(0, 'Tax amount cannot be negative'),
    totalAmount: z.number().min(0, 'Total amount cannot be negative'),
    commissionRate: z.number().min(0).max(1).optional(),
    commissionAmount: z.number().min(0).optional()
  })).min(1, 'At least one item is required'),
  invoiceDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  metadata: z.any().optional()
});

// Invoice update request schema
const updateInvoiceSchema = z.object({
  status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED']).optional(),
  paidDate: z.string().datetime().optional(),
  paymentMethod: z.string().optional(),
  paymentReference: z.string().optional(),
  paymentNotes: z.string().optional(),
  externalId: z.string().optional(),
  externalStatus: z.string().optional(),
  externalData: z.any().optional(),
  notes: z.string().optional(),
  metadata: z.any().optional()
});

/**
 * Create invoice
 * POST /api/invoice
 */
router.post('/', validateInput(createInvoiceSchema), async (req: Request, res: Response) => {
  try {
    const invoiceData = req.body;

    // Transform dates
    if (invoiceData.invoiceDate) {
      invoiceData.invoiceDate = new Date(invoiceData.invoiceDate);
    }
    if (invoiceData.dueDate) {
      invoiceData.dueDate = new Date(invoiceData.dueDate);
    }

    const invoice = await invoiceService.createInvoice(invoiceData);

    res.status(201).json({
      success: true,
      data: invoice,
      message: 'Invoice created successfully'
    });
  } catch (error: any) {
    console.error('[Invoice API] Error creating invoice:', error);
    res.status(400).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get invoice by ID
 * GET /api/invoice/:id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const invoice = await invoiceService.getInvoice(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error: any) {
    console.error('[Invoice API] Error getting invoice:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get invoice by invoice number
 * GET /api/invoice/number/:number
 */
router.get('/number/:number', async (req: Request, res: Response) => {
  try {
    const { number } = req.params;

    const invoice = await invoiceService.getInvoiceByNumber(number);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error: any) {
    console.error('[Invoice API] Error getting invoice by number:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Update invoice
 * PUT /api/invoice/:id
 */
router.put('/:id', validateInput(updateInvoiceSchema), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Transform dates
    if (updateData.paidDate) {
      updateData.paidDate = new Date(updateData.paidDate);
    }

    const invoice = await invoiceService.updateInvoice(id, updateData);

    res.status(200).json({
      success: true,
      data: invoice,
      message: 'Invoice updated successfully'
    });
  } catch (error: any) {
    console.error('[Invoice API] Error updating invoice:', error);
    res.status(400).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * List invoices
 * GET /api/invoice
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      tenantId,
      sellerId,
      orderId,
      invoiceType,
      status,
      dateFrom,
      dateTo,
      page = '1',
      limit = '50'
    } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required'
      });
    }

    const searchParams = {
      tenantId: tenantId as string,
      sellerId: sellerId as string,
      orderId: orderId as string,
      invoiceType: invoiceType as any,
      status: status as any,
      dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo: dateTo ? new Date(dateTo as string) : undefined,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    };

    const result = await invoiceService.listInvoices(searchParams);

    res.status(200).json({
      success: true,
      data: result.invoices,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        hasMore: result.hasMore
      }
    });
  } catch (error: any) {
    console.error('[Invoice API] Error listing invoices:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get invoice statistics
 * GET /api/invoice/stats
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { tenantId, dateFrom, dateTo } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required'
      });
    }

    const stats = await invoiceService.getInvoiceStats(
      tenantId as string,
      dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo ? new Date(dateTo as string) : undefined
    );

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('[Invoice API] Error getting invoice stats:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Send invoice
 * POST /api/invoice/:id/send
 */
router.post('/:id/send', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { method = 'EMAIL' } = req.body;

    const result = await invoiceService.sendInvoice(id, method);

    res.status(200).json({
      success: result.success,
      message: result.message
    });
  } catch (error: any) {
    console.error('[Invoice API] Error sending invoice:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Mark invoice as paid
 * POST /api/invoice/:id/paid
 */
router.post('/:id/paid', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { paymentMethod, paymentReference } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Payment method is required'
      });
    }

    const invoice = await invoiceService.markAsPaid(id, paymentMethod, paymentReference);

    res.status(200).json({
      success: true,
      data: invoice,
      message: 'Invoice marked as paid successfully'
    });
  } catch (error: any) {
    console.error('[Invoice API] Error marking invoice as paid:', error);
    res.status(400).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Cancel invoice
 * POST /api/invoice/:id/cancel
 */
router.post('/:id/cancel', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'Cancellation reason is required'
      });
    }

    const invoice = await invoiceService.cancelInvoice(id, reason);

    res.status(200).json({
      success: true,
      data: invoice,
      message: 'Invoice cancelled successfully'
    });
  } catch (error: any) {
    console.error('[Invoice API] Error cancelling invoice:', error);
    res.status(400).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Generate invoice PDF
 * GET /api/invoice/:id/pdf
 */
router.get('/:id/pdf', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await invoiceService.generatePDF(id);

    res.status(200).json({
      success: true,
      data: {
        pdfUrl: result.pdfUrl,
        expiresAt: result.expiresAt
      }
    });
  } catch (error: any) {
    console.error('[Invoice API] Error generating PDF:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get invoice templates
 * GET /api/invoice/templates
 */
router.get('/templates', async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required'
      });
    }

    const templates = await invoiceService.getTemplates(tenantId as string);

    res.status(200).json({
      success: true,
      data: templates
    });
  } catch (error: any) {
    console.error('[Invoice API] Error getting templates:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Create invoice template
 * POST /api/invoice/templates
 */
router.post('/templates', async (req: Request, res: Response) => {
  try {
    const { tenantId, ...templateData } = req.body;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required'
      });
    }

    const template = await invoiceService.createTemplate(tenantId, templateData);

    res.status(201).json({
      success: true,
      data: template,
      message: 'Template created successfully'
    });
  } catch (error: any) {
    console.error('[Invoice API] Error creating template:', error);
    res.status(400).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Update invoice template
 * PUT /api/invoice/templates/:id
 */
router.put('/templates/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const templateData = req.body;

    const template = await invoiceService.updateTemplate(id, templateData);

    res.status(200).json({
      success: true,
      data: template,
      message: 'Template updated successfully'
    });
  } catch (error: any) {
    console.error('[Invoice API] Error updating template:', error);
    res.status(400).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Delete invoice template
 * DELETE /api/invoice/templates/:id
 */
router.delete('/templates/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await invoiceService.deleteTemplate(id);

    res.status(200).json({
      success: result.success,
      message: result.success ? 'Template deleted successfully' : 'Failed to delete template'
    });
  } catch (error: any) {
    console.error('[Invoice API] Error deleting template:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Health check
 * GET /api/invoice/health
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const health = await invoiceService.healthCheck();

    res.status(health.status === 'healthy' ? 200 : 503).json({
      success: health.status === 'healthy',
      status: health.status,
      message: health.message,
      details: health.details,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get capabilities
 * GET /api/invoice/capabilities
 */
router.get('/capabilities', async (req: Request, res: Response) => {
  try {
    const capabilities = await invoiceService.getCapabilities();

    res.status(200).json({
      success: true,
      data: capabilities
    });
  } catch (error: any) {
    console.error('[Invoice API] Error getting capabilities:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;

