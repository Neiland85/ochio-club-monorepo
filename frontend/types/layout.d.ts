// Refactorización para asegurar consistencia con las dependencias
export interface NavigationItem {
  label: string;
  href: string;
  isActive: boolean;
}