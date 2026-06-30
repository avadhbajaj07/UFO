import * as React from 'react';
import {
  Text,
  Link,
  Section,
} from '@react-email/components';
import BaseLayout from './BaseLayout';

// ─── 1. EMAIL VERIFICATION ────────────────────────────────────
interface VerificationProps {
  customerName?: string;
  verificationUrl: string;
}
export function EmailVerification({ customerName, verificationUrl }: VerificationProps) {
  return (
    <BaseLayout previewText="Verify your UFO LABZ email address" headline="Verify Your Flight Settings 🛸">
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 16px 0' }}>
        Dear {customerName || 'Athlete'},
      </Text>
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 24px 0' }}>
        Please verify your email address to lock in your account and start earning Alien Points on checkouts. 
        Click the secure button below to verify:
      </Text>
      <Section style={{ textAlign: 'center', margin: '24px 0' }}>
        <Link href={verificationUrl} className="btn-primary">
          Verify Email Address
        </Link>
      </Section>
      <Text style={{ fontSize: '12px', color: '#66667a', marginTop: '24px' }}>
        Or copy and paste this link in your browser: <br />
        <Link href={verificationUrl} style={{ color: '#ff8c00', textDecoration: 'underline' }}>{verificationUrl}</Link>
      </Text>
    </BaseLayout>
  );
}

// ─── 2. PASSWORD RESET ────────────────────────────────────────
interface PasswordResetProps {
  customerName?: string;
  resetUrl: string;
}
export function PasswordReset({ customerName, resetUrl }: PasswordResetProps) {
  return (
    <BaseLayout previewText="Reset your UFO LABZ account password" headline="Reset Navigation Password 🔑">
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 16px 0' }}>
        Dear {customerName || 'Athlete'},
      </Text>
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 24px 0' }}>
        We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
        Otherwise, click the button below to choose a new password:
      </Text>
      <Section style={{ textAlign: 'center', margin: '24px 0' }}>
        <Link href={resetUrl} className="btn-primary">
          Reset Password
        </Link>
      </Section>
      <Text style={{ fontSize: '12px', color: '#66667a', marginTop: '24px' }}>
        If the button doesn't work, copy and paste this URL: <br />
        <Link href={resetUrl} style={{ color: '#ff8c00', textDecoration: 'underline' }}>{resetUrl}</Link>
      </Text>
    </BaseLayout>
  );
}

// ─── 3. WELCOME EMAIL ─────────────────────────────────────────
interface WelcomeEmailProps {
  customerName: string;
  appUrl?: string;
}
export function WelcomeEmail({ customerName, appUrl = 'https://ufolabz.com' }: WelcomeEmailProps) {
  return (
    <BaseLayout previewText="Welcome to UFO LABZ!" headline="Welcome to the Crew 🚀">
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 16px 0' }}>
        Hello {customerName},
      </Text>
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 24px 0' }}>
        Welcome to UFO LABZ. Your account is active. You have been awarded **100 Sign-Up Alien Points**! 
        Log in to your account page to track workouts, customize supplement orders, and redeem your rewards.
      </Text>
      <Section style={{ textAlign: 'center', margin: '24px 0' }}>
        <Link href={`${appUrl}/account`} className="btn-primary">
          Access Crew Console
        </Link>
      </Section>
    </BaseLayout>
  );
}

// ─── 4. ORDER SHIPPED ─────────────────────────────────────────
interface OrderShippedProps {
  orderNumber: string;
  customerName: string;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}
