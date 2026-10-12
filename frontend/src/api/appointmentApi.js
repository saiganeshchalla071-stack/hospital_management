import axiosClient from './axiosClient';

export const appointmentApi = {
  getAll: () => axiosClient.get('/appointments'),
  getMyAppointments: () => axiosClient.get('/appointments/my-appointments'),
  getById: (id) => axiosClient.get(`/appointments/${id}`),
  book: (data) => axiosClient.post('/appointments', data),
  updateStatus: (id, status) => axiosClient.patch(`/appointments/${id}/status`, { status }),
  reschedule: (id, data) => axiosClient.put(`/appointments/${id}/reschedule`, data),
};
