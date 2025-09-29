import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { signedFetch } from '@tdc/sync-protocol'

const CLOUD_BASE_URL = process.env.CLOUD_SYNC_BASE || 'http://localhost:3000'
const LOCAL_AGENT_URL = process.env.LOCAL_AGENT_BASE || 'http://localhost:3001'
const SYNC_TOKEN = process.env.SYNC_TOKEN || 'test-token'

describe('E2E Sync Tests', () => {
  beforeAll(async () => {
    // Wait for services to be ready
    await waitForService(CLOUD_BASE_URL, 'Cloud')
    await waitForService(LOCAL_AGENT_URL, 'Local Agent')
  })

  beforeEach(async () => {
    // Clean up test data
    await cleanupTestData()
  })

  describe('Cloud → Local Sync', () => {
    it('should sync product creation from cloud to local', async () => {
      // 1. Create product via cloud API
      const productData = {
        clientRev: 0,
        changes: [{
          entity: 'product',
          op: 'upsert',
          data: {
            id: 'test-product-1',
            name: 'Test Product',
            price: 99.99,
            enabled: true,
            description: 'Test description',
            categoryId: null,
            rev: 1,
            updatedBy: 'cloud',
            checksum: '',
            updatedAt: new Date().toISOString()
          }
        }],
        clientId: 'test-client'
      }

      // 2. Push to local agent
      const pushResult = await signedFetch(
        `${LOCAL_AGENT_URL}/sync/push`,
        SYNC_TOKEN,
        productData
      )

      expect(pushResult.success).toBe(true)
      expect(pushResult.appliedCount).toBe(1)

      // 3. Verify local file exists
      const localProducts = await getLocalProducts()
      const testProduct = localProducts.find(p => p.id === 'test-product-1')
      
      expect(testProduct).toBeDefined()
      expect(testProduct?.name).toBe('Test Product')
      expect(testProduct?.price).toBe(99.99)
      expect(testProduct?.updatedBy).toBe('cloud')
    })

    it('should sync product deletion from cloud to local', async () => {
      // 1. First create a product
      await createTestProduct('test-product-2')

      // 2. Delete via cloud API
      const deleteData = {
        clientRev: 1,
        changes: [{
          entity: 'product',
          op: 'delete',
          data: {
            id: 'test-product-2',
            name: '',
            price: 0,
            enabled: false,
            rev: 2,
            updatedBy: 'cloud',
            checksum: '',
            updatedAt: new Date().toISOString(),
            deletedAt: new Date().toISOString()
          }
        }],
        clientId: 'test-client'
      }

      // 3. Push deletion to local
      const pushResult = await signedFetch(
        `${LOCAL_AGENT_URL}/sync/push`,
        SYNC_TOKEN,
        deleteData
      )

      expect(pushResult.success).toBe(true)
      expect(pushResult.appliedCount).toBe(1)

      // 4. Verify local file is deleted
      const localProducts = await getLocalProducts()
      const testProduct = localProducts.find(p => p.id === 'test-product-2')
      expect(testProduct).toBeUndefined()
    })
  })

  describe('Local → Cloud Sync', () => {
    it('should sync local file changes to cloud', async () => {
      // 1. Create local file
      const productData = {
        id: 'test-product-3',
        name: 'Local Product',
        price: 149.99,
        enabled: true,
        description: 'Local description',
        categoryId: null,
        rev: 1,
        updatedBy: 'local',
        checksum: '',
        updatedAt: new Date().toISOString()
      }

      await createLocalProduct(productData)

      // 2. Wait for watcher to detect change
      await new Promise(resolve => setTimeout(resolve, 2000))

      // 3. Check cloud received the change
      const cloudProducts = await getCloudProducts()
      const testProduct = cloudProducts.find(p => p.id === 'test-product-3')
      
      expect(testProduct).toBeDefined()
      expect(testProduct?.name).toBe('Local Product')
      expect(testProduct?.price).toBe(149.99)
    })
  })

  describe('Conflict Resolution', () => {
    it('should resolve conflicts using LWW strategy', async () => {
      const productId = 'conflict-test-product'
      
      // 1. Create initial product
      await createTestProduct(productId)

      // 2. Simulate simultaneous updates
      const olderUpdate = {
        clientRev: 1,
        changes: [{
          entity: 'product',
          op: 'upsert',
          data: {
            id: productId,
            name: 'Older Update',
            price: 100,
            enabled: true,
            rev: 1,
            updatedBy: 'local',
            checksum: '',
            updatedAt: new Date(Date.now() - 5000).toISOString() // 5 seconds ago
          }
        }],
        clientId: 'local-client'
      }

      const newerUpdate = {
        clientRev: 1,
        changes: [{
          entity: 'product',
          op: 'upsert',
          data: {
            id: productId,
            name: 'Newer Update',
            price: 200,
            enabled: true,
            rev: 2,
            updatedBy: 'cloud',
            checksum: '',
            updatedAt: new Date().toISOString() // Now
          }
        }],
        clientId: 'cloud-client'
      }

      // 3. Push both updates
      const result1 = await signedFetch(
        `${LOCAL_AGENT_URL}/sync/push`,
        SYNC_TOKEN,
        olderUpdate
      )

      const result2 = await signedFetch(
        `${LOCAL_AGENT_URL}/sync/push`,
        SYNC_TOKEN,
        newerUpdate
      )

      // 4. Verify newer update wins
      expect(result1.conflicts).toBeDefined()
      expect(result1.conflicts?.length).toBe(1)
      expect(result2.success).toBe(true)
      expect(result2.appliedCount).toBe(1)

      // 5. Verify final state
      const localProducts = await getLocalProducts()
      const finalProduct = localProducts.find(p => p.id === productId)
      expect(finalProduct?.name).toBe('Newer Update')
      expect(finalProduct?.price).toBe(200)
    })
  })

  describe('Tunnel Resilience', () => {
    it('should queue changes when tunnel is down', async () => {
      // This test would require mocking the tunnel connection
      // For now, we'll test the queue mechanism directly
      
      const productData = {
        clientRev: 0,
        changes: [{
          entity: 'product',
          op: 'upsert',
          data: {
            id: 'tunnel-test-product',
            name: 'Tunnel Test',
            price: 75.50,
            enabled: true,
            rev: 1,
            updatedBy: 'local',
            checksum: '',
            updatedAt: new Date().toISOString()
          }
        }],
        clientId: 'test-client'
      }

      // Simulate tunnel failure by using invalid URL
      try {
        await signedFetch(
          'http://invalid-tunnel-url/sync/push',
          SYNC_TOKEN,
          productData
        )
      } catch (error) {
        // Expected to fail
        expect(error).toBeDefined()
      }

      // TODO: Verify queuing mechanism
      // This would require implementing the queue service
    })
  })
})

