import { uploadApi } from 'sdk/api';
import { UPLOAD_STATUSES } from 'constants/upload';

export default {
  uploadImage: async (file) => {
    const { data: creds } = await uploadApi.getCredentials({ filename: file.name, type: 'image' });
    const formData = new FormData();
    const searchParams = new URLSearchParams(creds.presigned_url.split('?').pop());
    formData.append('acl', 'public-read');
    searchParams.forEach((value, key) => { formData.append(key, value); });
    formData.append('file', file);
    try {
      await uploadApi.uploadImage(creds.presigned_url, file);
    } catch (error) {
      await uploadApi.sendCompleteStatus(creds.id, UPLOAD_STATUSES.FAILED);
      throw error;
    }
    const result = await uploadApi.sendCompleteStatus(creds.id, UPLOAD_STATUSES.COMPLETED);
    return result;
  },

  uploadMenuItems: async (restairantId, file, requestOptions) => {
    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadApi.uploadFile(restairantId, formData, requestOptions);
    return result;
  },
};
