import axiosInstance from './axiosInstance'

export const authApi = {
  register: (data) => axiosInstance.post('/auth/register', data).then((r) => r.data),
  login: (data) => axiosInstance.post('/auth/login', data).then((r) => r.data),
  googleLogin: (idToken) => axiosInstance.post('/auth/google', { idToken }).then((r) => r.data),
  verifyEmail: (token) => axiosInstance.post('/auth/verify-email', { token }).then((r) => r.data),
  forgotPassword: (email) => axiosInstance.post('/auth/forgot-password', { email }).then((r) => r.data),
  resetPassword: (token, newPassword) =>
    axiosInstance.post('/auth/reset-password', { token, newPassword }).then((r) => r.data),
  resendVerification: () => axiosInstance.post('/users/me/resend-verification').then((r) => r.data),
}
