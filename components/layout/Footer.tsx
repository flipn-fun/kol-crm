'use client'

import { Github } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>© {currentYear} Meme KOLs Platform.</span>
            <span>All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/aidai524/kol-crm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <a
              href="/#"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/#"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 