/**
 * Promotion Creation Wizard Component
 * Step-by-step wizard for creating promotions and coupons
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Minus, Save, Eye, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PromotionWizardProps {
  onSave: (promotion: any) => void;
  onCancel: () => void;
}

interface PromotionFormData {
  // Basic Info
  name: string;
  description: string;
  code: string;
  type: string;
  
  // Discount Configuration
  discountType: string;
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  
  // Usage Limits
  usageLimit?: number;
  usagePerCustomer?: number;
  
  // Validity Period
  startDate: Date;
  endDate?: Date;
  
  // Priority and Stacking
  priority: number;
  stackable: boolean;
  stackableWith: string[];
  
  // Target Configuration
  targetType: string;
  targetIds: string[];
  
  // Display Configuration
  displayName: string;
  displayDescription: string;
  bannerImage?: string;
  iconImage?: string;
  
  // Eligibility Rules
  eligibilityRules: any;
  
  // Metadata
  tags: string[];
  metadata: any;
}

const PROMOTION_TYPES = [
  { value: 'PERCENTAGE', label: 'Percentage Discount', description: 'Discount as percentage of order amount' },
  { value: 'FIXED_AMOUNT', label: 'Fixed Amount Discount', description: 'Fixed amount discount' },
  { value: 'FREE_SHIPPING', label: 'Free Shipping', description: 'Free shipping on orders' },
  { value: 'BUY_X_GET_Y', label: 'Buy X Get Y', description: 'Buy X items, get Y free' },
  { value: 'BUNDLE_DISCOUNT', label: 'Bundle Discount', description: 'Discount on product bundles' },
  { value: 'CASHBACK', label: 'Cashback', description: 'Cashback on purchase' },
  { value: 'GIFT_CARD', label: 'Gift Card', description: 'Gift card reward' },
  { value: 'POINTS', label: 'Loyalty Points', description: 'Loyalty points reward' }
];

const DISCOUNT_TYPES = [
  { value: 'PERCENTAGE', label: 'Percentage' },
  { value: 'FIXED_AMOUNT', label: 'Fixed Amount' },
  { value: 'FREE_SHIPPING', label: 'Free Shipping' },
  { value: 'BUY_X_GET_Y', label: 'Buy X Get Y' },
  { value: 'BUNDLE_DISCOUNT', label: 'Bundle Discount' }
];

const TARGET_TYPES = [
  { value: 'ALL', label: 'All Customers/Products' },
  { value: 'CUSTOMER', label: 'Specific Customers' },
  { value: 'PRODUCT', label: 'Specific Products' },
  { value: 'CATEGORY', label: 'Product Categories' },
  { value: 'BRAND', label: 'Brands' },
  { value: 'SELLER', label: 'Sellers' },
  { value: 'CUSTOMER_SEGMENT', label: 'Customer Segments' }
];

const ELIGIBILITY_RULES = [
  {
    id: 'new-customer',
    name: 'New Customer',
    description: 'First-time buyers only',
    rule: {
      and: [
        { '!': { var: 'customerId' } },
        { '>': [{ var: 'orderAmount' }, 100] }
      ]
    }
  },
  {
    id: 'high-value-order',
    name: 'High Value Order',
    description: 'Orders above specified amount',
    rule: {
      '>': [{ var: 'orderAmount' }, 500]
    }
  },
  {
    id: 'weekend-promotion',
    name: 'Weekend Promotion',
    description: 'Valid on weekends only',
    rule: {
      in: [
        { var: 'orderDate.dayOfWeek' },
        [0, 6]
      ]
    }
  },
  {
    id: 'loyalty-customer',
    name: 'Loyalty Customer',
    description: 'VIP, Gold, or Platinum customers',
    rule: {
      in: [
        { var: 'customerSegment' },
        ['VIP', 'GOLD', 'PLATINUM']
      ]
    }
  }
];

export function PromotionWizard({ onSave, onCancel }: PromotionWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PromotionFormData>({
    name: '',
    description: '',
    code: '',
    type: 'PERCENTAGE',
    discountType: 'PERCENTAGE',
    discountValue: 0,
    priority: 1,
    stackable: false,
    stackableWith: [],
    targetType: 'ALL',
    targetIds: [],
    displayName: '',
    displayDescription: '',
    eligibilityRules: null,
    tags: [],
    metadata: {},
    startDate: new Date()
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  const totalSteps = 6;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Basic Info
        if (!formData.name.trim()) newErrors.name = 'Promotion name is required';
        if (!formData.type) newErrors.type = 'Promotion type is required';
        if (formData.discountValue <= 0) newErrors.discountValue = 'Discount value must be greater than 0';
        if (formData.discountType === 'PERCENTAGE' && formData.discountValue > 100) {
          newErrors.discountValue = 'Percentage discount cannot exceed 100%';
        }
        break;

      case 2: // Discount Configuration
        if (formData.discountType === 'PERCENTAGE' && formData.maxDiscountAmount && formData.maxDiscountAmount <= 0) {
          newErrors.maxDiscountAmount = 'Maximum discount amount must be greater than 0';
        }
        if (formData.minOrderAmount && formData.minOrderAmount < 0) {
          newErrors.minOrderAmount = 'Minimum order amount cannot be negative';
        }
        break;

      case 3: // Usage Limits
        if (formData.usageLimit && formData.usageLimit <= 0) {
          newErrors.usageLimit = 'Usage limit must be greater than 0';
        }
        if (formData.usagePerCustomer && formData.usagePerCustomer <= 0) {
          newErrors.usagePerCustomer = 'Usage per customer must be greater than 0';
        }
        break;

      case 4: // Validity Period
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (formData.endDate && formData.endDate <= formData.startDate) {
          newErrors.endDate = 'End date must be after start date';
        }
        break;

      case 5: // Target Configuration
        if (formData.targetType !== 'ALL' && formData.targetIds.length === 0) {
          newErrors.targetIds = 'Please select at least one target';
        }
        break;

      case 6: // Display Configuration
        if (!formData.displayName.trim()) newErrors.displayName = 'Display name is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSave = () => {
    if (validateStep(currentStep)) {
      onSave(formData);
    }
  };

  const generateCode = async () => {
    setIsGeneratingCode(true);
    try {
      // Simulate API call to generate code
      await new Promise(resolve => setTimeout(resolve, 1000));
      const code = `PROMO${Date.now().toString(36).toUpperCase()}`;
      setFormData(prev => ({ ...prev, code }));
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const addEligibilityRule = (rule: any) => {
    setFormData(prev => ({
      ...prev,
      eligibilityRules: rule.rule
    }));
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Promotion Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter promotion name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter promotion description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="type">Promotion Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select promotion type" />
                </SelectTrigger>
                <SelectContent>
                  {PROMOTION_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
            </div>

            <div>
              <Label htmlFor="discountType">Discount Type *</Label>
              <Select
                value={formData.discountType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, discountType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  {DISCOUNT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="discountValue">Discount Value *</Label>
              <Input
                id="discountValue"
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                placeholder="Enter discount value"
                className={errors.discountValue ? 'border-red-500' : ''}
              />
              {errors.discountValue && <p className="text-sm text-red-500">{errors.discountValue}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="maxDiscountAmount">Maximum Discount Amount</Label>
              <Input
                id="maxDiscountAmount"
                type="number"
                value={formData.maxDiscountAmount || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  maxDiscountAmount: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
                placeholder="Enter maximum discount amount"
                className={errors.maxDiscountAmount ? 'border-red-500' : ''}
              />
              {errors.maxDiscountAmount && <p className="text-sm text-red-500">{errors.maxDiscountAmount}</p>}
            </div>

            <div>
              <Label htmlFor="minOrderAmount">Minimum Order Amount</Label>
              <Input
                id="minOrderAmount"
                type="number"
                value={formData.minOrderAmount || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  minOrderAmount: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
                placeholder="Enter minimum order amount"
                className={errors.minOrderAmount ? 'border-red-500' : ''}
              />
              {errors.minOrderAmount && <p className="text-sm text-red-500">{errors.minOrderAmount}</p>}
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                placeholder="Enter priority (higher number = higher priority)"
                min="1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="stackable"
                checked={formData.stackable}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, stackable: checked }))}
              />
              <Label htmlFor="stackable">Stackable with other promotions</Label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="usageLimit">Total Usage Limit</Label>
              <Input
                id="usageLimit"
                type="number"
                value={formData.usageLimit || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  usageLimit: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                placeholder="Enter total usage limit"
                className={errors.usageLimit ? 'border-red-500' : ''}
              />
              {errors.usageLimit && <p className="text-sm text-red-500">{errors.usageLimit}</p>}
            </div>

            <div>
              <Label htmlFor="usagePerCustomer">Usage Per Customer</Label>
              <Input
                id="usagePerCustomer"
                type="number"
                value={formData.usagePerCustomer || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  usagePerCustomer: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                placeholder="Enter usage limit per customer"
                className={errors.usagePerCustomer ? 'border-red-500' : ''}
              />
              {errors.usagePerCustomer && <p className="text-sm text-red-500">{errors.usagePerCustomer}</p>}
            </div>

            <div>
              <Label htmlFor="code">Promotion Code</Label>
              <div className="flex space-x-2">
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="Enter promotion code or generate one"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateCode}
                  disabled={isGeneratingCode}
                >
                  {isGeneratingCode ? 'Generating...' : 'Generate'}
                </Button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground",
                      errors.startDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date || new Date() }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
            </div>

            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground",
                      errors.endDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date (optional)</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="targetType">Target Type</Label>
              <Select
                value={formData.targetType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, targetType: value, targetIds: [] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target type" />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.targetType !== 'ALL' && (
              <div>
                <Label>Target Selection</Label>
                <div className="mt-2 p-4 border rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">
                    Select targets for {formData.targetType.toLowerCase()}:
                  </p>
                  <div className="space-y-2">
                    {/* This would be populated with actual targets from API */}
                    <div className="text-sm text-gray-400">
                      Target selection interface would be implemented here
                    </div>
                  </div>
                </div>
                {errors.targetIds && <p className="text-sm text-red-500">{errors.targetIds}</p>}
              </div>
            )}

            <div>
              <Label>Eligibility Rules</Label>
              <div className="mt-2 space-y-2">
                {ELIGIBILITY_RULES.map(rule => (
                  <div
                    key={rule.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => addEligibilityRule(rule)}
                  >
                    <div className="font-medium">{rule.name}</div>
                    <div className="text-sm text-gray-500">{rule.description}</div>
                  </div>
                ))}
              </div>
              {formData.eligibilityRules && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-700">Eligibility rule applied</p>
                </div>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="Enter display name for customers"
                className={errors.displayName ? 'border-red-500' : ''}
              />
              {errors.displayName && <p className="text-sm text-red-500">{errors.displayName}</p>}
            </div>

            <div>
              <Label htmlFor="displayDescription">Display Description</Label>
              <Textarea
                id="displayDescription"
                value={formData.displayDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, displayDescription: e.target.value }))}
                placeholder="Enter description for customers"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="bannerImage">Banner Image URL</Label>
              <Input
                id="bannerImage"
                value={formData.bannerImage || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bannerImage: e.target.value }))}
                placeholder="Enter banner image URL"
              />
            </div>

            <div>
              <Label htmlFor="iconImage">Icon Image URL</Label>
              <Input
                id="iconImage"
                value={formData.iconImage || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, iconImage: e.target.value }))}
                placeholder="Enter icon image URL"
              />
            </div>

            <div>
              <Label>Tags</Label>
              <div className="mt-2 space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTag(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button type="button" onClick={() => {
                    const input = document.querySelector('input[placeholder="Enter tag"]') as HTMLInputElement;
                    if (input) {
                      addTag(input.value);
                      input.value = '';
                    }
                  }}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Create Promotion - Step {currentStep} of {totalSteps}</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(JSON.stringify(formData, null, 2))}>
                <Copy className="h-4 w-4 mr-2" />
                Copy JSON
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>Progress</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              
              {currentStep === totalSteps ? (
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Create Promotion
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

