import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/slugify'
import { z } from 'zod'

const createCategorySchema = z.object({
  name: z.string().min(2, 'Kategori adı en az 2 karakter olmalı'),
  enabled: z.boolean().optional().default(true),
})

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Kategoriler getirilemedi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const result = createCategorySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, enabled } = result.data
    let slug = slugify(name)

    // Unique slug kontrolü
    let counter = 1
    let originalSlug = slug
    
    while (true) {
      const existing = await prisma.category.findUnique({
        where: { slug }
      })
      
      if (!existing) break
      
      slug = `${originalSlug}-${counter}`
      counter++
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        enabled,
      },
    })

    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: 'Kategori oluşturulamadı' },
      { status: 500 }
    )
  }
}
