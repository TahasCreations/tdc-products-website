/**
 * Shipping Service Implementation
 * Orchestrates shipping operations using adapters and repository
 */

import { ShippingPort, CreateLabelRequest, CreateLabelResponse, CancelLabelRequest, CancelLabelResponse, GetRatesRequest, GetRatesResponse, TrackPackageRequest, TrackPackageResponse, ValidateAddressRequest, ValidateAddressResponse, ShippingService, ShippingRate, ShippingLabel, TrackingEvent, ShippingContract } from '@tdc/domain';
import { ShippingRepository, CreateShippingLabelInput, CreateTrackingEventInput } from '../database/repositories/shipping.repository.js';
import { PrismaClient } from '../database/prisma-client.js';
import { PTTAdapter } from './ptt.adapter.js';
import { CustomCargoAdapter } from './custom-cargo.adapter.js';
import { 
  calculateShippingCost,
  validateShippingAddress,
  validatePackageDimensions,
  generateTrackingNumber,
  generateLabelNumber,
  validateServiceAvailability
} from '@tdc/domain';

export class ShippingService implements ShippingPort {
  private prisma: PrismaClient;
  private shippingRepo: ShippingRepository;
  private adapters: Map<string, ShippingPort>;

  constructor() {
    this.prisma = new PrismaClient();
    this.shippingRepo = new ShippingRepository(this.prisma);
    this.adapters = new Map();
    
    // Initialize adapters
    this.initializeAdapters();
  }

  private initializeAdapters(): void {
    // PTT Adapter
    this.adapters.set('PTT', new PTTAdapter({
      baseUrl: process.env.PTT_API_URL || 'https://api.ptt.gov.tr',
      apiKey: process.env.PTT_API_KEY || 'mock-api-key',
      contractId: 'ptt-contract-1'
    }));

    // Custom Cargo Adapters
    this.adapters.set('ARAS', new CustomCargoAdapter({
      baseUrl: process.env.ARAS_API_URL || 'https://api.aras.com',
      apiKey: process.env.ARAS_API_KEY || 'mock-api-key',
      contractId: 'aras-contract-1',
      provider: 'ARAS'
    }));

    this.adapters.set('MNG', new CustomCargoAdapter({
      baseUrl: process.env.MNG_API_URL || 'https://api.mng.com',
      apiKey: process.env.MNG_API_KEY || 'mock-api-key',
      contractId: 'mng-contract-1',
      provider: 'MNG'
    }));

    this.adapters.set('YURTICI', new CustomCargoAdapter({
      baseUrl: process.env.YURTICI_API_URL || 'https://api.yurtici.com',
      apiKey: process.env.YURTICI_API_KEY || 'mock-api-key',
      contractId: 'yurtici-contract-1',
      provider: 'YURTICI'
    }));
  }

