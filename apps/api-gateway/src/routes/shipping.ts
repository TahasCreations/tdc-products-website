/**
 * Shipping Management API Routes
 * Handles shipping contracts, labels, tracking, and provider management
 */

import { Router } from 'express';
import { z } from 'zod';
import { ShippingService } from '@tdc/infra';

const router = Router();
const shippingService = new ShippingService();

// Validation schemas
const ShippingAddressSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional()
});

const PackageDimensionsSchema = z.object({
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
  weight: z.number().positive()
});

const CreateLabelSchema = z.object({
  orderId: z.string().min(1),
  contractId: z.string().min(1),
  serviceType: z.string().min(1),
  weight: z.number().positive(),
  dimensions: PackageDimensionsSchema,
  packageType: z.string().optional(),
  senderAddress: ShippingAddressSchema,
  recipientAddress: ShippingAddressSchema,
  insuranceValue: z.number().optional(),
  codAmount: z.number().optional(),
  signatureRequired: z.boolean().optional(),
  fragile: z.boolean().optional(),
  notes: z.string().optional(),
  metadata: z.any().optional()
});

const GetRatesSchema = z.object({
  senderAddress: ShippingAddressSchema,
  recipientAddress: ShippingAddressSchema,
  package: PackageDimensionsSchema,
  services: z.array(z.string()).optional(),
  contractId: z.string().optional()
});

const CancelLabelSchema = z.object({
  reason: z.string().optional()
});

const TrackPackageSchema = z.object({
  trackingNumber: z.string().min(1),
  contractId: z.string().optional()
});

const ValidateAddressSchema = z.object({
  address: ShippingAddressSchema
});

// Shipping Contract Management

/**
 * GET /api/shipping/contracts
 * Get shipping contracts for a tenant
 */
router.get('/contracts', async (req, res) => {
  try {
    const { tenantId, page = '1', limit = '50' } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await shippingService.getShippingContractsByTenant(
      tenantId as string,
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: result,
      message: `Found ${result.contracts.length} shipping contracts`
    });
  } catch (error) {
    console.error('Get shipping contracts error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get shipping contracts'
    });
  }
});

/**
 * GET /api/shipping/contracts/active
 * Get active shipping contracts
 */
router.get('/contracts/active', async (req, res) => {
  try {
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const contracts = await shippingService.getActiveShippingContracts(tenantId as string);

    res.json({
      success: true,
      data: contracts,
      message: `Found ${contracts.length} active contracts`
    });
  } catch (error) {
    console.error('Get active contracts error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get active contracts'
    });
  }
});

/**
 * GET /api/shipping/contracts/:contractId
 * Get specific shipping contract
 */
router.get('/contracts/:contractId', async (req, res) => {
  try {
    const { contractId } = req.params;

    const contract = await shippingService.getContract(contractId);

    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    res.json({
      success: true,
      data: contract,
      message: 'Contract found'
    });
  } catch (error) {
    console.error('Get contract error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get contract'
    });
  }
});

/**
 * POST /api/shipping/contracts/:contractId/test
 * Test contract connection
 */
router.post('/contracts/:contractId/test', async (req, res) => {
  try {
    const { contractId } = req.params;

    const result = await shippingService.testConnection(contractId);

    res.json({
      success: result.success,
      data: result,
      message: result.success ? 'Connection test successful' : 'Connection test failed'
    });
  } catch (error) {
    console.error('Test connection error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to test connection'
    });
  }
});

// Shipping Services

/**
 * GET /api/shipping/services
 * Get available shipping services for a contract
 */
router.get('/services', async (req, res) => {
  try {
    const { contractId } = req.query;

    if (!contractId) {
      return res.status(400).json({
        success: false,
        error: 'contractId is required'
      });
    }

    const services = await shippingService.getAvailableServices(contractId as string);

    res.json({
      success: true,
      data: services,
      message: `Found ${services.length} available services`
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get services'
    });
  }
});

/**
 * POST /api/shipping/rates
 * Get shipping rates
 */
