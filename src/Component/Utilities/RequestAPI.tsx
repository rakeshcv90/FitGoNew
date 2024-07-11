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
    const postHeader = {
      'Content-type': 'multipart/form-data',
      Accept: 'application/json',
    };
    const getData = {
      method,
      params: data
    }
    try {
      const init =
        method == 'GET'
          ? Object.assign({}, getData, {})
          : Object.assign({}, payload, {postHeader});

      const res = await axios({
        url,
        ...init,
        timeout: 30000,
        withCredentials: true,
      });
      // const res = await axios(url, {
      //   method,
      //   data: method == 'GET' ? {} : payload,
      //   headers: method == 'GET' ? {} : postHeader,
      //   params: method == 'GET' ? data : {},
      // });
      // console.log("AXIOS",res.data)
      if (res.data) {
        callback(handleResponse(res, res.data));
      }
    } catch (error: any) {
      // console.log("AXIOS_ERR",error?.response)
      callback(handleResponse(error, error?.response));
    }
  },
};
