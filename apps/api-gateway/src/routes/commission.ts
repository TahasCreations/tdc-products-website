import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { 
  calculateCommission, 
  calculateCommissionForItems, 
  SellerType,
  CommissionCalculationInput,
  CommissionCalculationResult 
} from '@tdc/domain';
import { validateInput } from '@tdc/infra';

const router = express.Router();

// Commission calculation request schema
const commissionCalculationSchema = z.object({
  orderAmount: z.number().positive('Order amount must be positive'),
  sellerType: z.enum(['TYPE_A', 'TYPE_B'], {
    errorMap: () => ({ message: 'Seller type must be TYPE_A or TYPE_B' })
  }),
  customCommissionRate: z.number().min(0).max(1).optional(),
  taxRate: z.number().min(0).max(1).optional()
});

// Multiple items commission calculation schema
const multipleItemsSchema = z.object({
  items: z.array(z.object({
    amount: z.number().positive('Item amount must be positive'),
    sellerType: z.enum(['TYPE_A', 'TYPE_B']),
    customCommissionRate: z.number().min(0).max(1).optional()
  })).min(1, 'At least one item is required'),
  taxRate: z.number().min(0).max(1).optional()
});

/**
 * Calculate commission for a single order
 * POST /api/commission/calculate
 */
router.post('/calculate', 
  validateInput(commissionCalculationSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderAmount, sellerType, customCommissionRate, taxRate } = req.body;

      const input: CommissionCalculationInput = {
        orderAmount,
        sellerType: sellerType as SellerType,
        customCommissionRate,
        taxRate
      };

      const result = calculateCommission(input);

      res.json({
        success: true,
        data: {
          ...result,
          breakdown: {
            orderAmount: result.baseAmount,
            commission: {
              rate: `${(result.commissionRate * 100).toFixed(2)}%`,
              amount: result.commissionAmount,
              tax: {
                rate: `${(result.taxRate * 100).toFixed(2)}%`,
                amount: result.taxAmount
              },
              total: result.totalCommission
            },
            distribution: {
              sellerAmount: result.sellerAmount,
              platformAmount: result.platformAmount
            },
            invoice: {
              eligible: result.isInvoiceEligible,
              issuer: result.invoiceIssuer
            }
          }
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Calculate commission for multiple order items
 * POST /api/commission/calculate-multiple
 */
router.post('/calculate-multiple',
  validateInput(multipleItemsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { items, taxRate } = req.body;

      const result = calculateCommissionForItems(
        items.map((item: any) => ({
          amount: item.amount,
          sellerType: item.sellerType as SellerType,
          customCommissionRate: item.customCommissionRate
        })),
        taxRate
      );

      res.json({
        success: true,
        data: {
          ...result,
          breakdown: {
            totalOrderAmount: result.baseAmount,
            commission: {
              averageRate: `${(result.commissionRate * 100).toFixed(2)}%`,
              totalAmount: result.commissionAmount,
              tax: {
                rate: `${(result.taxRate * 100).toFixed(2)}%`,
                amount: result.taxAmount
              },
              total: result.totalCommission
            },
            distribution: {
              totalSellerAmount: result.sellerAmount,
              totalPlatformAmount: result.platformAmount
            },
            invoice: {
              eligible: result.isInvoiceEligible,
              issuer: result.invoiceIssuer
            }
          },
          itemCount: items.length
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get commission rates for different seller types
 * GET /api/commission/rates
 */
router.get('/rates', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rates = {
      TYPE_A: {
        name: 'Company Seller',
        description: 'Şirketi olan satıcı',
        commissionRate: '7%',
        taxRate: '18% KDV',
        totalRate: '8.26%',
        invoiceEligible: true,
        invoiceIssuer: 'SELLER',
        requirements: [
          'Vergi numarası',
          'Vergi dairesi',
          'Adres bilgisi',
          'Fatura kesebilme yetkisi'
        ]
      },
      TYPE_B: {
        name: 'Individual/IG Seller',
        description: 'Şirketi olmayan IG satıcısı',
        commissionRate: '10%',
        taxRate: '18% KDV',
        totalRate: '11.8%',
        invoiceEligible: false,
        invoiceIssuer: 'PLATFORM',
        requirements: [
          'Instagram hesabı',
          'Banka hesabı/IBAN',
          'Kimlik bilgileri',
          'Platform tarafından faturalandırma'
        ]
      }
    };

    res.json({
      success: true,
      data: rates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Calculate commission for a real order with seller data
 * POST /api/commission/calculate-order
 */
router.post('/calculate-order',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderItems, sellerType } = req.body;

      if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Order items are required',
          timestamp: new Date().toISOString()
        });
      }

      if (!sellerType || !['TYPE_A', 'TYPE_B'].includes(sellerType)) {
        return res.status(400).json({
          success: false,
          error: 'Valid seller type is required (TYPE_A or TYPE_B)',
          timestamp: new Date().toISOString()
        });
      }

      // Calculate total order amount
      const totalAmount = orderItems.reduce((sum: number, item: any) => {
        return sum + (item.quantity * item.unitPrice);
      }, 0);

      // Calculate commission
      const result = calculateCommission({
        orderAmount: totalAmount,
        sellerType: sellerType as SellerType
      });

      // Calculate per-item breakdown
      const itemBreakdown = orderItems.map((item: any) => {
        const itemAmount = item.quantity * item.unitPrice;
        const itemCommission = calculateCommission({
          orderAmount: itemAmount,
          sellerType: sellerType as SellerType
        });

        return {
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          itemAmount,
          commission: {
            rate: `${(itemCommission.commissionRate * 100).toFixed(2)}%`,
            amount: itemCommission.commissionAmount,
            tax: itemCommission.taxAmount,
            total: itemCommission.totalCommission
          },
          sellerAmount: itemCommission.sellerAmount
        };
      });

      res.json({
        success: true,
        data: {
          order: {
            totalAmount,
            itemCount: orderItems.length,
            sellerType
          },
          commission: {
            ...result,
            breakdown: {
              orderAmount: result.baseAmount,
              commission: {
                rate: `${(result.commissionRate * 100).toFixed(2)}%`,
                amount: result.commissionAmount,
                tax: {
                  rate: `${(result.taxRate * 100).toFixed(2)}%`,
                  amount: result.taxAmount
                },
                total: result.totalCommission
              },
              distribution: {
                sellerAmount: result.sellerAmount,
                platformAmount: result.platformAmount
              },
              invoice: {
                eligible: result.isInvoiceEligible,
                issuer: result.invoiceIssuer
              }
            }
          },
          items: itemBreakdown
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get commission examples for different scenarios
 * GET /api/commission/examples
 */
router.get('/examples', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const examples = [
      {
        scenario: 'TYPE_A Seller - 1000 TL Order',
        input: { orderAmount: 1000, sellerType: 'TYPE_A' },
        result: calculateCommission({ orderAmount: 1000, sellerType: SellerType.TYPE_A })
      },
      {
        scenario: 'TYPE_B Seller - 1000 TL Order',
        input: { orderAmount: 1000, sellerType: 'TYPE_B' },
        result: calculateCommission({ orderAmount: 1000, sellerType: SellerType.TYPE_B })
      },
      {
        scenario: 'TYPE_A Seller - 5000 TL Order',
        input: { orderAmount: 5000, sellerType: 'TYPE_A' },
        result: calculateCommission({ orderAmount: 5000, sellerType: SellerType.TYPE_A })
      },
      {
        scenario: 'TYPE_B Seller - 5000 TL Order',
        input: { orderAmount: 5000, sellerType: 'TYPE_B' },
        result: calculateCommission({ orderAmount: 5000, sellerType: SellerType.TYPE_B })
      }
    ];

    const formattedExamples = examples.map(example => ({
      scenario: example.scenario,
      input: example.input,
      result: {
        ...example.result,
        breakdown: {
          orderAmount: example.result.baseAmount,
          commission: {
            rate: `${(example.result.commissionRate * 100).toFixed(2)}%`,
            amount: example.result.commissionAmount,
            tax: {
              rate: `${(example.result.taxRate * 100).toFixed(2)}%`,
              amount: example.result.taxAmount
            },
            total: example.result.totalCommission
          },
          distribution: {
            sellerAmount: example.result.sellerAmount,
            platformAmount: example.result.platformAmount
          },
          invoice: {
            eligible: example.result.isInvoiceEligible,
            issuer: example.result.invoiceIssuer
          }
        }
      }
    }));

    res.json({
      success: true,
      data: {
        examples: formattedExamples,
        summary: {
          typeA: {
            description: 'Company sellers get 7% + 18% KDV = 8.26% total commission',
            canIssueInvoices: true
          },
          typeB: {
            description: 'Individual/IG sellers get 10% + 18% KDV = 11.8% total commission',
            canIssueInvoices: false,
            platformInvoicing: true
          }
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

export default router;
