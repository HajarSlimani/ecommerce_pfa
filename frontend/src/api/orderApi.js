import axiosInstance from './axiosInstance'

export const orderApi = {
  checkout: () => axiosInstance.post('/orders').then((r) => r.data),
  getById: (id) => axiosInstance.get(`/orders/${id}`).then((r) => r.data),
  confirmPayment: (id) => axiosInstance.post(`/orders/${id}/confirm-payment`).then((r) => r.data),
  getForUser: (userId, { page = 0, size = 10 } = {}) =>
    axiosInstance.get(`/orders/user/${userId}`, { params: { page, size } }).then((r) => r.data),

  // Vue admin : toutes les commandes, tous utilisateurs confondus.
  adminGetAll: ({ page = 0, size = 20 } = {}) =>
    axiosInstance.get('/admin/orders', { params: { page, size } }).then((r) => r.data),

  adminUpdateStatus: (orderId, status) =>
    axiosInstance.patch(`/admin/orders/${orderId}/status`, { status }).then((r) => r.data),
}
