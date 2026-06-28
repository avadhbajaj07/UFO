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

interface AdminNotificationProps {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
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
  paymentMethod: string;
  paymentStatus: string;
  orderTimestamp: string;
  appUrl?: string;
}

export default function AdminNotification({
  orderNumber,
  customerName,
  customerEmail,
  customerPhone,
  shippingAddress,
  billingAddress,
  items,
  subtotal,
  discountAmount,
  shippingAmount,
  total,
  currency = 'CHF',
  paymentMethod,
  paymentStatus,
  orderTimestamp,
  appUrl = 'https://ufolabz.com',
}: AdminNotificationProps) {
  const formatVal = (val: number) => {
    return `${currency} ${val.toFixed(2)}`;
  };

  const finalBilling = billingAddress || shippingAddress;

  return (
    <BaseLayout
      previewText={`🎉 New UFO LABZ Order Received: #${orderNumber}`}
      headline={`New Order Received - #${orderNumber}`}
    >
      <Text style={{ fontSize: '14px', color: '#ff8c00', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'monospace', margin: '0 0 16px 0' }}>
        System Notification: New Order Dispatched
      </Text>

      {/* Customer Contact Card */}
      <Section style={{ backgroundColor: '#0b0b0f', border: '1px solid #1e1e26', borderRadius: '16px', padding: '16px', margin: '0 0 24px 0' }}>
        <Text style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff', margin: '0 0 12px 0' }}>Customer Information</Text>
        <Row style={{ padding: '2px 0' }}>
          <Column style={{ width: '120px' }}><Text style={{ margin: '0', fontSize: '12px', color: '#66667a' }}>Name</Text></Column>
          <Column><Text style={{ margin: '0', fontSize: '12px', color: '#d1d1d6', fontWeight: '700' }}>{customerName}</Text></Column>
        </Row>
        <Row style={{ padding: '2px 0' }}>
          <Column style={{ width: '120px' }}><Text style={{ margin: '0', fontSize: '12px', color: '#66667a' }}>Email</Text></Column>
          <Column><Text style={{ margin: '0', fontSize: '12px', color: '#ff8c00' }}>{customerEmail}</Text></Column>
        </Row>
        {customerPhone && (
          <Row style={{ padding: '2px 0' }}>
            <Column style={{ width: '120px' }}><Text style={{ margin: '0', fontSize: '12px', color: '#66667a' }}>Phone</Text></Column>
            <Column><Text style={{ margin: '0', fontSize: '12px', color: '#d1d1d6' }}>{customerPhone}</Text></Column>
          </Row>
        )}
        <Row style={{ padding: '2px 0' }}>
          <Column style={{ width: '120px' }}><Text style={{ margin: '0', fontSize: '12px', color: '#66667a' }}>Order Date</Text></Column>
          <Column><Text style={{ margin: '0', fontSize: '12px', color: '#d1d1d6', fontFamily: 'monospace' }}>{orderTimestamp}</Text></Column>
        </Row>
        <Row style={{ padding: '2px 0' }}>
          <Column style={{ width: '120px' }}><Text style={{ margin: '0', fontSize: '12px', color: '#66667a' }}>Method / Status</Text></Column>
          <Column><Text style={{ margin: '0', fontSize: '12px', color: '#d1d1d6' }}>{paymentMethod.toUpperCase()} · <span style={{ color: '#00ff88', fontWeight: '700' }}>{paymentStatus.toUpperCase()}</span></Text></Column>
        </Row>
      </Section>

      {/* Products list */}
      <Text style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff', margin: '0 0 8px 0' }}>Cart Items</Text>
      
      {items.map((item, idx) => (
        <div key={`${item.sku}-${idx}`}>
          <Section style={{ padding: '6px 0' }}>
            <Row>
              <Column>
                <Text style={{ margin: '0', fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>
                  {item.name}
                </Text>
                <Text style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#66667a' }}>
                  {item.variantName} · Qty: {item.quantity} · SKU: {item.sku}
                </Text>
              </Column>
              <Column style={{ textAlign: 'right', verticalAlign: 'middle', width: '120px' }}>
                <Text style={{ margin: '0', fontSize: '12px', color: '#d1d1d6', fontFamily: 'monospace' }}>
                  {item.quantity} x {formatVal(item.price)}
                </Text>
              </Column>
            </Row>
          </Section>
          <Hr style={{ borderColor: '#1e1e26', margin: '6px 0' }} />
        </div>
      ))}

      {/* Pricing summary */}
      <Section style={{ margin: '16px 0 24px 0' }}>
        <Row style={{ padding: '2px 0' }}>
          <Column><Text style={{ margin: '0', fontSize: '12px', color: '#66667a' }}>Subtotal</Text></Column>
          <Column style={{ textAlign: 'right' }}><Text style={{ margin: '0', fontSize: '12px', color: '#d1d1d6', fontFamily: 'monospace' }}>{formatVal(subtotal)}</Text></Column>
        </Row>
        {discountAmount > 0 && (
          <Row style={{ padding: '2px 0' }}>
            <Column><Text style={{ margin: '0', fontSize: '12px', color: '#66667a' }}>Discount</Text></Column>
            <Column style={{ textAlign: 'right' }}><Text style={{ margin: '0', fontSize: '12px', color: '#ff2244', fontFamily: 'monospace' }}>-{formatVal(discountAmount)}</Text></Column>
          </Row>
        )}
        <Row style={{ padding: '2px 0' }}>
          <Column><Text style={{ margin: '0', fontSize: '12px', color: '#66667a' }}>Shipping Charge</Text></Column>
          <Column style={{ textAlign: 'right' }}><Text style={{ margin: '0', fontSize: '12px', color: '#d1d1d6', fontFamily: 'monospace' }}>{formatVal(shippingAmount)}</Text></Column>
        </Row>
        <Hr style={{ borderColor: '#1e1e26', margin: '6px 0' }} />
        <Row style={{ padding: '2px 0' }}>
          <Column><Text style={{ margin: '0', fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>Order Total</Text></Column>
          <Column style={{ textAlign: 'right' }}><Text style={{ margin: '0', fontSize: '14px', fontWeight: '700', color: '#ffffff', fontFamily: 'monospace' }}>{formatVal(total)}</Text></Column>
        </Row>
      </Section>

      {/* Addresses */}
      <Row style={{ margin: '0 0 24px 0' }}>
        <Column style={{ width: '50%', paddingRight: '8px', verticalAlign: 'top' }}>
          <Text style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff', margin: '0 0 6px 0' }}>Shipping Destination</Text>
          <Text style={{ fontSize: '11px', color: '#d1d1d6', lineHeight: '1.4', margin: '0' }}>
            {shippingAddress.fullName}<br />
            {shippingAddress.addressLine1}<br />
            {shippingAddress.addressLine2 ? <>{shippingAddress.addressLine2}<br /></> : null}
            {shippingAddress.zipCode} {shippingAddress.city}<br />
            {shippingAddress.canton}
          </Text>
        </Column>
        <Column style={{ width: '50%', paddingLeft: '8px', verticalAlign: 'top' }}>
          <Text style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff', margin: '0 0 6px 0' }}>Billing Address</Text>
          <Text style={{ fontSize: '11px', color: '#d1d1d6', lineHeight: '1.4', margin: '0' }}>
            {finalBilling.fullName}<br />
            {finalBilling.addressLine1}<br />
            {finalBilling.addressLine2 ? <>{finalBilling.addressLine2}<br /></> : null}
            {finalBilling.zipCode} {finalBilling.city}<br />
            {finalBilling.canton}
          </Text>
        </Column>
      </Row>

      {/* Action links */}
      <Section style={{ textAlign: 'center', margin: '32px 0 16px 0' }}>
        <Link
          href={`${appUrl}/admin`}
          className="btn-primary"
          style={{ marginRight: '12px' }}
        >
          Open Admin Panel
        </Link>
        <Link
          href={`${appUrl}/admin?orderId=${orderNumber}`}
          style={{
            display: 'inline-block',
            backgroundColor: 'transparent',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '700',
            textDecoration: 'none',
            textAlign: 'center',
            padding: '10px 20px',
            border: '2px solid #1e1e26',
            borderRadius: '12px',
            margin: '16px 0',
          }}
        >
          Order details
        </Link>
      </Section>
    </BaseLayout>
  );
}
