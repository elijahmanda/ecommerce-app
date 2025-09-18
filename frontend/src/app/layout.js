import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/Common/Header'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'E-Commerce Store',
  description: 'A modern e-commerce platform built with Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}