import axiosClient from './axiosClient';

export const billingApi = {
  getAll: () => axiosClient.get('/bills'),
  getById: (id) => axiosClient.get(`/bills/${id}`),
  getByPatientId: (patientId) => axiosClient.get(`/bills/patient/${patientId}`),
  create: (data) => axiosClient.post('/bills', data),
  updatePaymentStatus: (id, paymentStatus, paymentMethod) => axiosClient.patch(`/bills/${id}/payment-status`, {
    paymentStatus,
    paymentMethod,
  }),
};
