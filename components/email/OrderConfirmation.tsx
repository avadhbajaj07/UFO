import * as React from 'react';
import {
  Text,
  Link,
  Hr,
  Row,
  Column,
  Section,
} from '@react-email/components';
import BaseLayout from './BaseLayout';

interface OrderConfirmationProps {
  orderNumber: string;
  customerName: string;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    zipCode: string;
    canton: string;
  };
  billingAddress?: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    zipCode: string;
    canton: string;
  };
  items: Array<{
    name: string;
    variantName: string;
    quantity: number;
    price: number;
    sku: string;
  }>;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  total: number;
  currency: string;
  estimatedDelivery?: string;
  appUrl?: string;
}

export default function OrderConfirmation({
  orderNumber,
  customerName,
  shippingAddress,
  billingAddress,
  items,
  subtotal,
  discountAmount,
  shippingAmount,
  total,
  currency = 'CHF',
  estimatedDelivery,
  appUrl = 'https://ufolabz.com',
}: OrderConfirmationProps) {
  const formatVal = (val: number) => {
    return `${currency} ${val.toFixed(2)}`;
  };

  const finalBilling = billingAddress || shippingAddress;

  return (
    <BaseLayout
      previewText={`Your UFO LABZ order ${orderNumber} is confirmed!`}
      headline="Order Confirmed 🎉"
    >
      <Text style={{ fontSize: '15px', lineHeight: '1.6', margin: '0 0 16px 0', color: '#d1d1d6' }}>
        Dear {customerName},
      </Text>
      <Text style={{ fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px 0', color: '#d1d1d6' }}>
        Thank you for choosing UFO LABZ. Your athletic parameters have been locked in, and our lab is currently preparing your cargo. 
        A summary of your order transaction details is detailed below.
      </Text>

      {/* Order Info Summary */}
      <Section style={{ backgroundColor: '#0b0b0f', border: '1px solid #1e1e26', borderRadius: '16px', padding: '16px', margin: '0 0 24px 0' }}>
        <Row>
          <Column style={{ width: '50%' }}>
            <Text style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#66667a', textTransform: 'uppercase', fontFamily: 'monospace' }}>Order Number</Text>
            <Text style={{ margin: '0', fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>#{orderNumber}</Text>
          </Column>
          {estimatedDelivery && (
            <Column style={{ width: '50%' }}>
              <Text style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#66667a', textTransform: 'uppercase', fontFamily: 'monospace' }}>Estimated Delivery</Text>
              <Text style={{ margin: '0', fontSize: '14px', fontWeight: '700', color: '#00ff88' }}>{estimatedDelivery}</Text>
            </Column>
          )}
        </Row>
      </Section>

      {/* Items Section */}
      <Text style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff', margin: '0 0 12px 0' }}>Items Ordered</Text>
      
      {items.map((item, idx) => (
        <div key={`${item.sku}-${idx}`}>
          <Section style={{ padding: '8px 0' }}>
            <Row>
              <Column>
                <Text style={{ margin: '0', fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>
                  {item.name}
                </Text>
                <Text style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#66667a' }}>
                  {item.variantName} · Qty: {item.quantity} · SKU: {item.sku}
                </Text>
              </Column>
              <Column style={{ textAlign: 'right', verticalAlign: 'middle', width: '100px' }}>
                <Text style={{ margin: '0', fontSize: '13px', fontWeight: '700', color: '#ffffff', fontFamily: 'monospace' }}>
                  {formatVal(item.price * item.quantity)}
                </Text>
              </Column>
            </Row>
          </Section>
          <Hr style={{ borderColor: '#1e1e26', margin: '8px 0' }} />
        </div>
      ))}

      {/* Pricing Totals */}
      <Section style={{ margin: '16px 0 24px 0' }}>
        <Row style={{ padding: '4px 0' }}>
          <Column><Text style={{ margin: '0', fontSize: '13px', color: '#66667a' }}>Subtotal</Text></Column>
          <Column style={{ textAlign: 'right' }}><Text style={{ margin: '0', fontSize: '13px', color: '#d1d1d6', fontFamily: 'monospace' }}>{formatVal(subtotal)}</Text></Column>
        </Row>
        {discountAmount > 0 && (
          <Row style={{ padding: '4px 0' }}>
            <Column><Text style={{ margin: '0', fontSize: '13px', color: '#66667a' }}>Discount Applied</Text></Column>
            <Column style={{ textAlign: 'right' }}><Text style={{ margin: '0', fontSize: '13px', color: '#ff2244', fontFamily: 'monospace' }}>-{formatVal(discountAmount)}</Text></Column>
          </Row>
        )}
        <Row style={{ padding: '4px 0' }}>
          <Column><Text style={{ margin: '0', fontSize: '13px', color: '#66667a' }}>Shipping</Text></Column>
          <Column style={{ textAlign: 'right' }}><Text style={{ margin: '0', fontSize: '13px', color: '#d1d1d6', fontFamily: 'monospace' }}>{formatVal(shippingAmount)}</Text></Column>
        </Row>
        <Hr style={{ borderColor: '#1e1e26', margin: '8px 0' }} />
        <Row style={{ padding: '4px 0' }}>
          <Column><Text style={{ margin: '0', fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>Total (incl. VAT)</Text></Column>
          <Column style={{ textAlign: 'right' }}><Text style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#ffffff', fontFamily: 'monospace' }}>{formatVal(total)}</Text></Column>
        </Row>
      </Section>

      {/* Addresses */}
      <Row style={{ margin: '0 0 24px 0' }}>
        <Column style={{ width: '50%', paddingRight: '12px', verticalAlign: 'top' }}>
          <Text style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff', margin: '0 0 8px 0' }}>Shipping Address</Text>
          <Text style={{ fontSize: '12px', color: '#d1d1d6', lineHeight: '1.5', margin: '0' }}>
            {shippingAddress.fullName}<br />
            {shippingAddress.addressLine1}<br />
            {shippingAddress.addressLine2 ? <>{shippingAddress.addressLine2}<br /></> : null}
            {shippingAddress.zipCode} {shippingAddress.city}<br />
            {shippingAddress.canton}
          </Text>
        </Column>
        <Column style={{ width: '50%', paddingLeft: '12px', verticalAlign: 'top' }}>
          <Text style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff', margin: '0 0 8px 0' }}>Billing Address</Text>
          <Text style={{ fontSize: '12px', color: '#d1d1d6', lineHeight: '1.5', margin: '0' }}>
            {finalBilling.fullName}<br />
            {finalBilling.addressLine1}<br />
            {finalBilling.addressLine2 ? <>{finalBilling.addressLine2}<br /></> : null}
            {finalBilling.zipCode} {finalBilling.city}<br />
            {finalBilling.canton}
          </Text>
        </Column>
      </Row>

      {/* Actions */}
      <Section style={{ textAlign: 'center', margin: '32px 0 16px 0' }}>
        <Link
          href={`${appUrl}/account`}
          className="btn-primary"
        >
          Manage Order & Shipments
        </Link>
      </Section>
    </BaseLayout>
  );
}
