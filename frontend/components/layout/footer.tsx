"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import type { FooterProps } from "@/types/layout"

export default function Footer({ className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    productos: [
      { label: "Ochíos Tradicionales", href: "/productos/tradicionales" },
      { label: "Ochíos Especiales", href: "/productos/especiales" },
      { label: "Ochíos de Temporada", href: "/productos/temporada" },
      { label: "Packs y Ofertas", href: "/productos/ofertas" },
    ],
    empresa: [
      { label: "Sobre Nosotros", href: "/sobre-nosotros" },
      { label: "Nuestra Historia", href: "/historia" },
      { label: "Trabaja con Nosotros", href: "/empleos" },
      { label: "Prensa", href: "/prensa" },
    ],
    soporte: [
      { label: "Centro de Ayuda", href: "/ayuda" },
      { label: "Política de Devoluciones", href: "/devoluciones" },
      { label: "Términos y Condiciones", href: "/terminos" },
      { label: "Política de Privacidad", href: "/privacidad" },
    ],
  }

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  ]

  return (
    <footer className={`bg-muted/50 border-t ${className}`}>
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ochío Club</h3>
            <p className="text-sm text-muted-foreground">
              Los mejores ochíos artesanales, hechos con amor y tradición desde 1985.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Calle Principal 123, Ciudad</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+34 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@ochioclub.com</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Productos</h3>
            <ul className="space-y-2">
              {footerLinks.productos.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Soporte</h3>
            <ul className="space-y-2">
              {footerLinks.soporte.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Ochío Club. Todos los derechos reservados.
          </div>

          {/* Social links */}
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
