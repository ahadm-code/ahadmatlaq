import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        // EDIT: Replace with your name — shown in browser tab
        title: 'Alex Mercer — Portfolio',
      },
      {
        name: 'description',
        // EDIT: Replace with your personal SEO description
        content: 'Personal portfolio of Alex Mercer — Full-Stack Engineer specializing in React, TypeScript, and modern web technologies.',
      },
    ],
    links: [
      // Google Fonts — Chakra Petch (tech/sci-fi headings) + Mulish (clean body)
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Mulish:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
