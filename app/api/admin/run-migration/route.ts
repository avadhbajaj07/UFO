import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const nutritionImages = [
  {
    product_id: 'da5a0c52-42b3-47b2-9909-d0cf24b2ec01', // blast-pre-workout-blue
    url: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1783705868/UFOnutritionfacts_5_hei4cp.jpg',
    alt: { en: 'Blast Pre-Workout Blue Raspberry - Nutrition Facts', de: 'Blast Pre-Workout Blaue Himbeere - Nährwertangaben' },
  },
  {
    product_id: 'adbb6060-0125-4d38-871f-d9808d01c048', // amino-fuel-mango
    url: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1783705867/UFOnutritionfacts_6_b72ozf.jpg',
    alt: { en: 'Amino Fuel EAA Mango - Nutrition Facts', de: 'Amino Fuel EAA Mango - Nährwertangaben' },
  },
  {
    product_id: 'c546d1a2-ec59-467e-9b94-5f09980d0401', // amino-fuel-blue-raspberry
    url: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1783705867/UFOnutritionfacts_7_fqly3i.jpg',
    alt: { en: 'Amino Fuel EAA Blue Raspberry - Nutrition Facts', de: 'Amino Fuel EAA Blaue Himbeere - Nährwertangaben' },
  },
  {
    product_id: '850b8ebc-caf4-4a18-83e9-4a7f2d6a0412', // astro-collagen-peptide
    url: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1783705867/UFOnutritionfacts_2_cfz02f.jpg',
    alt: { en: 'Astro Collagen Peptide - Nutrition Facts', de: 'Astro Kollagen Peptid - Nährwertangaben' },
  },
  {
    product_id: '66dd3409-e2f7-4015-8a39-d3aaa1f9941a', // blast-pre-workout-energy
    url: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1783705867/UFOnutritionfacts_4_iu5ykt.jpg',
    alt: { en: 'Blast Pre-Workout Energy Drink - Nutrition Facts', de: 'Blast Pre-Workout Energy Drink - Nährwertangaben' },
  },
  {
    product_id: '5cd5033d-002b-4f89-a135-d14c0a019625', // magnesium
    url: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1783705867/UFOnutritionfacts_1_jazusl.jpg',
    alt: { en: 'Magnesium - Nutrition Facts', de: 'Magnesium - Nährwertangaben' },
  },
  {
    product_id: '5ccc0296-df9c-4560-ba43-496e79665aac', // astro-creatine
    url: 'https://res.cloudinary.com/dm4jfxbcs/image/upload/v1783705867/UFOnutritionfacts_3_atqycs.jpg',
    alt: { en: 'Astro Creatine Pure - Nutrition Facts', de: 'Astro Kreatin Pur - Nährwertangaben' },
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');

    if (secret !== 'UFOLabzAdmin2026!') {
      return NextResponse.json({ error: 'Unauthorized. Invalid secret key.' }, { status: 401 });
    }

    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!hasServiceKey) {
      return NextResponse.json({
        error: 'SUPABASE_SERVICE_ROLE_KEY is not defined in this environment. Run this on production/Vercel.',
        env: {
          NODE_ENV: process.env.NODE_ENV,
          url: process.env.NEXT_PUBLIC_SUPABASE_URL
        }
      }, { status: 400 });
    }

    // 1. Clean up existing nutrition facts urls
    const urlsToClean = nutritionImages.map(img => img.url);
    const { data: cleanedImgs, error: cleanError } = await supabaseAdmin
      .from('product_images')
      .delete()
      .in('url', urlsToClean)
      .select();

    if (cleanError) {
      throw cleanError;
    }

    // 2. Clean up duplicate non-primary collagen images
    const { data: collagenDupes } = await supabaseAdmin
      .from('product_images')
      .select('id')
      .eq('product_id', '850b8ebc-caf4-4a18-83e9-4a7f2d6a0412')
      .eq('is_primary', false);

    if (collagenDupes && collagenDupes.length > 0) {
      const dupeIds = collagenDupes.map(d => d.id);
      const { error: delError } = await supabaseAdmin
        .from('product_images')
        .delete()
        .in('id', dupeIds);
      if (delError) throw delError;
    }

    // 3. Insert nutrition facts images
    const inserts = nutritionImages.map(img => ({
      product_id: img.product_id,
      url: img.url,
      alt: img.alt,
      is_primary: false,
      sort_order: 2,
    }));

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('product_images')
      .insert(inserts)
      .select();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      cleanedCount: cleanedImgs?.length || 0,
      insertedCount: inserted?.length || 0,
      inserted
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
