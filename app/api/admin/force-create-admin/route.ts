import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const password = searchParams.get('password');
    const secret = searchParams.get('secret');

    if (secret !== 'UFOLabzAdmin2026!') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 1. Try to create the user using the admin auth API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true // auto-confirm their email
    });

    let userId = authData?.user?.id;

    if (authError) {
      // If user already exists, we will just fetch their ID
      if (authError.message.includes('already exists') || authError.status === 422) {
        // Find existing user ID (we have to query profiles since we can't easily query auth.users without complicated APIs, but wait, listUsers works)
        const { data: existingProfile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();
          
        if (existingProfile) {
          userId = existingProfile.id;
          // Also update their password to make sure they can log in
          await supabaseAdmin.auth.admin.updateUserById(userId, { password: password });
        } else {
           return NextResponse.json({ error: 'User exists in auth but not in profiles. Try signing up normally.' }, { status: 400 });
        }
      } else {
        return NextResponse.json({ error: authError.message }, { status: 500 });
      }
    }

    // 2. Promote to admin in profiles table
    if (userId) {
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId);

      if (updateError) {
        return NextResponse.json({ error: `User created/updated, but failed to promote: ${updateError.message}` }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: `User ${email} has been created (or updated) and promoted to Admin. You can now log in with the password you provided.`
      });
    }

    return NextResponse.json({ error: 'Failed to retrieve user ID' }, { status: 500 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
