import axiosInstance from './axiosInstance'

export const reviewApi = {
  list: (productId, { page = 0, size = 10 } = {}) =>
    axiosInstance.get(`/products/${productId}/reviews`, { params: { page, size } }).then((r) => r.data),

  getSummary: (productId) =>
    axiosInstance.get(`/products/${productId}/reviews/summary`).then((r) => r.data),

  getEligibility: (productId) =>
    axiosInstance.get(`/products/${productId}/reviews/eligibility`).then((r) => r.data),

  submit: (productId, { rating, comment }) =>
    axiosInstance.post(`/products/${productId}/reviews`, { rating, comment }).then((r) => r.data),

  deleteOwn: (productId) =>
    axiosInstance.delete(`/products/${productId}/reviews/me`).then((r) => r.data),
}
