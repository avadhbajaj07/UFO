import { Resend } from 'resend'
import { renderEmail, EmailTemplateKey } from './templates'

let resendClient: Resend | null | undefined

// Initialize lazily so builds do not evaluate the email SDK before runtime secrets exist.
const getResendClient = () => {
  if (resendClient !== undefined) return resendClient
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    resendClient = null
    return resendClient
  }
  resendClient = new Resend(apiKey)
  return resendClient
}

// Configuration parameters
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'UFO LABZ <hello@ufolabz.com>'
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'marco.scarpantoni@hotmail.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://ufolabz.com'

export interface EmailSendResult {
  success: boolean
  id?: string
  error?: string
}

const logEmailError = (methodName: string, error: any): EmailSendResult => {
  const msg = error instanceof Error ? error.message : String(error)
  console.error(`❌ Error in email service [${methodName}]:`, error)
  return { success: false, error: msg }
}

async function sendTemplateEmail(
  to: string,
  templateKey: EmailTemplateKey,
  variables: Record<string, any> = {},
  replyTo: string = 'hello@ufolabz.com'
): Promise<EmailSendResult> {
  try {
    const { subject, html } = renderEmail(templateKey, variables)
    const resend = getResendClient()

    if (!resend) {
      console.log(`[MOCK EMAIL] [${templateKey}] to ${to} | Subject: "${subject}"`)
      return { success: true, id: `mock-${templateKey}-${Date.now()}` }
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo,
      subject,
      html,
    })

    if (error) {
      return logEmailError(templateKey, error)
    }

    return { success: true, id: data?.id }
  } catch (err: any) {
    return logEmailError(templateKey, err)
  }
}

/**
 * UFO LABZ Email Service — Sourced from official UFOLABZ_Email_Templates (18 events)
 */