export function OrderShipped({ orderNumber, customerName, carrier = 'Swiss PostPac', trackingNumber, trackingUrl }: OrderShippedProps) {
  return (
    <BaseLayout previewText={`Your UFO LABZ order #${orderNumber} has shipped!`} headline="Cargo Shipped 📦">
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 16px 0' }}>
        Dear {customerName},
      </Text>
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 24px 0' }}>
        Good news! Your supplements have left our Swiss laboratories and are currently in transit.
      </Text>
      <Section style={{ backgroundColor: '#0b0b0f', border: '1px solid #1e1e26', borderRadius: '16px', padding: '16px', margin: '0 0 24px 0' }}>
        <Text style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#66667a', textTransform: 'uppercase', fontFamily: 'monospace' }}>Shipping Provider</Text>
        <Text style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>{carrier}</Text>
        
        {trackingNumber && (
          <>
            <Text style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#66667a', textTransform: 'uppercase', fontFamily: 'monospace' }}>Tracking Reference</Text>
            <Text style={{ margin: '0', fontSize: '14px', fontWeight: '700', color: '#00ff88', fontFamily: 'monospace' }}>{trackingNumber}</Text>
          </>
        )}
      </Section>
      {trackingUrl && (
        <Section style={{ textAlign: 'center', margin: '24px 0' }}>
          <Link href={trackingUrl} className="btn-primary">
            Track Cargo Shipment
          </Link>
        </Section>
      )}
    </BaseLayout>
  );
}

// ─── 5. ORDER DELIVERED ───────────────────────────────────────
interface OrderDeliveredProps {
  orderNumber: string;
  customerName: string;
  appUrl?: string;
}
export function OrderDelivered({ orderNumber, customerName, appUrl = 'https://ufolabz.com' }: OrderDeliveredProps) {
  return (
    <BaseLayout previewText={`Your UFO LABZ order #${orderNumber} is delivered!`} headline="Cargo Delivered 🏁">
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 16px 0' }}>
        Dear {customerName},
      </Text>
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 24px 0' }}>
        Our logs confirm that order **#{orderNumber}** has been successfully delivered. 
        We hope you enjoy your premium sports supplements stack! Let us know how it fuels your training session.
      </Text>
      <Section style={{ textAlign: 'center', margin: '24px 0' }}>
        <Link href={`${appUrl}/products`} className="btn-primary">
          Shop More Stacks
        </Link>
      </Section>
    </BaseLayout>
  );
}

// ─── 6. REFUND PROCESSED ──────────────────────────────────────
interface RefundProcessedProps {
  orderNumber: string;
  customerName: string;
  refundAmount: number;
  currency?: string;
}
export function RefundProcessed({ orderNumber, customerName, refundAmount, currency = 'CHF' }: RefundProcessedProps) {
  return (
    <BaseLayout previewText={`Refund processed for order #${orderNumber}`} headline="Refund Dispatched 💳">
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 16px 0' }}>
        Dear {customerName},
      </Text>
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 24px 0' }}>
        We have processed a refund of **{currency} {refundAmount.toFixed(2)}** for order **#{orderNumber}**. 
        Depending on your bank, it should reflect in your account within 3 to 10 Swiss business days.
      </Text>
    </BaseLayout>
  );
}

// ─── 7. REVIEW REQUEST ────────────────────────────────────────
interface ReviewRequestProps {
  orderNumber: string;
  customerName: string;
  productName: string;
  reviewUrl: string;
}
export function ReviewRequest({ customerName, productName, reviewUrl }: ReviewRequestProps) {
  return (
    <BaseLayout previewText={`Review your ${productName}`} headline="Report Performance Data 📝">
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 16px 0' }}>
        Dear {customerName},
      </Text>
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 24px 0' }}>
        Now that you've had time to test **{productName}**, we would love to get your performance feedback. 
        Your review helps the rest of the crew choose their formulas! Click below to write a review:
      </Text>
      <Section style={{ textAlign: 'center', margin: '24px 0' }}>
        <Link href={reviewUrl} className="btn-primary">
          Write a Review
        </Link>
      </Section>
    </BaseLayout>
  );
}

// ─── 8. NEWSLETTER WELCOME ────────────────────────────────────
interface NewsletterProps {
  email: string;
}
export function NewsletterWelcome({ email }: NewsletterProps) {
  return (
    <BaseLayout previewText="Welcome to the UFO LABZ newsletter!" headline="Intel Transmission Logged 📡">
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 16px 0' }}>
        Hello Athlete,
      </Text>
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 24px 0' }}>
        You have been successfully added to our intelligence feed at **{email}**. 
        You will receive exclusive early access to Swiss laboratory test formulas, discounts, and product drops before they hit the general launchpad.
      </Text>
    </BaseLayout>
  );
}

