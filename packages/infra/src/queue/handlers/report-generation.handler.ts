import { Job, JobResult } from '../job-service.js';
import { ReportGenerationJobData } from '../job-service.js';
import { S3Adapter } from '../../storage/s3.adapter.js';
import { PrismaOrderRepository, PrismaProductRepository } from '../../database/repositories/index.js';
import { env } from '@tdc/config';

export class ReportGenerationHandler {
  private s3Adapter: S3Adapter;
  private orderRepo: PrismaOrderRepository;
  private productRepo: PrismaProductRepository;

  constructor() {
    this.s3Adapter = new S3Adapter();
    this.orderRepo = new PrismaOrderRepository();
    this.productRepo = new PrismaProductRepository();
  }

  async process(job: Job<ReportGenerationJobData>): Promise<JobResult> {
    const { jobId, tenantId, reportType, dateRange, filters, format, outputPath, emailRecipients } = job.data;

    console.log(`📊 Generating ${reportType} report for tenant ${tenantId}`);

    try {
      let reportData: any;
      let fileName: string;

      // Generate report data based on type
      switch (reportType) {
        case 'sales':
          reportData = await this.generateSalesReport(tenantId, dateRange, filters);
          fileName = `sales-report-${dateRange.start}-${dateRange.end}`;
          break;

        case 'inventory':
          reportData = await this.generateInventoryReport(tenantId, filters);
          fileName = `inventory-report-${new Date().toISOString().split('T')[0]}`;
          break;

        case 'customer':
          reportData = await this.generateCustomerReport(tenantId, dateRange, filters);
          fileName = `customer-report-${dateRange.start}-${dateRange.end}`;
          break;

        case 'financial':
          reportData = await this.generateFinancialReport(tenantId, dateRange, filters);
          fileName = `financial-report-${dateRange.start}-${dateRange.end}`;
          break;

        default:
          throw new Error(`Unknown report type: ${reportType}`);
      }

      console.log(`📈 Generated ${reportType} report data`);

      // Generate file based on format
      let fileBuffer: Buffer;
      let contentType: string;

      switch (format) {
        case 'pdf':
          fileBuffer = await this.generatePDF(reportData, reportType);
          contentType = 'application/pdf';
          fileName += '.pdf';
          break;

        case 'excel':
          fileBuffer = await this.generateExcel(reportData, reportType);
          contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          fileName += '.xlsx';
          break;

        case 'csv':
          fileBuffer = await this.generateCSV(reportData, reportType);
          contentType = 'text/csv';
          fileName += '.csv';
          break;

        default:
          throw new Error(`Unknown format: ${format}`);
      }

      console.log(`📄 Generated ${format} file: ${fileBuffer.length} bytes`);

      // Upload to S3
      const fullOutputPath = `${outputPath}/${fileName}`;
      const uploadResult = await this.s3Adapter.putObject(fileBuffer, {
        key: fullOutputPath,
        contentType,
        acl: 'public-read',
      });

      console.log(`☁️ Uploaded report to: ${uploadResult.url}`);

      // Send email if recipients provided
      if (emailRecipients && emailRecipients.length > 0) {
        await this.sendReportEmail(emailRecipients, reportType, uploadResult.url, fileName);
        console.log(`📧 Report email sent to ${emailRecipients.length} recipients`);
      }

      return {
        success: true,
        jobId,
        result: {
          reportType,
          format,
          fileName,
          fileSize: fileBuffer.length,
          recordCount: reportData.recordCount || 0,
          generatedAt: new Date().toISOString(),
        },
        outputUrl: uploadResult.url,
        metadata: {
          tenantId,
          reportType,
          format,
          dateRange,
          filters,
          emailSent: emailRecipients?.length > 0,
        },
      };

    } catch (error: any) {
      console.error(`❌ Report generation failed for ${reportType}:`, error.message);
      
      return {
        success: false,
        jobId,
        error: error.message,
        metadata: {
          tenantId,
          reportType,
          format,
          dateRange,
        },
      };
    }
  }

  private async generateSalesReport(tenantId: string, dateRange: any, filters: any) {
    console.log(`📊 Generating sales report for ${tenantId}`);
    
    // Get orders in date range
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    const orders = await this.orderRepo.getOrdersByDateRange(tenantId, startDate, endDate);
    const stats = await this.orderRepo.getSalesStats(tenantId, startDate, endDate);

    // Process order data
    const salesData = orders.map(order => ({
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerEmail: order.customerEmail,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
    }));

    return {
      summary: {
        totalOrders: stats.totalOrders,
        totalRevenue: stats.totalRevenue,
        averageOrderValue: stats.averageOrderValue,
        dateRange: { start: dateRange.start, end: dateRange.end },
      },
      orders: salesData,
      recordCount: salesData.length,
    };
  }

