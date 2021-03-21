const callAPI = async (method, endPoint, data) => {
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
    response = await fetch(`http://localhost:8080${endPoint}`, init);
  } else
    response = await fetch(`http://localhost:8080${endPoint}`, {
      credentials: "include",
    });
  console.log(response);
  const responseData = await response.json();
  responseData.ok = response.ok;
  return responseData;
};

export default callAPI;
