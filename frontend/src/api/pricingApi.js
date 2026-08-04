import axiosInstance from './axiosInstance'

export const pricingApi = {
  getHistory: ({ productId, page = 0, size = 20 } = {}) =>
    axiosInstance
      .get('/admin/pricing/history', { params: { productId: productId || undefined, page, size } })
      .then((r) => r.data),

  getImpact: (from, to) =>
    axiosInstance.get('/admin/pricing/impact', { params: { from, to } }).then((r) => r.data),

  recalculate: (productId, grade) =>
    axiosInstance
      .post(`/admin/pricing/recalculate/${productId}`, null, { params: { grade } })
      .then((r) => r.data),
}
