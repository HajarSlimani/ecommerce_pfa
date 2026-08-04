import axiosInstance from './axiosInstance'

export const productApi = {
  list: ({ category, page = 0, size = 12 } = {}) =>
    axiosInstance
      .get('/products', { params: { category: category || undefined, page, size } })
      .then((r) => r.data),

  getDetail: (id) => axiosInstance.get(`/products/${id}`).then((r) => r.data),

  create: (data) => axiosInstance.post('/products', data).then((r) => r.data),

  addUnit: (productId, data) =>
    axiosInstance.post(`/products/${productId}/units`, data).then((r) => r.data),
}
