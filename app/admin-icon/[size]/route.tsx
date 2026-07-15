import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export function GET(
  _request: NextRequest,
  { params }: { params: { size: string } }
) {
  const requestedSize = Number(params.size)
  const size = [180, 192, 512].includes(requestedSize) ? requestedSize : 192

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          background: 'radial-gradient(circle at 50% 35%, #123d28 0%, #050807 66%)',
          color: '#00ff88',
          border: `${Math.max(8, Math.round(size * 0.045))}px solid #00ff88`,
          borderRadius: `${Math.round(size * 0.2)}px`,
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ fontSize: size * 0.29, fontWeight: 900, letterSpacing: -size * 0.025 }}>
          UFO
        </div>
        <div style={{ fontSize: size * 0.105, fontWeight: 700, letterSpacing: size * 0.018 }}>
          ADMIN
        </div>
      </div>
    ),
    {
      width: size,
      height: size,
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    }
  )
}
