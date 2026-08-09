import axiosInstance from './axiosInstance'

export const adminApi = {
  getStats: () => axiosInstance.get('/admin/stats').then((r) => r.data),
  getUsers: ({ page = 0, size = 20 } = {}) =>
    axiosInstance.get('/admin/users', { params: { page, size } }).then((r) => r.data),
}
