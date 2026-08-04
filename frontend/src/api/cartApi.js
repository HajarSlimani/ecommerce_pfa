import axiosInstance from './axiosInstance'

export const cartApi = {
  get: () => axiosInstance.get('/cart').then((r) => r.data),
  addItem: (data) => axiosInstance.post('/cart/items', data).then((r) => r.data),
  removeItem: (itemId) => axiosInstance.delete(`/cart/items/${itemId}`).then((r) => r.data),
}