// ─── 9. AFFILIATE APPROVAL ────────────────────────────────────
interface AffiliateApprovalProps {
  partnerName: string;
  referralCode: string;
  commissionRate: number;
}
export function AffiliateApproval({ partnerName, referralCode, commissionRate }: AffiliateApprovalProps) {
  return (
    <BaseLayout previewText="Welcome as a UFO LABZ partner!" headline="Affiliate Program Approved 🤝">
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 16px 0' }}>
        Dear {partnerName},
      </Text>
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 24px 0' }}>
        Congratulations! Your application has been approved by the UFO LABZ command deck.
        Your custom referral link and partner parameters are now active.
      </Text>
      <Section style={{ backgroundColor: '#0b0b0f', border: '1px solid #1e1e26', borderRadius: '16px', padding: '16px', margin: '0 0 24px 0' }}>
        <Text style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#66667a', textTransform: 'uppercase', fontFamily: 'monospace' }}>Your Custom Promo Code</Text>
        <Text style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700', color: '#00ff88', fontFamily: 'monospace' }}>{referralCode}</Text>
        
        <Text style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#66667a', textTransform: 'uppercase', fontFamily: 'monospace' }}>Your Commission Rate</Text>
        <Text style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>{commissionRate}% per Sale</Text>
      </Section>
    </BaseLayout>
  );
}

// ─── 10. ORDER STATUS CHANGE ──────────────────────────────────
interface OrderStatusProps {
  orderNumber: string;
  customerName: string;
  oldStatus: string;
  newStatus: string;
}
export function OrderStatusChange({ orderNumber, customerName, oldStatus, newStatus }: OrderStatusProps) {
  return (
    <BaseLayout previewText={`Order #${orderNumber} status update`} headline="Order Status Update 🛰️">
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 16px 0' }}>
        Dear {customerName},
      </Text>
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 24px 0' }}>
        Your order **#{orderNumber}** has been updated to the following stage:
      </Text>
      <Section style={{ backgroundColor: '#0b0b0f', border: '1px solid #1e1e26', borderRadius: '16px', padding: '16px', margin: '0 0 24px 0' }}>
        <Text style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#66667a', textTransform: 'uppercase', fontFamily: 'monospace' }}>Current Stage</Text>
        <Text style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#00ff88', textTransform: 'uppercase' }}>{newStatus}</Text>
      </Section>
    </BaseLayout>
  );
}

