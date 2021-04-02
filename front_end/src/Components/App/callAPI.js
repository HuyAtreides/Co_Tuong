const callAPI = async (method, endPoint, data) => {
  try {
    let response;
    if (method === "POST") {
      const init = {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      response = await fetch(`http://192.168.1.6:8080/api/${endPoint}`, init);
    } else
      response = await fetch(`http://192.168.1.6:8080/api/${endPoint}`, {
        credentials: "include",
      });
    const responseData = await response.json();
    responseData.ok = response.ok;
    return responseData;
  } catch (err) {
    throw new Error(err.message);
  }
};

export default callAPI;