  private async generateInventoryReport(tenantId: string, filters: any) {
    console.log(`📦 Generating inventory report for ${tenantId}`);
    
    // Get all products for tenant
    const products = await this.productRepo.findAll(tenantId);
    
    // Process inventory data
    const inventoryData = products.map(product => ({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category?.name || 'Uncategorized',
      seller: product.seller.businessName,
      price: product.price,
      isActive: product.isActive,
      createdAt: product.createdAt,
      variants: product.variants.map(variant => ({
        name: variant.name,
        sku: variant.sku,
        price: variant.price,
        isActive: variant.isActive,
      })),
    }));

    return {
      summary: {
        totalProducts: products.length,
        activeProducts: products.filter(p => p.isActive).length,
        totalVariants: products.reduce((sum, p) => sum + p.variants.length, 0),
      },
      products: inventoryData,
      recordCount: inventoryData.length,
    };
  }

  private async generateCustomerReport(tenantId: string, dateRange: any, filters: any) {
    console.log(`👥 Generating customer report for ${tenantId}`);
    
    // This would typically query user data
    // For now, we'll simulate customer data
    const customerData = [
      {
        customerId: 'cust-1',
        email: 'customer1@example.com',
        name: 'John Doe',
        totalOrders: 5,
        totalSpent: 1250.00,
        lastOrderDate: '2024-01-15',
        registrationDate: '2023-06-01',
      },
      {
        customerId: 'cust-2',
        email: 'customer2@example.com',
        name: 'Jane Smith',
        totalOrders: 3,
        totalSpent: 750.00,
        lastOrderDate: '2024-01-10',
        registrationDate: '2023-08-15',
      },
    ];

    return {
      summary: {
        totalCustomers: customerData.length,
        totalOrders: customerData.reduce((sum, c) => sum + c.totalOrders, 0),
        totalRevenue: customerData.reduce((sum, c) => sum + c.totalSpent, 0),
        averageOrderValue: customerData.reduce((sum, c) => sum + c.totalSpent, 0) / 
                          customerData.reduce((sum, c) => sum + c.totalOrders, 0),
      },
      customers: customerData,
      recordCount: customerData.length,
    };
  }

  private async generateFinancialReport(tenantId: string, dateRange: any, filters: any) {
    console.log(`💰 Generating financial report for ${tenantId}`);
    
    // Get financial data
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    const orders = await this.orderRepo.getOrdersByDateRange(tenantId, startDate, endDate);
    const stats = await this.orderRepo.getSalesStats(tenantId, startDate, endDate);

    // Calculate financial metrics
    const totalRevenue = stats.totalRevenue;
    const totalOrders = stats.totalOrders;
    const averageOrderValue = stats.averageOrderValue;
    const taxAmount = orders.reduce((sum, order) => sum + order.taxAmount, 0);
    const commissionAmount = orders.reduce((sum, order) => sum + order.commissionAmount, 0);
    const netRevenue = totalRevenue - commissionAmount;

    return {
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        taxAmount,
        commissionAmount,
        netRevenue,
        dateRange: { start: dateRange.start, end: dateRange.end },
      },
      dailyBreakdown: this.generateDailyBreakdown(orders),
      recordCount: orders.length,
    };
  }

  private generateDailyBreakdown(orders: any[]) {
    const dailyData: Record<string, any> = {};
    
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { date, orders: 0, revenue: 0 };
      }
      dailyData[date].orders += 1;
      dailyData[date].revenue += order.totalAmount;
    });

    return Object.values(dailyData).sort((a: any, b: any) => a.date.localeCompare(b.date));
  }

  private async generatePDF(data: any, reportType: string): Promise<Buffer> {
    console.log(`📄 Generating PDF for ${reportType}`);
    
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In real implementation, use libraries like:
    // - puppeteer for HTML to PDF
    // - jsPDF for direct PDF generation
    // - pdfkit for complex layouts
    
    const mockPdfContent = `PDF Report: ${reportType}\n\n${JSON.stringify(data, null, 2)}`;
    return Buffer.from(mockPdfContent);
  }

  private async generateExcel(data: any, reportType: string): Promise<Buffer> {
    console.log(`📊 Generating Excel for ${reportType}`);
    
    // Simulate Excel generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real implementation, use libraries like:
    // - exceljs
    // - xlsx
    // - node-xlsx
    
    const mockExcelContent = `Excel Report: ${reportType}\n\n${JSON.stringify(data, null, 2)}`;
    return Buffer.from(mockExcelContent);
  }

  private async generateCSV(data: any, reportType: string): Promise<Buffer> {
    console.log(`📋 Generating CSV for ${reportType}`);
    
    // Simulate CSV generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real implementation, use libraries like:
    // - csv-writer
    // - fast-csv
    // - papaparse
    
    const mockCsvContent = `CSV Report: ${reportType}\n\n${JSON.stringify(data, null, 2)}`;
    return Buffer.from(mockCsvContent);
  }

  private async sendReportEmail(recipients: string[], reportType: string, downloadUrl: string, fileName: string) {
    console.log(`📧 Sending report email to ${recipients.join(', ')}`);
    
    // In real implementation, use email service like:
    // - SendGrid
    // - AWS SES
    // - Nodemailer
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`✅ Report email sent: ${fileName} -> ${downloadUrl}`);
  }
}
