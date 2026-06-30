import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { emailService } from '@/lib/email/email';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // Verify admin role server-side
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single() as any;

    if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized. Admin permissions required.' }, { status: 403 });
    }

    const body = await req.json();
    const { type, payload } = body;

    if (type === 'affiliate_approval') {
      const { email, partnerName, referralCode, commissionRate } = payload;
      await emailService.sendAffiliateApproval(email, partnerName, referralCode, commissionRate);
      return NextResponse.json({ success: true, message: 'Affiliate approval email sent.' });
    }

    if (type === 'order_status_change') {
      const { email, customerName, orderNumber, oldStatus, newStatus } = payload;
      await emailService.sendOrderStatusChange(email, customerName, orderNumber, oldStatus, newStatus);
      return NextResponse.json({ success: true, message: 'Order status change email sent.' });
    }

    if (type === 'loyalty_reward') {
      const { email, customerName, points, expiryDate } = payload;
      await emailService.sendLoyaltyReward(email, customerName, points, expiryDate);
      return NextResponse.json({ success: true, message: 'Loyalty reward email sent.' });
    }

    if (type === 'affiliate_rate_change') {
      const { email, partnerName, oldRate, newRate } = payload;
      await emailService.sendAffiliateRateChange(email, partnerName, oldRate, newRate);
      return NextResponse.json({ success: true, message: 'Affiliate rate change email sent.' });
    }

    return NextResponse.json({ error: 'Invalid email trigger type.' }, { status: 400 });
  } catch (err: any) {
    console.error('Error in trigger-email API handler:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
