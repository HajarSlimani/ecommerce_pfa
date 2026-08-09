import axiosInstance from './axiosInstance'

export const productApi = {
  list: ({ category, page = 0, size = 12, sort } = {}) =>
    axiosInstance
      .get('/products', { params: { category: category || undefined, page, size, sort } })
      .then((r) => r.data),

  // Endpoint dédié Boutique : filtre grade + recherche texte + tri par prix,
  // avec minPrice calculé — le endpoint /products classique ne fait pas la
  // jointure vers les unités donc ne renvoie pas de prix.
  search: ({ category, grade, q, sort, page = 0, size = 12 } = {}) =>
    axiosInstance
      .get('/products/search', {
        params: {
          category: category || undefined,
          grade: grade || undefined,
          q: q || undefined,
          sort: sort || undefined,
          page,
          size,
        },
      })
      .then((r) => r.data),

  getDetail: (id) => axiosInstance.get(`/products/${id}`).then((r) => r.data),

  create: (data) => axiosInstance.post('/products', data).then((r) => r.data),

  update: (id, data) => axiosInstance.patch(`/products/${id}`, data).then((r) => r.data),

  addUnit: (productId, data) =>
    axiosInstance.post(`/products/${productId}/units`, data).then((r) => r.data),

  getUnits: (productId) => axiosInstance.get(`/products/${productId}/units`).then((r) => r.data),

  updateUnitStatus: (productId, unitId, status) =>
    axiosInstance.patch(`/products/${productId}/units/${unitId}`, { status }).then((r) => r.data),

  setColorImage: (productId, color, imageUrl) =>
    axiosInstance.put(`/products/${productId}/color-images`, { color, imageUrl }).then((r) => r.data),
}
