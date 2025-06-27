'use client';

import { useState } from 'react';

// Datos de ejemplo
const initialSalesSummary = {
  totalSales: 12450.75,
  todaySales: 750.25,
  weekSales: 3250.5,
  monthSales: 9875.3,
  percentageChange: 12.5,
  currency: '€',
};

const initialOrdersSummary = {
  totalOrders: 156,
  pendingOrders: 8,
  completedOrders: 142,
  cancelledOrders: 6,
  percentageChange: 8.2,
};

const initialProductsSummary = {
  totalProducts: 24,
  activeProducts: 20,
  outOfStockProducts: 2,
  featuredProducts: 5,
};

const initialOrders = [
  {
    id: 'OCH-1001',
    customerName: 'María García',
    customerEmail: 'maria@ejemplo.com',
    customerPhone: '666123456',
    products: [
      { id: 'p1', name: 'Ochío Tradicional', quantity: 6, price: 1.2 },
      { id: 'p2', name: 'Ochío de Chocolate', quantity: 4, price: 1.5 },
    ],
    total: 13.2,
    status: 'confirmed',
    date: new Date(2023, 4, 15, 10, 30),
    deliveryAddress: 'Calle Mayor 12, Úbeda',
  },
  {
    id: 'OCH-1002',
    customerName: 'Antonio Martínez',
    customerEmail: 'antonio@ejemplo.com',
    customerPhone: '666789012',
    products: [
      { id: 'p3', name: 'Ochío de Almendra', quantity: 12, price: 1.4 },
    ],
    total: 16.8,
    status: 'preparing',
    date: new Date(2023, 4, 15, 11, 15),
    deliveryAddress: 'Avenida de Andalucía 5, Úbeda',
    notes: 'Entregar en la puerta trasera',
  },
  {
    id: 'OCH-1003',
    customerName: 'Laura Sánchez',
    customerEmail: 'laura@ejemplo.com',
    customerPhone: '666345678',
    products: [
      { id: 'p1', name: 'Ochío Tradicional', quantity: 8, price: 1.2 },
      { id: 'p4', name: 'Ochío de Canela', quantity: 6, price: 1.4 },
      { id: 'p5', name: 'Ochío Relleno de Crema', quantity: 4, price: 1.6 },
    ],
    total: 25.6,
    status: 'delivered',
    date: new Date(2023, 4, 14, 16, 45),
    deliveryAddress: 'Plaza del Ayuntamiento 3, Úbeda',
  },
  {
    id: 'OCH-1004',
    customerName: 'Carlos Rodríguez',
    customerEmail: 'carlos@ejemplo.com',
    customerPhone: '666901234',
    products: [
      { id: 'p2', name: 'Ochío de Chocolate', quantity: 10, price: 1.5 },
    ],
    total: 15.0,
    status: 'on_the_way',
    date: new Date(2023, 4, 15, 9, 20),
    deliveryAddress: 'Calle San Francisco 8, Úbeda',
  },
  {
    id: 'OCH-1005',
    customerName: 'Isabel López',
    customerEmail: 'isabel@ejemplo.com',
    customerPhone: '666567890',
    products: [
      { id: 'p1', name: 'Ochío Tradicional', quantity: 4, price: 1.2 },
      { id: 'p3', name: 'Ochío de Almendra', quantity: 4, price: 1.4 },
      { id: 'p6', name: 'Ochío Integral', quantity: 4, price: 1.3 },
    ],
    total: 15.6,
    status: 'pending',
    date: new Date(2023, 4, 15, 12, 10),
    deliveryAddress: 'Calle Rastro 15, Úbeda',
  },
];