// ─── 11. LOYALTY REWARD ───────────────────────────────────────
interface LoyaltyRewardProps {
  customerName: string;
  points: number;
  expiryDate: string;
}
export function LoyaltyReward({ customerName, points, expiryDate }: LoyaltyRewardProps) {
  return (
    <BaseLayout previewText="You have received UFO LABZ Reward Points!" headline="Loyalty Points Awarded 🛸">
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 16px 0' }}>
        Dear {customerName},
      </Text>
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 24px 0' }}>
        We have added a custom reward of **{points.toLocaleString()} Loyalty Points** to your Swiss client profile!
      </Text>
      <Section style={{ backgroundColor: '#0b0b0f', border: '1px solid #1e1e26', borderRadius: '16px', padding: '16px', margin: '0 0 24px 0' }}>
        <Text style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#66667a', textTransform: 'uppercase', fontFamily: 'monospace' }}>Points Added</Text>
        <Text style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700', color: '#00ff88', fontFamily: 'monospace' }}>+{points} pts</Text>
        
        <Text style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#66667a', textTransform: 'uppercase', fontFamily: 'monospace' }}>Expiration Date</Text>
        <Text style={{ margin: '0', fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>{expiryDate}</Text>
      </Section>
    </BaseLayout>
  );
}

// ─── 12. AFFILIATE RATE CHANGE ────────────────────────────────
interface AffiliateRateProps {
  partnerName: string;
  oldRate: number;
  newRate: number;
}
export function AffiliateRateChange({ partnerName, oldRate, newRate }: AffiliateRateProps) {
  return (
    <BaseLayout previewText="UFO LABZ Affiliate Commission Update" headline="Commission Structure Changed 📈">
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 16px 0' }}>
        Dear {partnerName},
      </Text>
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 24px 0' }}>
        Your personal affiliate commission structure has been updated on the command deck.
      </Text>
      <Section style={{ backgroundColor: '#0b0b0f', border: '1px solid #1e1e26', borderRadius: '16px', padding: '16px', margin: '0 0 24px 0' }}>
        <Text style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#66667a', textTransform: 'uppercase', fontFamily: 'monospace' }}>Previous Rate</Text>
        <Text style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700', color: '#66667a', textDecoration: 'line-through' }}>{oldRate}%</Text>
        
        <Text style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#66667a', textTransform: 'uppercase', fontFamily: 'monospace' }}>New Commission Level</Text>
        <Text style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#00ff88' }}>{newRate}% per Sale</Text>
      </Section>
    </BaseLayout>
  );
}

// ─── 13. ABANDONED CART ────────────────────────────────────────
interface AbandonedCartProps {
  customerName: string;
  cartItems: Array<{ name: string; variantName: string; price: number; quantity: number; imageUrl?: string }>;
  checkoutUrl: string;
  discountCode?: string;
}
export function AbandonedCartEmail({ customerName, cartItems, checkoutUrl, discountCode }: AbandonedCartProps) {
  return (
    <BaseLayout previewText="You left premium supplements behind..." headline="Complete Your Stacks 🛸">
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 16px 0' }}>
        Dear {customerName || 'Athlete'},
      </Text>
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 24px 0' }}>
        Your flight settings are locked, but your capsule payload is still waiting on the pad. 
        We have reserved your premium Swiss formulas. Complete your purchase in one click:
      </Text>
      
      <Section style={{ backgroundColor: '#0b0b0f', border: '1px solid #1e1e26', borderRadius: '16px', padding: '16px', margin: '0 0 24px 0' }}>
        <Text style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#66667a', textTransform: 'uppercase', fontFamily: 'monospace' }}>Your Cart Items</Text>
        {cartItems.map((item, idx) => (
          <div key={idx} style={{ borderBottom: '1px solid #1e1e26', paddingBottom: '8px', marginBottom: '8px' }}>
            <Text style={{ margin: '0', fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>{item.name}</Text>
            <Text style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#66667a' }}>{item.variantName} x {item.quantity} — CHF {item.price.toFixed(2)}</Text>
          </div>
        ))}
      </Section>

      {discountCode && (
        <Section style={{ backgroundColor: 'rgba(0,255,136,0.05)', border: '1px dashed #00ff88', borderRadius: '12px', padding: '12px', textAlign: 'center', margin: '0 0 24px 0' }}>
          <Text style={{ margin: '0', fontSize: '11px', color: '#00ff88', textTransform: 'uppercase', fontFamily: 'monospace' }}>Limited Time Discount Added</Text>
          <Text style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>Use code <span style={{ color: '#00ff88' }}>{discountCode}</span> for 10% Off</Text>
        </Section>
      )}

      <Section style={{ textAlign: 'center', margin: '24px 0' }}>
        <Link href={checkoutUrl} className="btn-primary">
          Complete Transmission
        </Link>
      </Section>
    </BaseLayout>
  );
}

// ─── 14. POST-PURCHASE REPLENISHMENT ──────────────────────────
interface ReplenishmentProps {
  customerName: string;
  productName: string;
  reorderUrl: string;
}
export function ReplenishmentEmail({ customerName, productName, reorderUrl }: ReplenishmentProps) {
  return (
    <BaseLayout previewText={`Running low on ${productName}?`} headline="Replenish Formula 🚀">
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 16px 0' }}>
        Hello {customerName || 'Athlete'},
      </Text>
      <Text style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1d1d6', margin: '0 0 24px 0' }}>
        According to our telemetry logs, you should be approaching the end of your recent **{productName}** supplies.
        Don't let your performance levels drop. Reorder your fresh batch in a single click:
      </Text>
      <Section style={{ textAlign: 'center', margin: '24px 0' }}>
        <Link href={reorderUrl} className="btn-primary">
          Fast Reorder Batch
        </Link>
      </Section>
    </BaseLayout>
  );
}
