import { baseURL } from '../..';

const callAPI = async (method, endPoint, data, isFile) => {
  try {
    let response;
    if (method === 'POST') {
      const init = {
        method: 'POST',
        credentials: 'include',
        headers: isFile
          ? {}
          : {
              'Content-Type': 'application/json',
            },
        body: isFile ? data : JSON.stringify(data),
      };
      response = await fetch(`${baseURL}/${endPoint}`, init);
    } else
      response = await fetch(`${baseURL}/${endPoint}`, {
        credentials: 'include',
      });
    const responseData = await response.json();
    responseData.ok = response.ok;
    return responseData;
  } catch (err) {
    throw new Error(err.message);
  }
};

export default callAPI;