router.post('/rates', async (req, res) => {
  try {
    const validatedData = GetRatesSchema.parse(req.body);
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await shippingService.getRates({
      ...validatedData,
      tenantId: tenantId as string
    });

    res.json({
      success: result.success,
      data: result,
      message: result.success ? 'Rates calculated successfully' : 'Failed to calculate rates'
    });
  } catch (error) {
    console.error('Get rates error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get rates',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

// Shipping Labels

/**
 * POST /api/shipping/labels
 * Create shipping label
 */
router.post('/labels', async (req, res) => {
  try {
    const validatedData = CreateLabelSchema.parse(req.body);
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await shippingService.createLabel({
      ...validatedData,
      tenantId: tenantId as string
    });

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result,
      message: result.success ? 'Label created successfully' : 'Failed to create label'
    });
  } catch (error) {
    console.error('Create label error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create label',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * GET /api/shipping/labels/:labelId
 * Get shipping label details
 */
router.get('/labels/:labelId', async (req, res) => {
  try {
    const { labelId } = req.params;

    const label = await shippingService.getLabel(labelId);

    if (!label) {
      return res.status(404).json({
        success: false,
        error: 'Label not found'
      });
    }

    res.json({
      success: true,
      data: label,
      message: 'Label found'
    });
  } catch (error) {
    console.error('Get label error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get label'
    });
  }
});

/**
 * DELETE /api/shipping/labels/:labelId
 * Cancel shipping label
 */
router.delete('/labels/:labelId', async (req, res) => {
  try {
    const { labelId } = req.params;
    const validatedData = CancelLabelSchema.parse(req.body);

    const result = await shippingService.cancelLabel({
      labelId,
      reason: validatedData.reason
    });

    res.json({
      success: result.success,
      data: result,
      message: result.success ? 'Label cancelled successfully' : 'Failed to cancel label'
    });
  } catch (error) {
    console.error('Cancel label error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel label',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * GET /api/shipping/labels/:labelId/download
 * Download shipping label PDF
 */
router.get('/labels/:labelId/download', async (req, res) => {
  try {
    const { labelId } = req.params;

    const result = await shippingService.downloadLabel(labelId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Failed to download label'
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="label-${labelId}.pdf"`);
    res.send(result.pdfData);
  } catch (error) {
    console.error('Download label error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to download label'
    });
  }
});

/**
 * POST /api/shipping/labels/:labelId/print
 * Print shipping label
 */
router.post('/labels/:labelId/print', async (req, res) => {
  try {
    const { labelId } = req.params;
    const { printerId } = req.body;

    const result = await shippingService.printLabel(labelId, printerId);

    res.json({
      success: result.success,
      message: result.success ? 'Label sent to printer' : 'Failed to print label',
      error: result.error
    });
  } catch (error) {
    console.error('Print label error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to print label'
    });
  }
});

// Package Tracking

/**
 * POST /api/shipping/track
 * Track package by tracking number
 */
router.post('/track', async (req, res) => {
  try {
    const validatedData = TrackPackageSchema.parse(req.body);
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await shippingService.trackPackage({
      ...validatedData,
      tenantId: tenantId as string
    });

    res.json({
      success: result.success,
      data: result,
      message: result.success ? 'Package tracked successfully' : 'Failed to track package'
    });
  } catch (error) {
    console.error('Track package error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to track package',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * GET /api/shipping/labels/:labelId/tracking
 * Get tracking events for a label
 */
router.get('/labels/:labelId/tracking', async (req, res) => {
  try {
    const { labelId } = req.params;

    const events = await shippingService.getTrackingEvents(labelId);

    res.json({
      success: true,
      data: events,
      message: `Found ${events.length} tracking events`
    });
  } catch (error) {
    console.error('Get tracking events error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get tracking events'
    });
  }
});

// Address Validation

/**
 * POST /api/shipping/validate-address
 * Validate shipping address
 */
router.post('/validate-address', async (req, res) => {
  try {
    const validatedData = ValidateAddressSchema.parse(req.body);

    const result = await shippingService.validateAddress(validatedData);

    res.json({
      success: result.success,
      data: result,
      message: result.success ? 'Address validation completed' : 'Address validation failed'
    });
  } catch (error) {
    console.error('Validate address error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to validate address',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

// Provider Management

/**
 * GET /api/shipping/providers/:provider/capabilities
 * Get provider capabilities
 */
router.get('/providers/:provider/capabilities', async (req, res) => {
  try {
    const { provider } = req.params;

    const capabilities = await shippingService.getProviderCapabilities(provider);

    res.json({
      success: true,
      data: capabilities,
      message: `Capabilities for ${provider} provider`
    });
  } catch (error) {
    console.error('Get provider capabilities error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get provider capabilities'
    });
  }
});

// Statistics and Monitoring

/**
 * GET /api/shipping/statistics
 * Get shipping statistics
 */
router.get('/statistics', async (req, res) => {
  try {
    const { tenantId, dateFrom, dateTo } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const statistics = await shippingService.getShippingStatistics(
      tenantId as string,
      dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo ? new Date(dateTo as string) : undefined
    );

    res.json({
      success: true,
      data: statistics,
      message: 'Shipping statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Get shipping statistics error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get shipping statistics'
    });
  }
});

// System endpoints

/**
 * GET /api/shipping/health
 * Health check for shipping service
 */
router.get('/health', async (req, res) => {
  try {
    const health = await shippingService.healthCheck();

    res.status(health.status === 'healthy' ? 200 : 503).json({
      success: health.status === 'healthy',
      data: health,
      message: health.message
    });
  } catch (error) {
    console.error('Shipping service health check error:', error);
    res.status(503).json({
      success: false,
      error: error instanceof Error ? error.message : 'Health check failed'
    });
  }
});

/**
 * GET /api/shipping/capabilities
 * Get shipping service capabilities
 */
router.get('/capabilities', async (req, res) => {
  try {
    const capabilities = await shippingService.getCapabilities();

    res.json({
      success: true,
      data: capabilities,
      message: 'Shipping service capabilities retrieved'
    });
  } catch (error) {
    console.error('Get capabilities error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get capabilities'
    });
  }
});

export { router as shippingRouter };

