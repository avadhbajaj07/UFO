import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');
    const secret = searchParams.get('secret');

    if (secret !== 'UFOLabzAdmin2026!') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // All child tables have ON DELETE CASCADE, so deleting from products
    // will automatically remove: product_images, product_variants, product_faqs,
    // product_videos, product_tags, product_ingredients, product_stacks,
    // product_usage_instructions, nutrition_facts, wishlist_items, reviews, etc.

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Product ${productId} and all related data permanently deleted.`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
