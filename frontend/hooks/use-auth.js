export const useAuth = () => {
  return {
    user: {
      name: "María García",
      email: "maria.garcia@email.com",
      phone: "+34 666 123 456",
      address: {
        street: "Calle Real, 25, 2º A",
        city: "Úbeda",
        postalCode: "23400",
        province: "Jaén",
      },
      avatar: "/placeholder.svg?height=80&width=80&query=user",
    },
    isLoading: false,
    isAuthenticated: true,
    logout: () => console.log("Logout"),
  };
};
