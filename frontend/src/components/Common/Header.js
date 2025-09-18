'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { ShoppingCart, User, LogOut, Settings } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          E-Commerce
        </Link>

        <nav className="flex items-center space-x-6">
          <Link href="/products" className="text-gray-600 hover:text-gray-800">
            Products
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Link>
              
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <User className="h-6 w-6 text-gray-600" />
                  <span>{user.firstName}</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Orders
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link href="/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-800">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}