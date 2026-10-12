import axiosClient from './axiosClient';

export const medicalRecordApi = {
  create: (data) => axiosClient.post('/medical-records', data),
  getById: (id) => axiosClient.get(`/medical-records/${id}`),
  getByPatientId: (patientId) => axiosClient.get(`/medical-records/patient/${patientId}`),
};
