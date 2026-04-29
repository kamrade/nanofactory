// middleware.ts

import { NextRequest, NextResponse } from 'next/server'

const PLATFORM_HOSTS: string[] = [ 'app.olala.beauty' ]

const DOMAIN_TO_PROJECT: Record<string, string> = {
  'olala.beauty': 'my-website-01',
  'www.olala.beauty': 'my-website-01',
}

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone()

  const hostHeader = req.headers.get('host') || ''
  const hostname = hostHeader?.split(':')[0]?.toLowerCase()

  if (!hostname) {
    return NextResponse.next()
  }

  // Не трогаем основной домен платформы
  if (PLATFORM_HOSTS.includes(hostname)) {
    return NextResponse.next()
  }

  const projectSlug = DOMAIN_TO_PROJECT[hostname]

  if (!projectSlug) {
    return NextResponse.next()
  }

  const originalPath = url.pathname

  url.pathname = `/p/${projectSlug}` // ${originalPath === '/' ? '' : originalPath}`

  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    /*
     * Не запускаем middleware для:
     * - api routes
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - статических файлов
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}