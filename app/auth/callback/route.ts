import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const errorParam = searchParams.get('error')
  const errorDesc = searchParams.get('error_description')
  const requestedNext = searchParams.get('next')

  const next =
    requestedNext?.startsWith('/') && !requestedNext.startsWith('//')
      ? requestedNext
      : '/affiliate'

  // If Supabase returned an explicit error parameter
  if (errorDesc || errorParam) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDesc || errorParam || 'Authentication failed')}`
    )
  }

  const redirectUrl = new URL(next, origin)
  const response = NextResponse.redirect(redirectUrl)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qhwbmniqplygipszkhcb.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_lzpNvYE27E-8hXthNbNosQ_adMOOA8x'

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  // 1. Handle PKCE code flow (e.g. Google OAuth, modern email links)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return response
    }
    console.error('[auth/callback] exchangeCodeForSession error:', error)
  }

  // 2. Handle token_hash verification flow (e.g. Supabase Magic Links, OTPs)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      return response
    }
    console.error('[auth/callback] verifyOtp error:', error)
  }

  // 3. Client-side hash fragment fallback (e.g. #access_token=...&refresh_token=...)
  // Since hash fragments are not sent to server, render lightweight client handler
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Authenticating with UFO LABZ...</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <style>
    body {
      background-color: #05050a;
      color: #00FF88;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      text-align: center;
    }
    .spinner {
      width: 44px;
      height: 44px;
      border: 3px solid rgba(0, 255, 136, 0.2);
      border-top-color: #00FF88;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 20px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .text {
      font-size: 13px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="spinner"></div>
  <div class="text">Authenticating Commander Session...</div>
  <script>
    try {
      const client = window.supabase.createClient(
        '${supabaseUrl}',
        '${supabaseKey}'
      );
      client.auth.getSession().then(({ data, error }) => {
        if (data && data.session) {
          window.location.replace('${next}');
        } else {
          setTimeout(() => {
            client.auth.getSession().then(({ data: d2 }) => {
              if (d2 && d2.session) {
                window.location.replace('${next}');
              } else {
                window.location.replace('/login?error=Authentication+expired+or+invalid');
              }
            });
          }, 600);
        }
      }).catch(() => {
        window.location.replace('/login?error=Could+not+complete+authentication');
      });
    } catch (e) {
      window.location.replace('/login');
    }
  </script>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
