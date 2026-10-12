import axiosClient from './axiosClient';

export const doctorApi = {
  getAll: () => axiosClient.get('/doctors'),
  getActive: () => axiosClient.get('/doctors/active'),
  search: (departmentId, query) => axiosClient.get('/doctors/search', {
    params: { departmentId, query }
  }),
  getById: (id) => axiosClient.get(`/doctors/${id}`),
  create: (data) => axiosClient.post('/doctors', data),
  update: (id, data) => axiosClient.put(`/doctors/${id}`, data),
  toggleStatus: (id, enabled) => axiosClient.patch(`/doctors/${id}/status`, { enabled }),
};