  async getAvailableServices(contractId: string): Promise<ShippingService[]> {
    try {
      console.log('[Shipping Service] Getting available services for contract:', contractId);

      const contract = await this.shippingRepo.getShippingContractById(contractId);
      if (!contract) {
        throw new Error('Contract not found');
      }

      const adapter = this.adapters.get(contract.provider);
      if (!adapter) {
        throw new Error(`No adapter found for provider: ${contract.provider}`);
      }

      return await adapter.getAvailableServices(contractId);
    } catch (error) {
      console.error('[Shipping Service] Error getting available services:', error);
      throw new Error(`Failed to get available services: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRates(request: GetRatesRequest): Promise<GetRatesResponse> {
    try {
      console.log('[Shipping Service] Getting rates for package:', request.package);

      // Validate addresses
      const senderValidation = validateShippingAddress(request.senderAddress);
      const recipientValidation = validateShippingAddress(request.recipientAddress);
      
      if (!senderValidation.isValid) {
        return {
          success: false,
          error: `Invalid sender address: ${senderValidation.errors.join(', ')}`,
          errorCode: 'INVALID_SENDER_ADDRESS'
        };
      }

      if (!recipientValidation.isValid) {
        return {
          success: false,
          error: `Invalid recipient address: ${recipientValidation.errors.join(', ')}`,
          errorCode: 'INVALID_RECIPIENT_ADDRESS'
        };
      }

      // Validate package dimensions
      const packageValidation = validatePackageDimensions(request.package);
      if (!packageValidation.isValid) {
        return {
          success: false,
          error: `Invalid package dimensions: ${packageValidation.errors.join(', ')}`,
          errorCode: 'INVALID_PACKAGE_DIMENSIONS'
        };
      }

      // Get active contracts
      const contracts = await this.shippingRepo.getActiveShippingContracts(request.tenantId);
      if (contracts.length === 0) {
        return {
          success: false,
          error: 'No active shipping contracts found',
          errorCode: 'NO_ACTIVE_CONTRACTS'
        };
      }

      const allRates: ShippingRate[] = [];

      // Get rates from each contract
      for (const contract of contracts) {
        try {
          const adapter = this.adapters.get(contract.provider);
          if (!adapter) {
            console.warn(`[Shipping Service] No adapter found for provider: ${contract.provider}`);
            continue;
          }

          const contractRates = await adapter.getRates({
            ...request,
            contractId: contract.id
          });

          if (contractRates.success && contractRates.rates) {
            // Add contract information to rates
            const ratesWithContract = contractRates.rates.map(rate => ({
              ...rate,
              contractId: contract.id,
              contractName: contract.contractName,
              provider: contract.provider
            }));

            allRates.push(...ratesWithContract);
          }
        } catch (error) {
          console.error(`[Shipping Service] Error getting rates from ${contract.provider}:`, error);
          // Continue with other contracts
        }
      }

      // Sort rates by price
      allRates.sort((a, b) => a.price - b.price);

      return {
        success: true,
        rates: allRates
      };
    } catch (error) {
      console.error('[Shipping Service] Error getting rates:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get rates',
        errorCode: 'RATE_CALCULATION_ERROR'
      };
    }
  }

  async createLabel(request: CreateLabelRequest): Promise<CreateLabelResponse> {
    try {
      console.log('[Shipping Service] Creating label for order:', request.orderId);

      // Validate addresses
      const senderValidation = validateShippingAddress(request.senderAddress);
      const recipientValidation = validateShippingAddress(request.recipientAddress);
      
      if (!senderValidation.isValid) {
        return {
          success: false,
          error: `Invalid sender address: ${senderValidation.errors.join(', ')}`,
          errorCode: 'INVALID_SENDER_ADDRESS'
        };
      }

      if (!recipientValidation.isValid) {
        return {
          success: false,
          error: `Invalid recipient address: ${recipientValidation.errors.join(', ')}`,
          errorCode: 'INVALID_RECIPIENT_ADDRESS'
        };
      }

      // Validate package dimensions
      const packageValidation = validatePackageDimensions(request.package);
      if (!packageValidation.isValid) {
        return {
          success: false,
          error: `Invalid package dimensions: ${packageValidation.errors.join(', ')}`,
          errorCode: 'INVALID_PACKAGE_DIMENSIONS'
        };
      }

      // Get contract
      const contract = await this.shippingRepo.getShippingContractById(request.contractId);
      if (!contract) {
        return {
          success: false,
          error: 'Contract not found',
          errorCode: 'CONTRACT_NOT_FOUND'
        };
      }

      if (contract.status !== 'ACTIVE') {
        return {
          success: false,
          error: 'Contract is not active',
          errorCode: 'CONTRACT_NOT_ACTIVE'
        };
      }

      // Get adapter
      const adapter = this.adapters.get(contract.provider);
      if (!adapter) {
        return {
          success: false,
          error: `No adapter found for provider: ${contract.provider}`,
          errorCode: 'ADAPTER_NOT_FOUND'
        };
      }

      // Check service availability
      const availability = validateServiceAvailability(
        request.serviceType,
        request.senderAddress,
        request.recipientAddress,
        request.package
      );

      if (!availability.isAvailable) {
        return {
          success: false,
          error: availability.reason || 'Service not available',
          errorCode: 'SERVICE_NOT_AVAILABLE'
        };
      }

      // Create label via adapter
      const adapterResponse = await adapter.createLabel(request);
      
      if (!adapterResponse.success || !adapterResponse.label) {
        return {
          success: false,
          error: adapterResponse.error || 'Failed to create label',
          errorCode: adapterResponse.errorCode || 'LABEL_CREATION_ERROR'
        };
      }

      // Save label to database
      const labelInput: CreateShippingLabelInput = {
        tenantId: request.tenantId || '',
        orderId: request.orderId,
        contractId: request.contractId,
        labelNumber: adapterResponse.label.labelNumber,
        trackingNumber: adapterResponse.label.trackingNumber,
        serviceType: request.serviceType,
        status: adapterResponse.label.status,
        weight: request.weight,
        dimensions: request.package,
        packageType: request.packageType,
        senderAddress: request.senderAddress,
        recipientAddress: request.recipientAddress,
        basePrice: adapterResponse.label.basePrice,
        surcharges: adapterResponse.label.surcharges,
        discounts: adapterResponse.label.discounts,
        totalPrice: adapterResponse.label.totalPrice,
        currency: adapterResponse.label.currency,
        providerLabelId: adapterResponse.label.providerLabelId,
        providerData: adapterResponse.label.metadata,
        labelUrl: adapterResponse.label.labelUrl,
        barcodeUrl: adapterResponse.label.barcodeUrl,
        notes: request.notes,
        metadata: {
          ...request.metadata,
          contractName: contract.contractName,
          provider: contract.provider
        }
      };

      const savedLabel = await this.shippingRepo.createShippingLabel(labelInput);

      // Create initial tracking event
      const trackingEventInput: CreateTrackingEventInput = {
        labelId: savedLabel.id,
        tenantId: request.tenantId || '',
        eventType: 'LABEL_CREATED',
        eventName: 'Label Created',
        description: 'Shipping label created successfully',
        eventDate: new Date(),
        providerEventId: adapterResponse.label.providerLabelId,
        metadata: {
          serviceType: request.serviceType,
          provider: contract.provider
        }
      };

      await this.shippingRepo.createTrackingEvent(trackingEventInput);

      // Update contract usage stats
      await this.shippingRepo.updateShippingContract(request.contractId, {
        lastUsedAt: new Date(),
        usageCount: { increment: 1 }
      });

      console.log('[Shipping Service] Label created successfully:', savedLabel.id);

      return {
        success: true,
        label: this.transformToShippingLabel(savedLabel)
      };
    } catch (error) {
      console.error('[Shipping Service] Error creating label:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create label',
        errorCode: 'LABEL_CREATION_ERROR'
      };
    }
  }

  async cancelLabel(request: CancelLabelRequest): Promise<CancelLabelResponse> {
    try {
      console.log('[Shipping Service] Cancelling label:', request.labelId);

      // Get label
      const label = await this.shippingRepo.getShippingLabelById(request.labelId);
      if (!label) {
        return {
          success: false,
          error: 'Label not found',
          errorCode: 'LABEL_NOT_FOUND'
        };
      }

      if (label.status === 'CANCELLED') {
        return {
          success: false,
          error: 'Label is already cancelled',
          errorCode: 'LABEL_ALREADY_CANCELLED'
        };
      }

      if (label.status === 'DELIVERED') {
        return {
          success: false,
          error: 'Cannot cancel delivered label',
          errorCode: 'LABEL_ALREADY_DELIVERED'
        };
      }

      // Get contract and adapter
      const contract = await this.shippingRepo.getShippingContractById(label.contractId);
      if (!contract) {
        return {
          success: false,
          error: 'Contract not found',
          errorCode: 'CONTRACT_NOT_FOUND'
        };
      }

      const adapter = this.adapters.get(contract.provider);
      if (!adapter) {
        return {
          success: false,
          error: `No adapter found for provider: ${contract.provider}`,
          errorCode: 'ADAPTER_NOT_FOUND'
        };
      }

      // Cancel label via adapter
      const adapterResponse = await adapter.cancelLabel({
        labelId: request.labelId,
        reason: request.reason
      });

      if (!adapterResponse.success) {
        return {
          success: false,
          error: adapterResponse.error || 'Failed to cancel label',
          errorCode: adapterResponse.errorCode || 'LABEL_CANCELLATION_ERROR'
        };
      }

      // Update label status
      await this.shippingRepo.updateShippingLabel(request.labelId, {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        notes: request.reason
      });

      // Create tracking event
      const trackingEventInput: CreateTrackingEventInput = {
        labelId: request.labelId,
        tenantId: label.tenantId,
        eventType: 'CANCELLED',
        eventName: 'Label Cancelled',
        description: request.reason || 'Label cancelled',
        eventDate: new Date(),
        metadata: {
          reason: request.reason,
          refundAmount: adapterResponse.refundAmount
        }
      };

      await this.shippingRepo.createTrackingEvent(trackingEventInput);

      console.log('[Shipping Service] Label cancelled successfully:', request.labelId);

      return {
        success: true,
        refundAmount: adapterResponse.refundAmount
      };
    } catch (error) {
      console.error('[Shipping Service] Error cancelling label:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel label',
        errorCode: 'LABEL_CANCELLATION_ERROR'
      };
    }
  }

  async trackPackage(request: TrackPackageRequest): Promise<TrackPackageResponse> {
    try {
      console.log('[Shipping Service] Tracking package:', request.trackingNumber);

      // Get label by tracking number
      const label = await this.shippingRepo.getShippingLabelByTrackingNumber(request.trackingNumber);
      if (!label) {
        return {
          success: false,
          error: 'Package not found',
          errorCode: 'PACKAGE_NOT_FOUND'
        };
      }

      // Get contract and adapter
      const contract = await this.shippingRepo.getShippingContractById(label.contractId);
      if (!contract) {
        return {
          success: false,
          error: 'Contract not found',
          errorCode: 'CONTRACT_NOT_FOUND'
        };
      }

      const adapter = this.adapters.get(contract.provider);
      if (!adapter) {
        return {
          success: false,
          error: `No adapter found for provider: ${contract.provider}`,
          errorCode: 'ADAPTER_NOT_FOUND'
        };
      }

      // Track package via adapter
      const adapterResponse = await adapter.trackPackage({
        trackingNumber: request.trackingNumber,
        contractId: request.contractId
      });

      if (!adapterResponse.success) {
        return {
          success: false,
          error: adapterResponse.error || 'Failed to track package',
          errorCode: adapterResponse.errorCode || 'TRACKING_ERROR'
        };
      }

      // Update label status if needed
      if (adapterResponse.currentStatus && adapterResponse.currentStatus !== label.status) {
        await this.shippingRepo.updateShippingLabel(label.id, {
          status: adapterResponse.currentStatus as any
        });
      }

      // Save new tracking events
      if (adapterResponse.trackingEvents) {
        for (const event of adapterResponse.trackingEvents) {
          const trackingEventInput: CreateTrackingEventInput = {
            labelId: label.id,
            tenantId: label.tenantId,
            eventType: event.eventType as any,
            eventName: event.eventName,
            description: event.description,
            location: event.location,
            city: event.city,
            state: event.state,
            country: event.country,
            postalCode: event.postalCode,
            status: event.status,
            statusCode: event.statusCode,
            eventDate: event.eventDate,
            providerEventId: event.providerEventId,
            providerData: event.providerData,
            metadata: event.metadata
          };

          await this.shippingRepo.createTrackingEvent(trackingEventInput);
        }
      }

      return {
        success: true,
        trackingEvents: adapterResponse.trackingEvents || [],
        currentStatus: adapterResponse.currentStatus,
        estimatedDelivery: adapterResponse.estimatedDelivery
      };
    } catch (error) {
      console.error('[Shipping Service] Error tracking package:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to track package',
        errorCode: 'TRACKING_ERROR'
      };
    }
  }

  async getLabel(labelId: string): Promise<ShippingLabel | null> {
    try {
      const label = await this.shippingRepo.getShippingLabelById(labelId);
      return label ? this.transformToShippingLabel(label) : null;
    } catch (error) {
      console.error('[Shipping Service] Error getting label:', error);
      return null;
    }
  }

  async downloadLabel(labelId: string): Promise<{ success: boolean; pdfData?: Buffer; error?: string }> {
    try {
      const label = await this.shippingRepo.getShippingLabelById(labelId);
      if (!label) {
        return {
          success: false,
          error: 'Label not found'
        };
      }

      const contract = await this.shippingRepo.getShippingContractById(label.contractId);
      if (!contract) {
        return {
          success: false,
          error: 'Contract not found'
        };
      }

      const adapter = this.adapters.get(contract.provider);
      if (!adapter) {
        return {
          success: false,
          error: `No adapter found for provider: ${contract.provider}`
        };
      }

      return await adapter.downloadLabel(labelId);
    } catch (error) {
      console.error('[Shipping Service] Error downloading label:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to download label'
      };
    }
  }

  async printLabel(labelId: string, printerId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const label = await this.shippingRepo.getShippingLabelById(labelId);
      if (!label) {
        return {
          success: false,
          error: 'Label not found'
        };
      }

      const contract = await this.shippingRepo.getShippingContractById(label.contractId);
      if (!contract) {
        return {
          success: false,
          error: 'Contract not found'
        };
      }

      const adapter = this.adapters.get(contract.provider);
      if (!adapter) {
        return {
          success: false,
          error: `No adapter found for provider: ${contract.provider}`
        };
      }

      const result = await adapter.printLabel(labelId, printerId);
      
      if (result.success) {
        // Update label status to printed
        await this.shippingRepo.updateShippingLabel(labelId, {
          status: 'PRINTED',
          printedAt: new Date()
        });
      }

      return result;
    } catch (error) {
      console.error('[Shipping Service] Error printing label:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to print label'
      };
    }
  }

  async validateAddress(request: ValidateAddressRequest): Promise<ValidateAddressResponse> {
    try {
      const validation = validateShippingAddress(request.address);
      
      return {
        success: true,
        isValid: validation.isValid,
        normalizedAddress: validation.isValid ? request.address : undefined,
        suggestions: validation.isValid ? [] : []
      };
    } catch (error) {
      console.error('[Shipping Service] Error validating address:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to validate address',
        errorCode: 'ADDRESS_VALIDATION_ERROR'
      };
    }
  }

  async getTrackingEvents(labelId: string): Promise<TrackingEvent[]> {
    try {
      const events = await this.shippingRepo.getTrackingEventsByLabel(labelId);
      return events.map(event => this.transformToTrackingEvent(event));
    } catch (error) {
      console.error('[Shipping Service] Error getting tracking events:', error);
      return [];
    }
  }

  async updateLabelStatus(labelId: string, status: string, metadata?: any): Promise<{ success: boolean; error?: string }> {
    try {
      await this.shippingRepo.updateShippingLabel(labelId, {
        status: status as any,
        metadata: metadata
      });

      return { success: true };
    } catch (error) {
      console.error('[Shipping Service] Error updating label status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update label status'
      };
    }
  }

  async getContract(contractId: string): Promise<ShippingContract | null> {
    try {
      const contract = await this.shippingRepo.getShippingContractById(contractId);
      return contract ? this.transformToShippingContract(contract) : null;
    } catch (error) {
      console.error('[Shipping Service] Error getting contract:', error);
      return null;
    }
  }

  async testConnection(contractId: string): Promise<{ success: boolean; error?: string; responseTime?: number }> {
    try {
      const contract = await this.shippingRepo.getShippingContractById(contractId);
      if (!contract) {
        return {
          success: false,
          error: 'Contract not found'
        };
      }

      const adapter = this.adapters.get(contract.provider);
      if (!adapter) {
        return {
          success: false,
          error: `No adapter found for provider: ${contract.provider}`
        };
      }

      return await adapter.testConnection(contractId);
    } catch (error) {
      console.error('[Shipping Service] Error testing connection:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to test connection'
      };
    }
  }

  async getProviderCapabilities(provider: string): Promise<any> {
    try {
      const adapter = this.adapters.get(provider);
      if (!adapter) {
        return {
          supportedServices: [],
          supportedCountries: [],
          supportedPackageTypes: [],
          maxWeight: 0,
          maxDimensions: { length: 0, width: 0, height: 0 },
          features: []
        };
      }

      return await adapter.getProviderCapabilities(provider);
    } catch (error) {
      console.error('[Shipping Service] Error getting provider capabilities:', error);
      return {
        supportedServices: [],
        supportedCountries: [],
        supportedPackageTypes: [],
        maxWeight: 0,
        maxDimensions: { length: 0, width: 0, height: 0 },
        features: []
      };
    }
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string; details?: any }> {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;

      // Check adapters
      const adapterStatuses: Record<string, boolean> = {};
      for (const [provider, adapter] of this.adapters) {
        try {
          const health = await adapter.healthCheck();
          adapterStatuses[provider] = health.status === 'healthy';
        } catch (error) {
          adapterStatuses[provider] = false;
        }
      }

      const healthyAdapters = Object.values(adapterStatuses).filter(Boolean).length;
      const totalAdapters = Object.keys(adapterStatuses).length;

      return {
        status: healthyAdapters > 0 ? 'healthy' : 'unhealthy',
        message: `Shipping service is ${healthyAdapters > 0 ? 'healthy' : 'unhealthy'}`,
        details: {
          databaseConnected: true,
          adapters: adapterStatuses,
          healthyAdapters,
          totalAdapters
        }
      };
    } catch (error) {
      console.error('[Shipping Service] Health check failed:', error);
      return {
        status: 'unhealthy',
        message: `Shipping service health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  async getCapabilities(): Promise<any> {
    return {
      supportedProviders: Array.from(this.adapters.keys()),
      supportedServices: ['express', 'standard', 'economy'],
      maxConcurrentRequests: 100,
      rateLimitPerMinute: 1000,
      supportedFormats: ['PDF', 'PNG', 'ZPL']
    };
  }

  // Private helper methods

  private transformToShippingLabel(label: any): ShippingLabel {
    return {
      id: label.id,
      labelNumber: label.labelNumber,
      trackingNumber: label.trackingNumber,
      serviceType: label.serviceType,
      status: label.status,
      weight: label.weight,
      dimensions: label.dimensions,
      packageType: label.packageType,
      senderAddress: label.senderAddress,
      recipientAddress: label.recipientAddress,
      basePrice: label.basePrice,
      surcharges: label.surcharges,
      discounts: label.discounts,
      totalPrice: label.totalPrice,
      currency: label.currency,
      providerLabelId: label.providerLabelId,
      labelUrl: label.labelUrl,
      barcodeUrl: label.barcodeUrl,
      createdAt: label.createdAt,
      printedAt: label.printedAt,
      shippedAt: label.shippedAt,
      deliveredAt: label.deliveredAt,
      cancelledAt: label.cancelledAt,
      errorMessage: label.errorMessage,
      retryCount: label.retryCount,
      lastRetryAt: label.lastRetryAt,
      notes: label.notes,
      metadata: label.metadata
    };
  }

  private transformToTrackingEvent(event: any): TrackingEvent {
    return {
      id: event.id,
      eventType: event.eventType,
      eventName: event.eventName,
      description: event.description,
      location: event.location,
      city: event.city,
      state: event.state,
      country: event.country,
      postalCode: event.postalCode,
      status: event.status,
      statusCode: event.statusCode,
      eventDate: event.eventDate,
      recordedAt: event.recordedAt,
      providerEventId: event.providerEventId,
      providerData: event.providerData,
      metadata: event.metadata
    };
  }

  private transformToShippingContract(contract: any): ShippingContract {
    return {
      id: contract.id,
      contractName: contract.contractName,
      provider: contract.provider,
      contractNumber: contract.contractNumber,
      status: contract.status,
      providerConfig: contract.providerConfig,
      apiCredentials: contract.apiCredentials,
      services: contract.services,
      zones: contract.zones,
      weightLimits: contract.weightLimits,
      dimensionLimits: contract.dimensionLimits,
      baseRates: contract.baseRates,
      surcharges: contract.surcharges,
      discounts: contract.discounts,
      startDate: contract.startDate,
      endDate: contract.endDate,
      autoRenew: contract.autoRenew,
      noticePeriod: contract.noticePeriod,
      contactName: contract.contactName,
      contactEmail: contract.contactEmail,
      contactPhone: contract.contactPhone,
      lastUsedAt: contract.lastUsedAt,
      usageCount: contract.usageCount,
      errorCount: contract.errorCount,
      lastErrorAt: contract.lastErrorAt,
      lastErrorMessage: contract.lastErrorMessage,
      description: contract.description,
      tags: contract.tags,
      metadata: contract.metadata,
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt
    };
  }

  async cleanup() {
    await this.prisma.$disconnect();
  }
}

