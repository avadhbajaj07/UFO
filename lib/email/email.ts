import { Resend } from 'resend';
import * as React from 'react';
import OrderConfirmation from '@/components/email/OrderConfirmation';
import AdminNotification from '@/components/email/AdminNotification';
import {
  EmailVerification,
  PasswordReset,
  WelcomeEmail,
  OrderShipped,
  OrderDelivered,
  RefundProcessed,
  ReviewRequest,
  NewsletterWelcome,
} from '@/components/email/OtherTemplates';

// Instantiate the Resend client with safe fallback for dev environments
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ Warning: RESEND_API_KEY is not defined in environment variables. Email sending is mocked.');
    return null;
  }
  return new Resend(apiKey);
};

const resend = getResendClient();

// Configuration parameters
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'UFO LABZ <hello@ufolabz.com>';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'marco.scarpantoni@hotmail.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Standard interface for emails return value
 */
interface EmailSendResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Helper to log and format errors safely
 */
const logEmailError = (methodName: string, error: any): EmailSendResult => {
  const msg = error instanceof Error ? error.message : String(error);
  console.error(`❌ Error in email service [${methodName}]:`, error);
  return { success: false, error: msg };
};

/**
 * UFO LABZ Email Service
 */
export const emailService = {
  /**
   * Customer Order Confirmation Email
   */
  async sendOrderConfirmation(orderData: any, items: any[]): Promise<EmailSendResult> {
    try {
      if (!resend) {
        console.log(`[MOCK EMAIL] sendOrderConfirmation to ${orderData.email} for order #${orderData.order_number}`);
        return { success: true, id: 'mock-confirm-id' };
      }

      const shippingAddress = orderData.shipping_address || {};
      const billingAddress = orderData.billing_address || shippingAddress;

      const formattedItems = items.map((item) => ({
        name: item.product_name?.en || item.product_name || 'UFO Product',
        variantName: item.variant_name || 'Standard size',
        quantity: item.quantity,
        price: Number(item.unit_price),
        sku: item.sku || 'N/A',
      }));

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: orderData.email,
        replyTo: 'hello@ufolabz.com',
        subject: 'Your UFO LABZ Order is Confirmed 🎉',
        react: React.createElement(OrderConfirmation, {
          orderNumber: orderData.order_number,
          customerName: shippingAddress.fullName || 'Valued Customer',
          shippingAddress: {
            fullName: shippingAddress.fullName || '',
            addressLine1: shippingAddress.addressLine1 || '',
            addressLine2: shippingAddress.addressLine2,
            city: shippingAddress.city || '',
            zipCode: shippingAddress.zipCode || '',
            canton: shippingAddress.canton || '',
          },
          billingAddress: {
            fullName: billingAddress.fullName || '',
            addressLine1: billingAddress.addressLine1 || '',
            addressLine2: billingAddress.addressLine2,
            city: billingAddress.city || '',
            zipCode: billingAddress.zipCode || '',
            canton: billingAddress.canton || '',
          },
          items: formattedItems,
          subtotal: Number(orderData.subtotal),
          discountAmount: Number(orderData.discount_amount),
          shippingAmount: Number(orderData.shipping_amount),
          total: Number(orderData.total),
          currency: orderData.currency || 'CHF',
          estimatedDelivery: orderData.estimated_delivery
            ? new Date(orderData.estimated_delivery).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })
            : undefined,
          appUrl: APP_URL,
        }),
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, id: data?.id };
    } catch (err) {
      return logEmailError('sendOrderConfirmation', err);
    }
  },

  /**
   * Admin Notification Email (Internal)
   */
  async sendAdminNotification(orderData: any, items: any[]): Promise<EmailSendResult> {
    try {
      if (!resend) {
        console.log(`[MOCK EMAIL] sendAdminNotification to ${ADMIN_EMAIL} for order #${orderData.order_number}`);
        return { success: true, id: 'mock-admin-id' };
      }

      const shippingAddress = orderData.shipping_address || {};
      const billingAddress = orderData.billing_address || shippingAddress;

      const formattedItems = items.map((item) => ({
        name: item.product_name?.en || item.product_name || 'UFO Product',
        variantName: item.variant_name || 'Standard size',
        quantity: item.quantity,
        price: Number(item.unit_price),
        sku: item.sku || 'N/A',
      }));

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        replyTo: 'hello@ufolabz.com',
        subject: `🎉 New Order Received - #${orderData.order_number}`,
        react: React.createElement(AdminNotification, {
          orderNumber: orderData.order_number,
          customerName: shippingAddress.fullName || 'Guest Athlete',
          customerEmail: orderData.email || 'N/A',
          customerPhone: shippingAddress.phone || orderData.phone,
          shippingAddress: {
            fullName: shippingAddress.fullName || '',
            addressLine1: shippingAddress.addressLine1 || '',
            addressLine2: shippingAddress.addressLine2,
            city: shippingAddress.city || '',
            zipCode: shippingAddress.zipCode || '',
            canton: shippingAddress.canton || '',
          },
          billingAddress: {
            fullName: billingAddress.fullName || '',
            addressLine1: billingAddress.addressLine1 || '',
            addressLine2: billingAddress.addressLine2,
            city: billingAddress.city || '',
            zipCode: billingAddress.zipCode || '',
            canton: billingAddress.canton || '',
          },
          items: formattedItems,
          subtotal: Number(orderData.subtotal),
          discountAmount: Number(orderData.discount_amount),
          shippingAmount: Number(orderData.shipping_amount),
          total: Number(orderData.total),
          currency: orderData.currency || 'CHF',
          paymentMethod: orderData.payment_method || 'N/A',
          paymentStatus: orderData.payment_status || 'paid',
          orderTimestamp: orderData.created_at
            ? new Date(orderData.created_at).toLocaleString()
            : new Date().toLocaleString(),
          appUrl: APP_URL,
        }),
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, id: data?.id };
    } catch (err) {
      return logEmailError('sendAdminNotification', err);
    }
  },

  /**
   * Welcome Email (Registration)
   */
  async sendWelcomeEmail(email: string, name: string): Promise<EmailSendResult> {
    try {
      if (!resend) {
        console.log(`[MOCK EMAIL] sendWelcomeEmail to ${email}`);
        return { success: true, id: 'mock-welcome-id' };
      }

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        replyTo: 'hello@ufolabz.com',
        subject: 'Welcome to UFO LABZ! 🚀',
        react: React.createElement(WelcomeEmail, {
          customerName: name,
          appUrl: APP_URL,
        }),
      });

      if (error) throw new Error(error.message);
      return { success: true, id: data?.id };
    } catch (err) {
      return logEmailError('sendWelcomeEmail', err);
    }
  },

  /**
   * Email Verification
   */
  async sendVerificationEmail(email: string, token: string, name?: string): Promise<EmailSendResult> {
    try {
      const url = `${APP_URL}/verify-email?token=${token}`;
      if (!resend) {
        console.log(`[MOCK EMAIL] sendVerificationEmail to ${email} with url ${url}`);
        return { success: true, id: 'mock-verify-id' };
      }

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        replyTo: 'hello@ufolabz.com',
        subject: 'Verify your UFO LABZ email address 🛸',
        react: React.createElement(EmailVerification, {
          customerName: name,
          verificationUrl: url,
        }),
      });

      if (error) throw new Error(error.message);
      return { success: true, id: data?.id };
    } catch (err) {
      return logEmailError('sendVerificationEmail', err);
    }
  },

  /**
   * Password Reset Link
   */
  async sendPasswordReset(email: string, token: string, name?: string): Promise<EmailSendResult> {
    try {
      const url = `${APP_URL}/reset-password?token=${token}`;
      if (!resend) {
        console.log(`[MOCK EMAIL] sendPasswordReset to ${email} with url ${url}`);
        return { success: true, id: 'mock-reset-id' };
      }

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        replyTo: 'hello@ufolabz.com',
        subject: 'Reset navigation password 🔑',
        react: React.createElement(PasswordReset, {
          customerName: name,
          resetUrl: url,
        }),
      });

      if (error) throw new Error(error.message);
      return { success: true, id: data?.id };
    } catch (err) {
      return logEmailError('sendPasswordReset', err);
    }
  },

  /**
   * Order Shipped
   */
  async sendOrderShipped(orderData: any): Promise<EmailSendResult> {
    try {
      if (!resend) {
        console.log(`[MOCK EMAIL] sendOrderShipped to ${orderData.email} for order #${orderData.order_number}`);
        return { success: true, id: 'mock-shipped-id' };
      }

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: orderData.email,
        replyTo: 'hello@ufolabz.com',
        subject: 'Cargo Shipped 📦',
        react: React.createElement(OrderShipped, {
          orderNumber: orderData.order_number,
          customerName: orderData.shipping_address?.fullName || 'Athlete',
          carrier: orderData.shipping_method || 'PostPac Priority',
          trackingNumber: orderData.tracking_number,
          trackingUrl: orderData.tracking_url,
        }),
      });

      if (error) throw new Error(error.message);
      return { success: true, id: data?.id };
    } catch (err) {
      return logEmailError('sendOrderShipped', err);
    }
  },

  /**
   * Order Delivered
   */
  async sendOrderDelivered(orderData: any): Promise<EmailSendResult> {
    try {
      if (!resend) {
        console.log(`[MOCK EMAIL] sendOrderDelivered to ${orderData.email} for order #${orderData.order_number}`);
        return { success: true, id: 'mock-delivered-id' };
      }

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: orderData.email,
        replyTo: 'hello@ufolabz.com',
        subject: 'Cargo Delivered 🏁',
        react: React.createElement(OrderDelivered, {
          orderNumber: orderData.order_number,
          customerName: orderData.shipping_address?.fullName || 'Athlete',
          appUrl: APP_URL,
        }),
      });

      if (error) throw new Error(error.message);
      return { success: true, id: data?.id };
    } catch (err) {
      return logEmailError('sendOrderDelivered', err);
    }
  },

  /**
   * Refund Processed
   */
  async sendRefundProcessed(orderData: any, refundAmount: number): Promise<EmailSendResult> {
    try {
      if (!resend) {
        console.log(`[MOCK EMAIL] sendRefundProcessed to ${orderData.email} for amount ${refundAmount}`);
        return { success: true, id: 'mock-refund-id' };
      }

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: orderData.email,
        replyTo: 'hello@ufolabz.com',
        subject: 'Refund Dispatched 💳',
        react: React.createElement(RefundProcessed, {
          orderNumber: orderData.order_number,
          customerName: orderData.shipping_address?.fullName || 'Athlete',
          refundAmount,
          currency: orderData.currency || 'CHF',
        }),
      });

      if (error) throw new Error(error.message);
      return { success: true, id: data?.id };
    } catch (err) {
      return logEmailError('sendRefundProcessed', err);
    }
  },

  /**
   * Review Request
   */
  async sendReviewRequest(orderData: any, productName: string): Promise<EmailSendResult> {
    try {
      if (!resend) {
        console.log(`[MOCK EMAIL] sendReviewRequest to ${orderData.email} for product ${productName}`);
        return { success: true, id: 'mock-review-req-id' };
      }

      const url = `${APP_URL}/products/${orderData.product_slug || 'catalog'}#write-review`;

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: orderData.email,
        replyTo: 'hello@ufolabz.com',
        subject: `Report Performance Data: ${productName} 📝`,
        react: React.createElement(ReviewRequest, {
          orderNumber: orderData.order_number,
          customerName: orderData.shipping_address?.fullName || 'Athlete',
          productName,
          reviewUrl: url,
        }),
      });

      if (error) throw new Error(error.message);
      return { success: true, id: data?.id };
    } catch (err) {
      return logEmailError('sendReviewRequest', err);
    }
  },

  /**
   * Newsletter Welcome
   */
  async sendNewsletterWelcome(email: string): Promise<EmailSendResult> {
    try {
      if (!resend) {
        console.log(`[MOCK EMAIL] sendNewsletterWelcome to ${email}`);
        return { success: true, id: 'mock-newsletter-id' };
      }

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        replyTo: 'hello@ufolabz.com',
        subject: 'Intel Transmission Logged 📡',
        react: React.createElement(NewsletterWelcome, {
          email,
        }),
      });

      if (error) throw new Error(error.message);
      return { success: true, id: data?.id };
    } catch (err) {
      return logEmailError('sendNewsletterWelcome', err);
    }
  },
};
