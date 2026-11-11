-- Migration: Swiss Post Barcode & Shipping Labels for UFO LABZ Orders
-- Adds columns for thermal shipping label storage, tracking number, and shipping workflow

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS shipping_label_url text,
  ADD COLUMN IF NOT EXISTS tracking_number text,
  ADD COLUMN IF NOT EXISTS shipping_status text DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS label_created_at timestamptz;

-- Index for quick tracking lookup
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_shipping_status ON orders(shipping_status);

COMMENT ON COLUMN orders.shipping_label_url IS 'Supabase storage path or signed URL for the Swiss Post A6 thermal shipping label PDF';
COMMENT ON COLUMN orders.tracking_number IS 'Swiss Post parcel tracking code (identCode/barcode)';
COMMENT ON COLUMN orders.shipping_status IS 'Shipping fulfillment stage: none, label_created, shipped, delivered';
COMMENT ON COLUMN orders.label_created_at IS 'Timestamp when the Swiss Post shipping label was first generated';