export const emailService = {
  // ── 1. Customer Emails ──────────────────────────────────────────────

  /**
   * 1. Order confirmation (Payment succeeded)
   */
  async sendOrderConfirmation(orderData: any, items: any[] = []): Promise<EmailSendResult> {
    const to = orderData.email || orderData.guest_email
    if (!to) return { success: false, error: 'Recipient email missing' }

    const address = orderData.shipping_address || {}
    const firstName = address.fullName?.split(' ')[0] || orderData.customerName?.split(' ')[0] || 'Valued Athlete'
    const currency = orderData.currency || 'CHF'

    const vars = {
      first_name: firstName,
      order_number: orderData.order_number || orderData.id?.slice(0, 8),
      order_date: new Date(orderData.created_at || Date.now()).toLocaleDateString('de-CH'),
      payment_method: (orderData.payment_method || 'TWINT').toUpperCase(),
      shipping_method: orderData.shipping_method || 'Swiss Post Priority',
      shipping_address: `${address.addressLine1 || address.street || ''}, ${address.zipCode || address.zip || ''} ${address.city || ''}, Switzerland`,
      subtotal: `${currency} ${Number(orderData.subtotal || 0).toFixed(2)}`,
      discount: `${currency} ${Number(orderData.discount_amount || 0).toFixed(2)}`,
      shipping: Number(orderData.shipping_amount || 0) === 0 ? 'FREE' : `${currency} ${Number(orderData.shipping_amount).toFixed(2)}`,
      total: `${currency} ${Number(orderData.total || 0).toFixed(2)}`,
      order_url: `${APP_URL}/account`,
    }

    return sendTemplateEmail(to, 'order_confirmation', vars)
  },

  /**
   * 2. Abandoned cart reminder
   */
  async sendAbandonedCart(
    email: string,
    customerName: string,
    cartItems: any[],
    checkoutUrl: string,
    discountCode?: string
  ): Promise<EmailSendResult> {
    const firstName = customerName?.split(' ')[0] || 'Athlete'
    const subtotal = cartItems.reduce((acc, i) => acc + (Number(i.price || 0) * (i.quantity || 1)), 0)

    const vars = {
      first_name: firstName,
      cart_url: checkoutUrl || `${APP_URL}/checkout`,
      discount_code: discountCode || 'ORBITAL10',
      subtotal: `CHF ${subtotal.toFixed(2)}`,
      discount: `CHF ${(subtotal * 0.25).toFixed(2)}`,
      shipping: subtotal >= 75 ? 'FREE' : 'CHF 7.90',
      total: `CHF ${(subtotal * 0.75).toFixed(2)}`,
    }

    return sendTemplateEmail(email, 'abandoned_cart', vars)
  },

  /**
   * 3. Time to restock (45 days)
   */
  async sendRestockReminder(
    email: string,
    customerName: string,
    productName: string,
    reorderUrl: string
  ): Promise<EmailSendResult> {
    const firstName = customerName?.split(' ')[0] || 'Athlete'

    const vars = {
      first_name: firstName,
      last_product_name: productName || 'Astro Creatine Pure',
      reorder_url: reorderUrl || `${APP_URL}/products`,
      restock_code: 'RESTOCK10',
      restock_discount: '10% off',
      code_expiry: '7 days',
    }

    return sendTemplateEmail(email, 'restock_reminder', vars)
  },

  /**
   * 4. Order shipped (Swiss Post Priority tracking)
   */
  async sendOrderShipped(orderData: any): Promise<EmailSendResult> {
    const to = orderData.email || orderData.guest_email || orderData.customerEmail
    if (!to) return { success: false, error: 'Recipient email missing' }

    const address = orderData.shipping_address || {}
    const firstName = address.fullName?.split(' ')[0] || orderData.customerName?.split(' ')[0] || 'Valued Athlete'
    const trackingNumber = orderData.tracking_number || orderData.trackingNumber || 'Pending'
    const trackingUrl = orderData.tracking_url || orderData.trackingUrl || `https://service.post.ch/tracking?formattedParcelCodes=${trackingNumber}`

    const vars = {
      first_name: firstName,
      order_number: orderData.order_number || orderData.id,
      tracking_number: trackingNumber,
      tracking_url: trackingUrl,
      estimated_delivery: 'Next working day (Swiss Post Priority)',
    }

    return sendTemplateEmail(to, 'order_shipped', vars)
  },

  /**
   * 5. Order delayed
   */
  async sendOrderDelayed(
    orderData: any,
    newEta?: string,
    delayReason?: string
  ): Promise<EmailSendResult> {
    const to = orderData.email || orderData.guest_email || orderData.customerEmail
    if (!to) return { success: false, error: 'Recipient email missing' }

    const firstName = orderData.customerName?.split(' ')[0] || 'Valued Athlete'

    const vars = {
      first_name: firstName,
      order_number: orderData.order_number || orderData.id,
      new_eta: newEta || 'within 3-5 working days',
      delay_reason: delayReason || 'custom batch laboratory quality verification',
      order_url: `${APP_URL}/account`,
    }

    return sendTemplateEmail(to, 'order_delayed', vars)
  },

  /**
   * 6. Order cancelled & refund
   */
  async sendOrderCancelled(
    orderData: any,
    cancelReason?: string,
    refundAmount?: string | number
  ): Promise<EmailSendResult> {
    const to = orderData.email || orderData.guest_email || orderData.customerEmail
    if (!to) return { success: false, error: 'Recipient email missing' }

    const firstName = orderData.customerName?.split(' ')[0] || 'Valued Athlete'
    const currency = orderData.currency || 'CHF'

    const vars = {
      first_name: firstName,
      order_number: orderData.order_number || orderData.id,
      cancel_date: new Date().toLocaleDateString('de-CH'),
      cancel_reason: cancelReason || 'customer requested cancellation',
      refund_amount: `${currency} ${Number(refundAmount || orderData.total || 0).toFixed(2)}`,
      refund_days: '2-4 business days',
    }

    return sendTemplateEmail(to, 'order_cancelled', vars)
  },

  /**
   * 7. Order delivered
   */
  async sendOrderDelivered(orderData: any): Promise<EmailSendResult> {
    const to = orderData.email || orderData.guest_email || orderData.customerEmail
    if (!to) return { success: false, error: 'Recipient email missing' }

    const firstName = orderData.customerName?.split(' ')[0] || 'Valued Athlete'

    const vars = {
      first_name: firstName,
      order_number: orderData.order_number || orderData.id,
      review_url: `${APP_URL}/account`,
    }

    return sendTemplateEmail(to, 'order_delivered', vars)
  },

  // ── 2. Athlete & Affiliate Emails ───────────────────────────────────

  /**
   * 8. Athlete application received (to Athlete)
   */
  async sendAffiliateApplicationReceived(
    email: string,
    athleteName: string,
    sport?: string,
    instagramHandle?: string
  ): Promise<EmailSendResult> {
    const firstName = athleteName?.split(' ')[0] || 'Partner'

    const vars = {
      first_name: firstName,
      athlete_name: athleteName,
      sport: sport || 'Fitness & Athletics',
      instagram_handle: instagramHandle || '@athlete',
      review_days: '2-3 business days',
    }

    return sendTemplateEmail(email, 'affiliate_application_received', vars)
  },

  /**
   * 9. New athlete application alert (to Admin)
   */
  async sendAffiliateApplicationAdminAlert(
    athleteName: string,
    athleteEmail: string,
    sport?: string,
    instagramHandle?: string,
    followers?: string
  ): Promise<EmailSendResult> {
    const vars = {
      athlete_name: athleteName,
      athlete_email: athleteEmail,
      sport: sport || 'Crossfit / Bodybuilding',
      instagram_handle: instagramHandle || 'N/A',
      followers: followers || '1k - 10k',
      admin_review_url: `${APP_URL}/admin`,
    }

    return sendTemplateEmail(ADMIN_EMAIL, 'affiliate_application_admin_alert', vars)
  },

  /**
   * 10. Athlete approved: getting started (to Athlete)
   */
  async sendAffiliateApproved(
    email: string,
    partnerName: string,
    commissionRate: string | number = 15
  ): Promise<EmailSendResult> {
    const firstName = partnerName?.split(' ')[0] || 'Partner'

    const vars = {
      first_name: firstName,
      commission_rate: `${commissionRate}%`,
      dashboard_url: `${APP_URL}/affiliate`,
    }

    return sendTemplateEmail(email, 'affiliate_approved', vars)
  },

  /**
   * 11. Custom coupon submitted alert (to Admin)
   */
  async sendCouponSubmittedAdminAlert(
    athleteName: string,
    couponCode: string,
    couponDiscount: string | number = '10%'
  ): Promise<EmailSendResult> {
    const vars = {
      athlete_name: athleteName,
      coupon_code: couponCode,
      coupon_discount: typeof couponDiscount === 'number' ? `${couponDiscount}%` : couponDiscount,
      admin_coupon_url: `${APP_URL}/admin`,
    }

    return sendTemplateEmail(ADMIN_EMAIL, 'coupon_submitted_admin_alert', vars)
  },

  /**
   * 12. Coupon approved (to Athlete)
   */
  async sendCouponApproved(
    email: string,
    partnerName: string,
    couponCode: string,
    couponDiscount: string | number = '10%',
    commissionRate: string | number = 15
  ): Promise<EmailSendResult> {
    const firstName = partnerName?.split(' ')[0] || 'Partner'

    const vars = {
      first_name: firstName,
      coupon_code: couponCode,
      coupon_discount: typeof couponDiscount === 'number' ? `${couponDiscount}%` : couponDiscount,
      commission_rate: typeof commissionRate === 'number' ? `${commissionRate}%` : commissionRate,
      dashboard_url: `${APP_URL}/affiliate`,
    }

    return sendTemplateEmail(email, 'coupon_approved', vars)
  },

  /**
   * 13. Coupon not approved (to Athlete)
   */
  async sendCouponRejected(
    email: string,
    partnerName: string,
    couponCode: string,
    rejectReason?: string
  ): Promise<EmailSendResult> {
    const firstName = partnerName?.split(' ')[0] || 'Partner'

    const vars = {
      first_name: firstName,
      coupon_code: couponCode,
      reject_reason: rejectReason || 'Code name already taken or reserved by program rules.',
      dashboard_url: `${APP_URL}/affiliate`,
    }

    return sendTemplateEmail(email, 'coupon_rejected', vars)
  },

  /**
   * 14. Commission earned (to Athlete)
   */
  async sendCommissionEarned(
    email: string,
    partnerName: string,
    commissionAmount: string | number,
    orderNumber: string,
    orderTotal: string | number,
    couponCode?: string,
    commissionRate: string | number = 15
  ): Promise<EmailSendResult> {
    const firstName = partnerName?.split(' ')[0] || 'Partner'
    const commAmt = typeof commissionAmount === 'number' ? `CHF ${commissionAmount.toFixed(2)}` : commissionAmount
    const ordTot = typeof orderTotal === 'number' ? `CHF ${orderTotal.toFixed(2)}` : orderTotal

    const vars = {
      first_name: firstName,
      commission_amount: commAmt,
      commission_rate: `${commissionRate}%`,
      commission_status: 'CONFIRMED',
      coupon_code: couponCode || 'REFERRAL-LINK',
      order_number: orderNumber,
      order_total: ordTot,
      pending_balance: commAmt,
      return_days: '14 days',
      dashboard_url: `${APP_URL}/affiliate`,
    }

    return sendTemplateEmail(email, 'commission_earned', vars)
  },

  // ── 3. Account & Security Emails ────────────────────────────────────

  /**
   * 15. Confirm email (signup)
   */
  async sendConfirmEmail(
    email: string,
    confirmUrl: string,
    firstName?: string
  ): Promise<EmailSendResult> {
    const vars = {
      first_name: firstName || email.split('@')[0],
      confirm_url: confirmUrl,
      expiry_hours: '24',
    }

    return sendTemplateEmail(email, 'confirm_email', vars)
  },

  /**
   * 16. Welcome email (Google sign-in)
   */
  async sendWelcomeGoogle(
    email: string,
    firstName?: string
  ): Promise<EmailSendResult> {
    const vars = {
      first_name: firstName || email.split('@')[0],
      email: email,
    }

    return sendTemplateEmail(email, 'welcome_google', vars)
  },

  /**
   * 17. Reset your password
   */
  async sendResetPassword(
    email: string,
    resetUrl: string,
    firstName?: string
  ): Promise<EmailSendResult> {
    const vars = {
      first_name: firstName || email.split('@')[0],
      reset_url: resetUrl,
      expiry_minutes: '60',
    }

    return sendTemplateEmail(email, 'reset_password', vars)
  },

  /**
   * 18. Password changed
   */
  async sendPasswordChanged(
    email: string,
    firstName?: string
  ): Promise<EmailSendResult> {
    const vars = {
      first_name: firstName || email.split('@')[0],
      change_date: new Date().toLocaleDateString('de-CH'),
      reset_url: `${APP_URL}/reset-password`,
    }

    return sendTemplateEmail(email, 'password_changed', vars)
  },

  // ── Backward-compatible Aliases ────────────────────────────────────
  async sendWelcomeEmail(email: string, name: string): Promise<EmailSendResult> {
    return this.sendWelcomeGoogle(email, name)
  },
  async sendVerificationEmail(email: string, token: string, name?: string): Promise<EmailSendResult> {
    return this.sendConfirmEmail(email, `${APP_URL}/auth/callback?token=${token}`, name)
  },
  async sendAdminNotification(orderData: any, items: any[]): Promise<EmailSendResult> {
    return this.sendOrderConfirmation({ ...orderData, email: ADMIN_EMAIL }, items)
  },
  async sendRefundProcessed(orderData: any, refundAmount: number): Promise<EmailSendResult> {
    return this.sendOrderCancelled(orderData, 'Processed refund', refundAmount)
  },
  async sendReviewRequest(orderData: any, productName: string): Promise<EmailSendResult> {
    return this.sendOrderDelivered(orderData)
  },
  async sendNewsletterWelcome(email: string): Promise<EmailSendResult> {
    return this.sendWelcomeGoogle(email)
  },
  async sendAffiliateApproval(email: string, partnerName: string, referralCode: string, commissionRate: number): Promise<EmailSendResult> {
    return this.sendAffiliateApproved(email, partnerName, commissionRate)
  },
  async sendOrderStatusChange(email: string, customerName: string, orderNumber: string, oldStatus: string, newStatus: string): Promise<EmailSendResult> {
    if (newStatus.toLowerCase().includes('shipped') || newStatus.toLowerCase().includes('completed')) {
      return this.sendOrderShipped({ email, customerName, order_number: orderNumber })
    }
    if (newStatus.toLowerCase().includes('ready') || newStatus.toLowerCase().includes('delivered')) {
      return this.sendOrderDelivered({ email, customerName, order_number: orderNumber })
    }
    return this.sendOrderDelayed({ email, customerName, order_number: orderNumber }, 'Prepared for shipment', `Status update to ${newStatus}`)
  },
  async sendLoyaltyReward(email: string, customerName: string, points: number, expiryDate: string): Promise<EmailSendResult> {
    return this.sendWelcomeGoogle(email, customerName)
  },
  async sendAffiliateRateChange(email: string, partnerName: string, oldRate: number, newRate: number): Promise<EmailSendResult> {
    return this.sendAffiliateApproved(email, partnerName, newRate)
  },
  async sendReplenishment(email: string, customerName: string, productName: string, reorderUrl: string): Promise<EmailSendResult> {
    return this.sendRestockReminder(email, customerName, productName, reorderUrl)
  },
  async sendCustomEmail(email: string, subject: string, textOrHtml: string): Promise<EmailSendResult> {
    const resend = getResendClient()
    if (!resend) return { success: true, id: 'mock-custom' }
    return resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html: textOrHtml,
    }) as any
  },
}
