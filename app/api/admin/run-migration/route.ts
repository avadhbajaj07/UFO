import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { CORE_PRODUCTS_PRICING } from '@/lib/config/pricing'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get('secret')

    // Allow secret auth or authenticated admin session
    let isAuthorized = secret === 'UFOLabzAdmin2026!'

    if (!isAuthorized) {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = (await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()) as any

        if (profile && (profile.role === 'admin' || profile.role === 'super_admin')) {
          isAuthorized = true
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!hasServiceKey) {
      return NextResponse.json(
        {
          error:
            'SUPABASE_SERVICE_ROLE_KEY is not defined in this environment. Run this on production/Vercel.',
        },
        { status: 400 }
      )
    }

    const supabaseAdmin = createAdminClient()

    // 1. Update Base Prices on Products Table
    const productPriceUpdates = [
      { slug: 'astro-creatine', price: CORE_PRODUCTS_PRICING.creatine.retailPrice.CHF },
      { slug: 'amino-fuel-mango', price: CORE_PRODUCTS_PRICING.eaa.retailPrice.CHF },
      { slug: 'amino-fuel-blue-raspberry', price: CORE_PRODUCTS_PRICING.eaa.retailPrice.CHF },
      { slug: 'amino-fuel-blue', price: CORE_PRODUCTS_PRICING.eaa.retailPrice.CHF },
      { slug: 'blast-pre-workout-energy', price: CORE_PRODUCTS_PRICING.blast.retailPrice.CHF },
      { slug: 'blast-pre-workout-blue', price: CORE_PRODUCTS_PRICING.blast.retailPrice.CHF },
      { slug: 'astro-collagen-peptide', price: CORE_PRODUCTS_PRICING.collagen.retailPrice.CHF },
      { slug: 'astro-collagen', price: CORE_PRODUCTS_PRICING.collagen.retailPrice.CHF },
      { slug: 'magnesium', price: CORE_PRODUCTS_PRICING.magnesium.retailPrice.CHF },
    ]

    const updatedProducts: any[] = []
    for (const update of productPriceUpdates) {
      const { data, error } = await supabaseAdmin
        .from('products')
        .update({
          base_price: update.price,
          status: 'active',
          featured: true,
        })
        .eq('slug', update.slug)
        .select('id, slug, base_price, status')

      if (!error && data?.length) {
        updatedProducts.push(...data)
      }
    }

    // 2. Update Product Variants Table
    const variantPriceUpdates = [
      // Creatine 300g (23.27)
      { sku: 'ASTRO-300G', price: 23.27, is_default: true, status: 'active' },
      { sku: 'ASTRO-500G', price: 49.0, is_default: false, status: 'active' },
      // EAA 300g (32.37)
      { sku: 'AMNO-MANGO-300G', price: 32.37, is_default: true, status: 'active' },
      { sku: 'AMNO-BLUE-300G', price: 32.37, is_default: true, status: 'active' },
      { sku: 'AMINO-MANGO', price: 32.37, is_default: false, status: 'active' },
      // BLAST Pre-workout 300g (38.87)
      { sku: 'BLAST-ENERGY-300G', price: 38.87, is_default: true, status: 'active' },
      { sku: 'BLAST-BLUE-300G', price: 38.87, is_default: true, status: 'active' },
      // Marine Collagen 300g (38.87)
      { sku: 'COL-300G', price: 38.87, is_default: true, status: 'active' },
      // Magnesium 90 caps (19.37)
      { sku: 'SKU-MAGNESIUM-960', price: 19.37, is_default: true, status: 'active' },
    ]

    const updatedVariants: any[] = []
    for (const update of variantPriceUpdates) {
      const { data, error } = await supabaseAdmin
        .from('product_variants')
        .update({
          price: update.price,
          is_default: update.is_default,
          status: update.status,
        })
        .eq('sku', update.sku)
        .select('id, sku, price, is_default, status')

      if (!error && data?.length) {
        updatedVariants.push(...data)
      }
    }

    // 3. Update Site Settings (if table exists)
    try {
      await supabaseAdmin.from('site_settings').upsert([
        { key: 'preorder_mode', value: true },
        { key: 'estimated_ship_date', value: 'Late March 2027 (Batch 01)' },
      ])
    } catch {
      // ignore if table does not exist
    }

    return NextResponse.json({
      success: true,
      message: 'UFO LABZ pre-order prices and variants updated successfully.',
      updatedProducts,
      updatedVariants,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
