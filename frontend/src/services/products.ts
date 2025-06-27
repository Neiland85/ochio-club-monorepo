// Ejemplo de servicio para obtener productos (ochíos) desde el backend
import api from '@/src/api'; // Mejor usar ruta absoluta si tienes el alias @ configurado

export async function getProducts() {
  const response = await api.get('/products');
  return response.data;
}

// Puedes agregar más funciones para pedidos, usuarios, etc.