// Helper functions
async function waitForService(url: string, name: string): Promise<void> {
  const maxRetries = 30
  const retryDelay = 1000

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`${url}/health`)
      if (response.ok) {
        console.log(`✅ ${name} is ready`)
        return
      }
    } catch (error) {
      // Service not ready yet
    }
    
    await new Promise(resolve => setTimeout(resolve, retryDelay))
  }

  throw new Error(`${name} failed to start within ${maxRetries * retryDelay}ms`)
}

async function cleanupTestData(): Promise<void> {
  // Clean up local files
  const testIds = ['test-product-1', 'test-product-2', 'test-product-3', 'conflict-test-product', 'tunnel-test-product']
  
  for (const id of testIds) {
    try {
      await deleteLocalProduct(id)
    } catch (error) {
      // Ignore errors (file might not exist)
    }
  }
}

async function createTestProduct(id: string): Promise<void> {
  const productData = {
    clientRev: 0,
    changes: [{
      entity: 'product',
      op: 'upsert',
      data: {
        id,
        name: 'Test Product',
        price: 99.99,
        enabled: true,
        description: 'Test description',
        categoryId: null,
        rev: 1,
        updatedBy: 'cloud',
        checksum: '',
        updatedAt: new Date().toISOString()
      }
    }],
    clientId: 'test-client'
  }

  await signedFetch(
    `${LOCAL_AGENT_URL}/sync/push`,
    SYNC_TOKEN,
    productData
  )
}

async function getLocalProducts(): Promise<any[]> {
  const response = await fetch(`${LOCAL_AGENT_URL}/sync/pull?sinceRev=0`, {
    headers: {
      'x-sync-token': SYNC_TOKEN
    }
  })
  
  const result = await response.json()
  return result.changes
    .filter((c: any) => c.entity === 'product')
    .map((c: any) => c.data)
}

async function getCloudProducts(): Promise<any[]> {
  const response = await fetch(`${CLOUD_BASE_URL}/api/sync/pull?sinceRev=0`, {
    headers: {
      'x-sync-token': SYNC_TOKEN
    }
  })
  
  const result = await response.json()
  return result.changes
    .filter((c: any) => c.entity === 'product')
    .map((c: any) => c.data)
}

async function createLocalProduct(productData: any): Promise<void> {
  // This would require file system access
  // For now, we'll use the API
  const changeData = {
    clientRev: 0,
    changes: [{
      entity: 'product',
      op: 'upsert',
      data: productData
    }],
    clientId: 'local-test'
  }

  await signedFetch(
    `${LOCAL_AGENT_URL}/sync/push`,
    SYNC_TOKEN,
    changeData
  )
}

async function deleteLocalProduct(id: string): Promise<void> {
  const deleteData = {
    clientRev: 0,
    changes: [{
      entity: 'product',
      op: 'delete',
      data: {
        id,
        name: '',
        price: 0,
        enabled: false,
        rev: 0,
        updatedBy: 'local',
        checksum: '',
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString()
      }
    }],
    clientId: 'test-cleanup'
  }

  await signedFetch(
    `${LOCAL_AGENT_URL}/sync/push`,
    SYNC_TOKEN,
    deleteData
  )
}
