"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Menu, X, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <Link href="/" className="text-xl font-bold">
            PDF Master
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/tools/ocr" className="text-sm font-medium hover:text-primary">
            OCR
          </Link>
          <Link href="/tools/merge-split" className="text-sm font-medium hover:text-primary">
            Merge & Split
          </Link>
          <Link href="/tools/compress" className="text-sm font-medium hover:text-primary">
            Compress
          </Link>
          <Link href="/tools/edit" className="text-sm font-medium hover:text-primary">
            Edit
          </Link>
          <Link href="/tools/convert" className="text-sm font-medium hover:text-primary">
            Convert
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary">
            Pricing
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-6 w-6 rounded-full" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/billing">Billing</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 z-50 bg-background border-b md:hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
        )}
      >
        <div className="container py-4 space-y-4">
          <nav className="flex flex-col space-y-4">
            <Link href="/tools/ocr" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
              OCR
            </Link>
            <Link href="/tools/merge-split" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
              Merge & Split
            </Link>
            <Link href="/tools/compress" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
              Compress
            </Link>
            <Link href="/tools/edit" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
              Edit
            </Link>
            <Link href="/tools/convert" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
              Convert
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
              Pricing
            </Link>
          </nav>

          <div className="flex flex-col space-y-2">
            {user ? (
              <>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/dashboard" onClick={toggleMenu}>
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    logout()
                    toggleMenu()
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login" onClick={toggleMenu}>
                    Log in
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/signup" onClick={toggleMenu}>
                    Sign up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
