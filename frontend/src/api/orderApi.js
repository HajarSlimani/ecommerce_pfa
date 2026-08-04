import axiosInstance from './axiosInstance'

export const orderApi = {
  checkout: () => axiosInstance.post('/orders').then((r) => r.data),
  getById: (id) => axiosInstance.get(`/orders/${id}`).then((r) => r.data),
  getForUser: (userId, { page = 0, size = 10 } = {}) =>
    axiosInstance.get(`/orders/user/${userId}`, { params: { page, size } }).then((r) => r.data),
}
