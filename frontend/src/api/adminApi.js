import axiosInstance from './axiosInstance'

export const adminApi = {
  getStats: () => axiosInstance.get('/admin/stats').then((r) => r.data),
  getLowStock: (threshold = 3) =>
    axiosInstance.get('/admin/stats/low-stock', { params: { threshold } }).then((r) => r.data),
  getTopProducts: (limit = 5) =>
    axiosInstance.get('/admin/stats/top-products', { params: { limit } }).then((r) => r.data),
  getSalesByCategory: () => axiosInstance.get('/admin/stats/sales-by-category').then((r) => r.data),
  getUsers: ({ page = 0, size = 20 } = {}) =>
    axiosInstance.get('/admin/users', { params: { page, size } }).then((r) => r.data),
}
