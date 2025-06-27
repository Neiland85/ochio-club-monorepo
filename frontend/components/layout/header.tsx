'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, User, LogOut, Settings, ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { HeaderProps, NavigationItem } from '@/types/layout';

const defaultNavigationItems: NavigationItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/productos' },
  { label: 'Pedidos', href: '/pedidos' },
  { label: 'Contacto', href: '/contacto' },
];

export default function Header({
  user,
  navigationItems = defaultNavigationItems,
  onLogin,
  onLogout,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    }
  };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.avatar || '/placeholder.svg'}
              alt={user?.name}
            />
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const NavigationLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav
      className={
        mobile ? 'flex flex-col space-y-4' : 'hidden md:flex md:space-x-8'
      }
    >
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            item.isActive ? 'text-primary' : 'text-muted-foreground'
          } ${mobile ? 'text-base' : ''}`}
          onClick={() => mobile && setIsMobileMenuOpen(false)}
        >
          {item.icon && <item.icon className="mr-2 h-4 w-4 inline" />}
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8">
              <Image
                src="/placeholder.svg?height=32&width=32&query=ochio+logo"
                alt="Ochío Club"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold">Ochío Club</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationLinks />

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Cart button */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                2
              </span>
            </Button>

            {/* User menu or login button */}
            {user ? (
              <UserMenu />
            ) : (
              <Button onClick={handleLogin} size="sm">
                Iniciar Sesión
              </Button>
            )}

            {/* Mobile menu button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menú de navegación</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <NavigationLinks mobile />
                  {!user && (
                    <div className="mt-6 pt-6 border-t">
                      <Button onClick={handleLogin} className="w-full">
                        Iniciar Sesión
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
