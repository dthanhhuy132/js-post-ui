import axiosClient from './axiosClient';

const postApi = {
  getAll(params) {
    const url = '/posts';
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/posts/${id}`;
    return axiosClient.get(url);
  },

  add(newPostData) {
    const url = '/posts';
    return axiosClient.post(url, newPostData);
  },

  update(data) {
    const url = `/posts/${data.id}`;
    return axiosClient.patch(url, data);
  },

  addFormData(data) {
    const url = 'with-thumbnail/posts';
    return axiosClient.post(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateFormData(data) {
    // neu su dung form-data thi khong the su dung "." de lay du lieu
    const url = `with-thumbnail/posts/${data.get('id')}`;
    return axiosClient.patch(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  remove(id) {
    const url = `/posts/${id}`;
    return axiosClient.delete(url);
  },
};

export default postApi;
