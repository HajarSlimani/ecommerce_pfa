import axiosInstance from './axiosInstance'

export const userApi = {
  getProfile: () => axiosInstance.get('/users/me').then((r) => r.data),
  updateProfile: (data) => axiosInstance.patch('/users/me', data).then((r) => r.data),
  changePassword: (data) => axiosInstance.post('/users/me/password', data).then((r) => r.data),
}
