import axiosClient from './axiosClient';

export const patientApi = {
  getAll: () => axiosClient.get('/patients'),
  getById: (id) => axiosClient.get(`/patients/${id}`),
  update: (id, data) => axiosClient.put(`/patients/${id}`, data),
  toggleStatus: (id, enabled) => axiosClient.patch(`/patients/${id}/status`, { enabled }),
};
