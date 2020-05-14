import HttpModel from './HttpModel';
import axios from 'axios';

export default {
  getCredentials: async data => HttpModel.post('/upload/credentials', data),

  uploadImage: async (url, file) => axios.put(url, file),

  uploadFile: async (restaurantId, file, requestOptions) => HttpModel.post(`/restaurants/${restaurantId}/menu-items/upload`, file, requestOptions),

  sendCompleteStatus: async (id, status) => HttpModel.post(`/upload/complete/${id}`, { status }),
};
