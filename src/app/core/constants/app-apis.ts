export const App_Apis = {
  products: {
    get: `api/v1/products`,
  },
  categories: {
    get: `api/v1/categories`,
  },
  subcategories: {
    get: `api/v1/subcategories`,
    getByCategory: (categoryId: string) =>
      `api/v1/categories/${categoryId}/subcategories`,
  },
  brands: {
    get: `api/v1/brands`,
  },
  auth: {
    login: `api/v1/auth/signin`,
    register: `api/v1/auth/signup`,
    forgotPassword: `api/v1/auth/forgotPasswords`,
    verifyResetCode: `api/v1/auth/verifyResetCode`,
    resetPassword: `api/v1/auth/resetPassword`,
    verifyToken: `api/v1/auth/verifyToken`,
  },
  users: {
    updateMe: `api/v1/users/updateMe`,
    changePassword: `api/v1/users/changeMyPassword`,
  },
  cart: {
    base: `api/v2/cart`,
    item: (productId: string) => `api/v2/cart/${productId}`,
    applyCoupon: `api/v2/cart/applyCoupon`,
  },
  wishlist: {
    base: `api/v1/wishlist`,
    item: (productId: string) => `api/v1/wishlist/${productId}`,
  },
  addresses: {
    base: `api/v1/addresses`,
    item: (addressId: string) => `api/v1/addresses/${addressId}`,
  },
  orders: {
    cash: (cartId: string) => `api/v2/orders/${cartId}`,
    checkoutSession: (cartId: string) =>
      `api/v1/orders/checkout-session/${cartId}`,
    userOrders: (userId: string) => `api/v1/orders/user/${userId}`,
  },
  reviews: {
    byProduct: (productId: string) => `api/v1/products/${productId}/reviews`,
    base: `api/v1/reviews`,
    item: (reviewId: string) => `api/v1/reviews/${reviewId}`,
  },
};