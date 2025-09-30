export const webhookSchemas = {
  WebhookSubscription: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Unique subscription identifier' },
      tenantId: { type: 'string', description: 'Tenant identifier' },
      name: { type: 'string', description: 'Subscription name' },
      description: { type: 'string', description: 'Subscription description' },
      url: { type: 'string', format: 'uri', description: 'Target webhook URL' },
      events: { 
        type: 'array', 
        items: { type: 'string' },
        description: 'Array of event types to subscribe to'
      },
      verifySsl: { type: 'boolean', description: 'Whether to verify SSL certificates' },
      includeHeaders: { type: 'boolean', description: 'Whether to include custom headers' },
      customHeaders: { 
        type: 'object', 
        additionalProperties: { type: 'string' },
        description: 'Custom headers to include in webhook requests'
      },
      maxRetries: { type: 'integer', minimum: 0, maximum: 10, description: 'Maximum retry attempts' },
      retryDelay: { type: 'integer', minimum: 100, maximum: 60000, description: 'Initial retry delay in milliseconds' },
      retryBackoff: { type: 'number', minimum: 1, maximum: 5, description: 'Exponential backoff multiplier' },
      timeout: { type: 'integer', minimum: 1000, maximum: 300000, description: 'Request timeout in milliseconds' },
      isActive: { type: 'boolean', description: 'Whether the subscription is active' },
      isHealthy: { type: 'boolean', description: 'Whether the subscription is healthy' },
      lastDeliveryAt: { type: 'string', format: 'date-time', nullable: true, description: 'Last delivery timestamp' },
      lastSuccessAt: { type: 'string', format: 'date-time', nullable: true, description: 'Last successful delivery timestamp' },
      lastFailureAt: { type: 'string', format: 'date-time', nullable: true, description: 'Last failed delivery timestamp' },
      consecutiveFailures: { type: 'integer', description: 'Number of consecutive failures' },
      totalDeliveries: { type: 'integer', description: 'Total number of deliveries' },
      successfulDeliveries: { type: 'integer', description: 'Number of successful deliveries' },
      failedDeliveries: { type: 'integer', description: 'Number of failed deliveries' },
      metadata: { type: 'object', additionalProperties: true, description: 'Additional metadata' },
      createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
      updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
    },
    required: ['id', 'tenantId', 'name', 'url', 'events', 'verifySsl', 'includeHeaders', 'maxRetries', 'retryDelay', 'retryBackoff', 'timeout', 'isActive', 'isHealthy', 'consecutiveFailures', 'totalDeliveries', 'successfulDeliveries', 'failedDeliveries', 'createdAt', 'updatedAt']
  },

  WebhookDelivery: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Unique delivery identifier' },
      subscriptionId: { type: 'string', description: 'Associated subscription ID' },
      tenantId: { type: 'string', description: 'Tenant identifier' },
      eventType: { type: 'string', description: 'Event type that triggered the webhook' },
      eventId: { type: 'string', description: 'Unique event identifier' },
      payload: { type: 'object', additionalProperties: true, description: 'Event payload' },
      headers: { 
        type: 'object', 
        additionalProperties: { type: 'string' },
        nullable: true,
        description: 'Request headers'
      },
      status: { 
        type: 'string', 
        enum: ['PENDING', 'SENDING', 'DELIVERED', 'FAILED', 'RETRYING', 'CANCELLED', 'EXPIRED'],
        description: 'Delivery status'
      },
      httpStatus: { type: 'integer', nullable: true, description: 'HTTP response status' },
      responseBody: { type: 'string', nullable: true, description: 'Response body' },
      responseHeaders: { 
        type: 'object', 
        additionalProperties: { type: 'string' },
        nullable: true,
        description: 'Response headers'
      },
      attemptCount: { type: 'integer', description: 'Number of delivery attempts' },
      maxRetries: { type: 'integer', description: 'Maximum retry attempts' },
      nextRetryAt: { type: 'string', format: 'date-time', nullable: true, description: 'Next retry timestamp' },
      startedAt: { type: 'string', format: 'date-time', nullable: true, description: 'Delivery start timestamp' },
      completedAt: { type: 'string', format: 'date-time', nullable: true, description: 'Delivery completion timestamp' },
      duration: { type: 'integer', nullable: true, description: 'Delivery duration in milliseconds' },
      errorMessage: { type: 'string', nullable: true, description: 'Error message' },
      errorCode: { type: 'string', nullable: true, description: 'Error code' },
      errorDetails: { type: 'object', additionalProperties: true, nullable: true, description: 'Error details' },
      signature: { type: 'string', nullable: true, description: 'HMAC signature' },
      signatureMethod: { type: 'string', nullable: true, description: 'Signature method' },
      metadata: { type: 'object', additionalProperties: true, nullable: true, description: 'Additional metadata' },
      createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
      updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
    },
    required: ['id', 'subscriptionId', 'tenantId', 'eventType', 'eventId', 'payload', 'status', 'attemptCount', 'maxRetries', 'createdAt', 'updatedAt']
  },

  WebhookEvent: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Unique event identifier' },
      tenantId: { type: 'string', description: 'Tenant identifier' },
      eventType: { type: 'string', description: 'Event type' },
      eventVersion: { type: 'string', description: 'Event version' },
      source: { type: 'string', description: 'Source system/component' },
      data: { type: 'object', additionalProperties: true, description: 'Event payload' },
      metadata: { type: 'object', additionalProperties: true, nullable: true, description: 'Additional metadata' },
      status: { 
        type: 'string', 
        enum: ['PENDING', 'PROCESSING', 'PROCESSED', 'FAILED', 'CANCELLED'],
        description: 'Event processing status'
      },
      processedAt: { type: 'string', format: 'date-time', nullable: true, description: 'Processing completion timestamp' },
      errorMessage: { type: 'string', nullable: true, description: 'Error message' },
      createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
      updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' }
    },
    required: ['id', 'tenantId', 'eventType', 'eventVersion', 'source', 'data', 'status', 'createdAt', 'updatedAt']
  },

  WebhookStats: {
    type: 'object',
    properties: {
      totalSubscriptions: { type: 'integer', description: 'Total number of subscriptions' },
      activeSubscriptions: { type: 'integer', description: 'Number of active subscriptions' },
      healthySubscriptions: { type: 'integer', description: 'Number of healthy subscriptions' },
      totalDeliveries: { type: 'integer', description: 'Total number of deliveries' },
      successfulDeliveries: { type: 'integer', description: 'Number of successful deliveries' },
      failedDeliveries: { type: 'integer', description: 'Number of failed deliveries' },
      pendingDeliveries: { type: 'integer', description: 'Number of pending deliveries' },
      averageDeliveryTime: { type: 'number', description: 'Average delivery time in milliseconds' },
      successRate: { type: 'number', description: 'Success rate percentage' },
      eventsByType: { 
        type: 'object', 
        additionalProperties: { type: 'integer' },
        description: 'Event counts by type'
      },
      deliveriesByStatus: { 
        type: 'object', 
        additionalProperties: { type: 'integer' },
        description: 'Delivery counts by status'
      }
    },
    required: ['totalSubscriptions', 'activeSubscriptions', 'healthySubscriptions', 'totalDeliveries', 'successfulDeliveries', 'failedDeliveries', 'pendingDeliveries', 'averageDeliveryTime', 'successRate', 'eventsByType', 'deliveriesByStatus']
  },

  HmacSignature: {
    type: 'object',
    properties: {
      signature: { type: 'string', description: 'HMAC signature' },
      method: { type: 'string', description: 'Signature method (e.g., sha256)' },
      timestamp: { type: 'integer', description: 'Unix timestamp' },
      nonce: { type: 'string', description: 'Random nonce' }
    },
    required: ['signature', 'method', 'timestamp', 'nonce']
  },

  WebhookDeliveryResult: {
    type: 'object',
    properties: {
      success: { type: 'boolean', description: 'Whether the delivery was successful' },
      httpStatus: { type: 'integer', description: 'HTTP response status' },
      responseBody: { type: 'string', description: 'Response body' },
      responseHeaders: { 
        type: 'object', 
        additionalProperties: { type: 'string' },
        description: 'Response headers'
      },
      duration: { type: 'integer', description: 'Delivery duration in milliseconds' },
      errorMessage: { type: 'string', description: 'Error message if failed' },
      errorCode: { type: 'string', description: 'Error code if failed' },
      shouldRetry: { type: 'boolean', description: 'Whether the delivery should be retried' },
      retryAfter: { type: 'integer', description: 'Retry delay in milliseconds' }
    },
    required: ['success', 'duration', 'shouldRetry']
  },

  CreateWebhookSubscriptionRequest: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 100, description: 'Subscription name' },
      description: { type: 'string', description: 'Subscription description' },
      url: { type: 'string', format: 'uri', description: 'Target webhook URL' },
      secret: { type: 'string', minLength: 16, description: 'HMAC secret for signature verification' },
      events: { 
        type: 'array', 
        items: { type: 'string' },
        description: 'Array of event types to subscribe to'
      },
      verifySsl: { type: 'boolean', default: true, description: 'Whether to verify SSL certificates' },
      includeHeaders: { type: 'boolean', default: true, description: 'Whether to include custom headers' },
      customHeaders: { 
        type: 'object', 
        additionalProperties: { type: 'string' },
        description: 'Custom headers to include in webhook requests'
      },
      maxRetries: { type: 'integer', minimum: 0, maximum: 10, default: 3, description: 'Maximum retry attempts' },
      retryDelay: { type: 'integer', minimum: 100, maximum: 60000, default: 1000, description: 'Initial retry delay in milliseconds' },
      retryBackoff: { type: 'number', minimum: 1, maximum: 5, default: 2.0, description: 'Exponential backoff multiplier' },
      timeout: { type: 'integer', minimum: 1000, maximum: 300000, default: 30000, description: 'Request timeout in milliseconds' },
      metadata: { type: 'object', additionalProperties: true, description: 'Additional metadata' }
    },
    required: ['name', 'url', 'secret', 'events']
  },

  UpdateWebhookSubscriptionRequest: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 100, description: 'Subscription name' },
      description: { type: 'string', description: 'Subscription description' },
      url: { type: 'string', format: 'uri', description: 'Target webhook URL' },
      secret: { type: 'string', minLength: 16, description: 'HMAC secret for signature verification' },
      events: { 
        type: 'array', 
        items: { type: 'string' },
        description: 'Array of event types to subscribe to'
      },
      verifySsl: { type: 'boolean', description: 'Whether to verify SSL certificates' },
      includeHeaders: { type: 'boolean', description: 'Whether to include custom headers' },
      customHeaders: { 
        type: 'object', 
        additionalProperties: { type: 'string' },
        description: 'Custom headers to include in webhook requests'
      },
      maxRetries: { type: 'integer', minimum: 0, maximum: 10, description: 'Maximum retry attempts' },
      retryDelay: { type: 'integer', minimum: 100, maximum: 60000, description: 'Initial retry delay in milliseconds' },
      retryBackoff: { type: 'number', minimum: 1, maximum: 5, description: 'Exponential backoff multiplier' },
      timeout: { type: 'integer', minimum: 1000, maximum: 300000, description: 'Request timeout in milliseconds' },
      isActive: { type: 'boolean', description: 'Whether the subscription is active' },
      metadata: { type: 'object', additionalProperties: true, description: 'Additional metadata' }
    }
  },

  CreateWebhookEventRequest: {
    type: 'object',
    properties: {
      eventType: { type: 'string', description: 'Event type' },
      eventVersion: { type: 'string', default: '1.0', description: 'Event version' },
      source: { type: 'string', description: 'Source system/component' },
      data: { type: 'object', additionalProperties: true, description: 'Event payload' },
      metadata: { type: 'object', additionalProperties: true, description: 'Additional metadata' }
    },
    required: ['eventType', 'source', 'data']
  },

  WebhookFilters: {
    type: 'object',
    properties: {
      isActive: { type: 'boolean', description: 'Filter by active status' },
      isHealthy: { type: 'boolean', description: 'Filter by healthy status' },
      events: { 
        type: 'array', 
        items: { type: 'string' },
        description: 'Filter by event types'
      },
      status: { type: 'string', description: 'Filter by status' },
      eventType: { type: 'string', description: 'Filter by event type' },
      subscriptionId: { type: 'string', description: 'Filter by subscription ID' },
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 50, description: 'Number of results to return' },
      offset: { type: 'integer', minimum: 0, default: 0, description: 'Number of results to skip' }
    }
  },

  GenerateSignatureRequest: {
    type: 'object',
    properties: {
      payload: { type: 'string', description: 'Payload to sign' },
      secret: { type: 'string', description: 'Secret key for signing' },
      method: { type: 'string', default: 'sha256', description: 'Signature method' }
    },
    required: ['payload', 'secret']
  },

  VerifySignatureRequest: {
    type: 'object',
    properties: {
      payload: { type: 'string', description: 'Payload to verify' },
      signature: { type: 'string', description: 'Signature to verify' },
      secret: { type: 'string', description: 'Secret key for verification' },
      method: { type: 'string', default: 'sha256', description: 'Signature method' }
    },
    required: ['payload', 'signature', 'secret']
  },

  ApiResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', description: 'Whether the request was successful' },
      data: { type: 'object', description: 'Response data' },
      error: { type: 'string', description: 'Error message if unsuccessful' },
      message: { type: 'string', description: 'Success message' }
    },
    required: ['success']
  }
};

