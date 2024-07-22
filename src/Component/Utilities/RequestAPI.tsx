import axios from 'axios';

const isEmpty = (obj: any) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

const handleResponse = (response: any, jsonResponse: any) => {
  const jsonRes = isEmpty(jsonResponse) ? {} : jsonResponse;
  const {status} = response;
  const {errors = {}} = Object.assign({}, jsonRes);
  return {status, data: jsonResponse, errors};
};

export const RequestAPI = {
  async makeRequest(
    method: 'GET' | 'POST',
    url: string,
    data: Object,
    callback: Function,
  ) {
    const payload = new FormData();

    if (method == 'POST') {
      Object.entries(data).map((item: Array<string>) =>
        payload.append(item[0], item[1]),
      );
    }
    const headers = {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    };
    const getData = {
      method: 'GET',
      params: data,
    };
    const postData = {
      method: 'POST',
      data: payload,
    };
    const init =
      method == 'GET'
        ? Object.assign({}, getData, {})
        : Object.assign({}, postData, {headers});
    try {

      const res = await axios({
        url,
        ...init,
        timeout: 30000,
        withCredentials: true,
      });
      console.log("AXIOS",res.data)
      if (res.data) {
        callback(handleResponse(res, res.data));
      }
    } catch (error: any) {
      // console.log("AXIOS_ERR",error, init)
      callback(handleResponse(error?.response, error));
    }
  },
};
