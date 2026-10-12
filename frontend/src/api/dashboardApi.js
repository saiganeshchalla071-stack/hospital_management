import axiosClient from './axiosClient';

export const dashboardApi = {
  getAdminStats: () => axiosClient.get('/admin/dashboard'),
  getDoctorStats: () => axiosClient.get('/doctor/dashboard'),
  getPatientStats: () => axiosClient.get('/patient/dashboard'),
};