const initialProducts = [
  {
    id: 'p1',
    name: 'Ochío Tradicional',
    description:
      'El clásico ochío de Úbeda, elaborado con masa de pan y aceite de oliva virgen extra.',
    price: 1.2,
    imageUrl: '/placeholder.svg?height=100&width=100&query=ochio+tradicional',
    category: 'Tradicionales',
    isActive: true,
    isOutOfStock: false,
    isFeatured: true,
    ingredients: [
      'Harina',
      'Agua',
      'Aceite de oliva virgen extra',
      'Sal',
      'Levadura',
    ],
    nutritionalInfo: {
      calories: 120,
      protein: 3,
      carbs: 18,
      fat: 4,
    },
  },
  {
    id: 'p2',
    name: 'Ochío de Chocolate',
    description: 'Delicioso ochío con pepitas de chocolate en su interior.',
    price: 1.5,
    imageUrl: '/placeholder.svg?height=100&width=100&query=ochio+chocolate',
    category: 'Especiales',
    isActive: true,
    isOutOfStock: false,
    isFeatured: true,
    ingredients: [
      'Harina',
      'Agua',
      'Aceite de oliva virgen extra',
      'Sal',
      'Levadura',
      'Chocolate',
    ],
    nutritionalInfo: {
      calories: 150,
      protein: 3,
      carbs: 22,
      fat: 6,
    },
  },
  {
    id: 'p3',
    name: 'Ochío de Almendra',
    description: 'Ochío con almendras troceadas, perfecto para el desayuno.',
    price: 1.4,
    imageUrl: '/placeholder.svg?height=100&width=100&query=ochio+almendra',
    category: 'Especiales',
    isActive: true,
    isOutOfStock: false,
    isFeatured: false,
    ingredients: [
      'Harina',
      'Agua',
      'Aceite de oliva virgen extra',
      'Sal',
      'Levadura',
      'Almendras',
    ],
    nutritionalInfo: {
      calories: 140,
      protein: 4,
      carbs: 18,
      fat: 6,
    },
  },
  {
    id: 'p4',
    name: 'Ochío de Canela',
    description:
      'Ochío con un toque de canela, ideal para los amantes de los sabores especiados.',
    price: 1.4,
    imageUrl: '/placeholder.svg?height=100&width=100&query=ochio+canela',
    category: 'Especiales',
    isActive: true,
    isOutOfStock: false,
    isFeatured: false,
    ingredients: [
      'Harina',
      'Agua',
      'Aceite de oliva virgen extra',
      'Sal',
      'Levadura',
      'Canela',
    ],
    nutritionalInfo: {
      calories: 130,
      protein: 3,
      carbs: 19,
      fat: 4,
    },
  },
  {
    id: 'p5',
    name: 'Ochío Relleno de Crema',
    description:
      'Ochío relleno de crema pastelera, una delicia para los más golosos.',
    price: 1.6,
    imageUrl: '/placeholder.svg?height=100&width=100&query=ochio+crema',
    category: 'Rellenos',
    isActive: true,
    isOutOfStock: false,
    isFeatured: true,
    ingredients: [
      'Harina',
      'Agua',
      'Aceite de oliva virgen extra',
      'Sal',
      'Levadura',
      'Crema pastelera',
    ],
    nutritionalInfo: {
      calories: 180,
      protein: 3,
      carbs: 25,
      fat: 7,
    },
  },
  {
    id: 'p6',
    name: 'Ochío Integral',
    description: 'Versión saludable elaborada con harina integral y semillas.',
    price: 1.3,
    imageUrl: '/placeholder.svg?height=100&width=100&query=ochio+integral',
    category: 'Saludables',
    isActive: true,
    isOutOfStock: false,
    isFeatured: false,
    ingredients: [
      'Harina integral',
      'Agua',
      'Aceite de oliva virgen extra',
      'Sal',
      'Levadura',
      'Semillas',
    ],
    nutritionalInfo: {
      calories: 110,
      protein: 4,
      carbs: 16,
      fat: 4,
    },
  },
  {
    id: 'p7',
    name: 'Ochío Sin Gluten',
    description: 'Especial para celíacos, elaborado con harinas sin gluten.',
    price: 1.8,
    imageUrl: '/placeholder.svg?height=100&width=100&query=ochio+sin+gluten',
    category: 'Saludables',
    isActive: true,
    isOutOfStock: true,
    isFeatured: false,
    ingredients: [
      'Harina de arroz',
      'Harina de maíz',
      'Agua',
      'Aceite de oliva virgen extra',
      'Sal',
      'Levadura sin gluten',
    ],
    nutritionalInfo: {
      calories: 130,
      protein: 2,
      carbs: 20,
      fat: 4,
    },
  },
  {
    id: 'p8',
    name: 'Ochío de Aceitunas',
    description: 'Con trozos de aceituna negra, un sabor muy mediterráneo.',
    price: 1.4,
    imageUrl: '/placeholder.svg?height=100&width=100&query=ochio+aceitunas',
    category: 'Especiales',
    isActive: false,
    isOutOfStock: false,
    isFeatured: false,
    ingredients: [
      'Harina',
      'Agua',
      'Aceite de oliva virgen extra',
      'Sal',
      'Levadura',
      'Aceitunas negras',
    ],
    nutritionalInfo: {
      calories: 135,
      protein: 3,
      carbs: 18,
      fat: 5,
    },
  },
];

export default function DashboardExample() {
  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);
  const [salesSummary, setSalesSummary] = useState(initialSalesSummary);
  const [ordersSummary, setOrdersSummary] = useState(initialOrdersSummary);
  const [productsSummary, setProductsSummary] = useState(
    initialProductsSummary
  );

  // Handlers
  const handleAddProduct = () => {
    toast({
      title: 'Añadir producto',
      description: 'Funcionalidad para añadir un nuevo producto',
    });
  };

  const handleEditProduct = (product) => {
    toast({
      title: 'Editar producto',
      description: `Editando: ${product.name}`,
    });
  };

  const handleDeleteProduct = (productId) => {
    toast({
      title: 'Eliminar producto',
      description: `¿Estás seguro de que deseas eliminar este producto?`,
      variant: 'destructive',
    });
  };

  const handleUpdateOrderStatus = (orderId, status) => {
    // Actualizar el estado del pedido
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);

    toast({
      title: 'Estado actualizado',
      description: `Pedido ${orderId} actualizado a: ${status}`,
    });
  };

  const handleViewOrderDetails = (orderId) => {
    toast({
      title: 'Ver detalles del pedido',
      description: `Viendo detalles del pedido: ${orderId}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BakeryDashboard
        salesSummary={salesSummary}
        ordersSummary={ordersSummary}
        productsSummary={productsSummary}
        recentOrders={orders}
        products={products}
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onViewOrderDetails={handleViewOrderDetails}
      />
    </div>
  );
}
