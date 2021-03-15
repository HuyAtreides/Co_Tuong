const callAPI = async (method, data, endPoint) => {
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
    response = await fetch(`http://localhost:8080/${endPoint}`, init);
  } else response = await fetch(`http://localhost:8080/${endPoint}`);
  const responseData = await response.json();
  return responseData;
};

export default callAPI;
