import './globals.css'
import { Providers } from '@/components/Providers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'rabbit tracker',
  description: 'Track your daily habits',
}

export default function RootLayout({
children,
}: {
children: React.ReactNode
}) {
return (
  <html lang="en">
    <body>
      <Providers>
        {children}
      </Providers>
    </body>
  </html>
)
}