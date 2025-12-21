import Image from 'next/image'
import { Twitter, Linkedin, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-200 bg-linear-to-b from-white to-slate-50/50 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-linear(circle, #1e293b 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Main Footer Content */}
        <div className="py-12 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Logo & Copyright */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold bg-linear-to-r from-slate-700 via-slate-900 to-slate-700 bg-clip-text text-transparent">
                  MonkArc
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Build daily. Track progress. Achieve mastery.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {/* Twitter */}
              <a 
                href="https://twitter.com/monkarc" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="absolute -inset-0.5 bg-linear-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:to-transparent rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 -z-10" />
                <Twitter className="h-5 w-5 text-slate-600 group-hover:text-blue-500 transition-colors" />
              </a>

              {/* LinkedIn */}
              <a 
                href="https://linkedin.com/company/monkarc" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-lg"
              >
                <div className="absolute -inset-0.5 bg-linear-to-br from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/20 group-hover:to-transparent rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 -z-10" />
                <Linkedin className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Developer Attribution */}
        <div className="border-t border-slate-200/60 py-6 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-sm text-slate-500 order-2 sm:order-1">
              © {new Date().getFullYear()} MonkArc. All rights reserved.
            </div>

            {/* Developed By */}
            <div className="flex items-center gap-2 text-sm text-slate-600 order-1 sm:order-2">
              <span className="text-slate-500">Developed by</span>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200/60 hover:border-slate-300 transition-all duration-300 group cursor-pointer">
                <div className="relative w-5 h-5 rounded-full overflow-hidden bg-slate-100">
                  <Image
                    src="/monkcodi.svg" // Replace with your icon path
                    alt="MonkCodi"
                    width={20}
                    height={20}
                    className="object-cover"
                  />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                  MonkCodi
                </span>
              </div>
              <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}