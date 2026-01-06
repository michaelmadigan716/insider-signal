import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Insider Signal | 6-Week Swing Trade Intelligence',
  description: 'Track the biggest insider buys and find the best insiders to copy for swing trades. Real-time SEC Form 4 data.',
  keywords: 'insider trading, SEC Form 4, swing trading, stock market, insider buys',
  openGraph: {
    title: 'Insider Signal',
    description: 'Track insider buys for 6-week swing trades',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Grid background */}
        <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
        
        {/* Glow orbs */}
        <div 
          className="fixed top-[10%] right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, rgba(0, 255, 136, 0.08) 0%, transparent 70%)' }}
        />
        <div 
          className="fixed bottom-[20%] left-[5%] w-[300px] h-[300px] rounded-full pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, rgba(0, 200, 255, 0.06) 0%, transparent 70%)' }}
        />
        
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