export const webhookPaths = {
  '/api/webhooks/subscriptions': {
    post: {
      tags: ['Webhook Subscriptions'],
      summary: 'Create webhook subscription',
      description: 'Create a new webhook subscription for receiving events',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateWebhookSubscriptionRequest' }
          }
        }
      },
      responses: {
        '201': {
          description: 'Subscription created successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/WebhookSubscription' }
                    }
                  }
                ]
              }
            }
          }
        },
        '400': {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' }
            }
          }
        }
      }
    },
    get: {
      tags: ['Webhook Subscriptions'],
      summary: 'Get webhook subscriptions',
      description: 'Get all webhook subscriptions with optional filtering',
      parameters: [
        { $ref: '#/components/parameters/WebhookFilters' }
      ],
      responses: {
        '200': {
          description: 'Subscriptions retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/WebhookSubscription' }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  '/api/webhooks/subscriptions/{id}': {
    get: {
      tags: ['Webhook Subscriptions'],
      summary: 'Get webhook subscription by ID',
      description: 'Get a specific webhook subscription by its ID',
      parameters: [
        { $ref: '#/components/parameters/SubscriptionId' }
      ],
      responses: {
        '200': {
          description: 'Subscription retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/WebhookSubscription' }
                    }
                  }
                ]
              }
            }
          }
        },
        '404': {
          description: 'Subscription not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' }
            }
          }
        }
      }
    },
    put: {
      tags: ['Webhook Subscriptions'],
      summary: 'Update webhook subscription',
      description: 'Update an existing webhook subscription',
      parameters: [
        { $ref: '#/components/parameters/SubscriptionId' }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateWebhookSubscriptionRequest' }
          }
        }
      },
      responses: {
        '200': {
          description: 'Subscription updated successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/WebhookSubscription' }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    },
    delete: {
      tags: ['Webhook Subscriptions'],
      summary: 'Delete webhook subscription',
      description: 'Delete a webhook subscription',
      parameters: [
        { $ref: '#/components/parameters/SubscriptionId' }
      ],
      responses: {
        '200': {
          description: 'Subscription deleted successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' }
            }
          }
        },
        '404': {
          description: 'Subscription not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' }
            }
          }
        }
      }
    }
  },
  '/api/webhooks/subscriptions/{id}/test': {
    post: {
      tags: ['Webhook Subscriptions'],
      summary: 'Test webhook subscription',
      description: 'Send a test webhook to verify the subscription configuration',
      parameters: [
        { $ref: '#/components/parameters/SubscriptionId' }
      ],
      responses: {
        '200': {
          description: 'Test webhook sent successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/WebhookDeliveryResult' }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  '/api/webhooks/events': {
    post: {
      tags: ['Webhook Events'],
      summary: 'Create webhook event',
      description: 'Create a new webhook event to be processed and delivered',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateWebhookEventRequest' }
          }
        }
      },
      responses: {
        '201': {
          description: 'Event created successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/WebhookEvent' }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    },
    get: {
      tags: ['Webhook Events'],
      summary: 'Get webhook events',
      description: 'Get all webhook events with optional filtering',
      parameters: [
        { $ref: '#/components/parameters/WebhookFilters' }
      ],
      responses: {
        '200': {
          description: 'Events retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/WebhookEvent' }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  '/api/webhooks/events/{id}': {
    get: {
      tags: ['Webhook Events'],
      summary: 'Get webhook event by ID',
      description: 'Get a specific webhook event by its ID',
      parameters: [
        { $ref: '#/components/parameters/EventId' }
      ],
      responses: {
        '200': {
          description: 'Event retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/WebhookEvent' }
                    }
                  }
                ]
              }
            }
          }
        },
        '404': {
          description: 'Event not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' }
            }
          }
        }
      }
    }
  },
  '/api/webhooks/events/{id}/process': {
    post: {
      tags: ['Webhook Events'],
      summary: 'Process webhook event',
      description: 'Process a webhook event and create deliveries for matching subscriptions',
      parameters: [
        { $ref: '#/components/parameters/EventId' }
      ],
      responses: {
        '200': {
          description: 'Event processed successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' }
            }
          }
        }
      }
    }
  },
  '/api/webhooks/deliveries': {
    get: {
      tags: ['Webhook Deliveries'],
      summary: 'Get webhook deliveries',
      description: 'Get all webhook deliveries with optional filtering',
      parameters: [
        { $ref: '#/components/parameters/WebhookFilters' }
      ],
      responses: {
        '200': {
          description: 'Deliveries retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/WebhookDelivery' }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  '/api/webhooks/deliveries/{id}': {
    get: {
      tags: ['Webhook Deliveries'],
      summary: 'Get webhook delivery by ID',
      description: 'Get a specific webhook delivery by its ID',
      parameters: [
        { $ref: '#/components/parameters/DeliveryId' }
      ],
      responses: {
        '200': {
          description: 'Delivery retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/WebhookDelivery' }
                    }
                  }
                ]
              }
            }
          }
        },
        '404': {
          description: 'Delivery not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' }
            }
          }
        }
      }
    }
  },
  '/api/webhooks/deliveries/{id}/retry': {
    post: {
      tags: ['Webhook Deliveries'],
      summary: 'Retry webhook delivery',
      description: 'Retry a failed webhook delivery',
      parameters: [
        { $ref: '#/components/parameters/DeliveryId' }
      ],
      responses: {
        '200': {
          description: 'Delivery retry initiated successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/WebhookDeliveryResult' }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  '/api/webhooks/deliveries/{id}/cancel': {
    post: {
      tags: ['Webhook Deliveries'],
      summary: 'Cancel webhook delivery',
      description: 'Cancel a pending webhook delivery',
      parameters: [
        { $ref: '#/components/parameters/DeliveryId' }
      ],
      responses: {
        '200': {
          description: 'Delivery cancelled successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' }
            }
          }
        },
        '404': {
          description: 'Delivery not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' }
            }
          }
        }
      }
    }
  },
  '/api/webhooks/stats': {
    get: {
      tags: ['Webhook Statistics'],
      summary: 'Get webhook statistics',
      description: 'Get webhook statistics and metrics',
      responses: {
        '200': {
          description: 'Statistics retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/WebhookStats' }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  '/api/webhooks/health': {
    get: {
      tags: ['Webhook Health'],
      summary: 'Get webhook health status',
      description: 'Get webhook system health status',
      responses: {
        '200': {
          description: 'Health status retrieved successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          status: { type: 'string', enum: ['healthy', 'unhealthy'] },
                          timestamp: { type: 'string', format: 'date-time' },
                          stats: {
                            type: 'object',
                            properties: {
                              totalSubscriptions: { type: 'integer' },
                              activeSubscriptions: { type: 'integer' },
                              healthySubscriptions: { type: 'integer' },
                              successRate: { type: 'number' }
                            }
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  '/api/webhooks/signature/generate': {
    post: {
      tags: ['Webhook Security'],
      summary: 'Generate HMAC signature',
      description: 'Generate HMAC signature for webhook payload',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/GenerateSignatureRequest' }
          }
        }
      },
      responses: {
        '200': {
          description: 'Signature generated successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: { $ref: '#/components/schemas/HmacSignature' }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  '/api/webhooks/signature/verify': {
    post: {
      tags: ['Webhook Security'],
      summary: 'Verify HMAC signature',
      description: 'Verify HMAC signature for webhook payload',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/VerifySignatureRequest' }
          }
        }
      },
      responses: {
        '200': {
          description: 'Signature verification completed',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ApiResponse' },
                  {
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          valid: { type: 'boolean' }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },
  '/api/webhooks/process-pending': {
    post: {
      tags: ['Webhook Processing'],
      summary: 'Process pending deliveries',
      description: 'Process all pending webhook deliveries',
      responses: {
        '200': {
          description: 'Pending deliveries processed successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' }
            }
          }
        }
      }
    }
  }
};

export const webhookParameters = {
  SubscriptionId: {
    name: 'id',
    in: 'path',
    required: true,
    schema: { type: 'string' },
    description: 'Webhook subscription ID'
  },
  EventId: {
    name: 'id',
    in: 'path',
    required: true,
    schema: { type: 'string' },
    description: 'Webhook event ID'
  },
  DeliveryId: {
    name: 'id',
    in: 'path',
    required: true,
    schema: { type: 'string' },
    description: 'Webhook delivery ID'
  },
  WebhookFilters: {
    name: 'filters',
    in: 'query',
    required: false,
    schema: { $ref: '#/components/schemas/WebhookFilters' },
    description: 'Filter parameters for webhook queries'
  }
};

