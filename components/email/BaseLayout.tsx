import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Link,
  Hr,
  Font,
} from '@react-email/components';

interface BaseLayoutProps {
  previewText: string;
  headline?: string;
  children: React.ReactNode;
}

export default function BaseLayout({
  previewText,
  headline,
  children,
}: BaseLayoutProps) {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="sans-serif"
          fontWeight={400}
          fontStyle="normal"
        />
        <style>{`
          body {
            background-color: #0b0b0f !important;
            margin: 0 auto;
            padding: 0;
            font-family: 'Inter', sans-serif;
            color: #d1d1d6;
          }
          .container {
            margin: 40px auto;
            padding: 32px;
            width: 580px;
            max-width: 100%;
            background-color: #0f0f15;
            border: 1px solid #1e1e26;
            border-radius: 24px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }
          .logo {
            text-align: center;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: 0.15em;
            color: #ffffff;
            margin-bottom: 24px;
          }
          .logo-orange {
            color: #ff8c00;
          }
          .divider {
            border-color: #1e1e26;
            margin: 24px 0;
          }
          .footer {
            margin-top: 32px;
            text-align: center;
            font-size: 11px;
            color: #66667a;
            line-height: 1.6;
          }
          .footer-link {
            color: #ff8c00;
            text-decoration: none;
          }
          .btn-primary {
            display: inline-block;
            background-color: #ff8c00;
            color: #0b0b0f !important;
            font-size: 14px;
            font-weight: 700;
            text-decoration: none;
            text-align: center;
            padding: 12px 24px;
            border-radius: 12px;
            margin: 16px 0;
          }
        `}</style>
      </Head>
      <Preview>{previewText}</Preview>
      <Body>
        <Container className="container">
          {/* Header */}
          <Section>
            <Text className="logo">
              UFO <span className="logo-orange">LABZ</span>
            </Text>
          </Section>

          {headline && (
            <Heading
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#ffffff',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 24px 0',
              }}
            >
              {headline}
            </Heading>
          )}

          {/* Main Content */}
          <Section>{children}</Section>

          <Hr className="divider" />

          {/* Footer */}
          <Section className="footer">
            <Text style={{ margin: '0 0 8px 0' }}>
              Designed in Switzerland · UFO LABZ Premium Performance Technology
            </Text>
            <Text style={{ margin: '0 0 16px 0' }}>
              Have questions? Reply directly to this email or contact us at{' '}
              <Link href="mailto:hello@ufolabz.com" className="footer-link">
                hello@ufolabz.com
              </Link>
            </Text>
            <Text style={{ margin: '0', fontSize: '10px' }}>
              © {new Date().getFullYear()} UFO LABZ. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
