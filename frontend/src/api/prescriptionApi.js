import axiosClient from './axiosClient';

export const prescriptionApi = {
  create: (data) => axiosClient.post('/prescriptions', data),
  getById: (id) => axiosClient.get(`/prescriptions/${id}`),
  getByPatientId: (patientId) => axiosClient.get(`/prescriptions/patient/${patientId}`),
};
