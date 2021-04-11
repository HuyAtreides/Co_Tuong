import { useEffect, useState } from "react";
import callAPI from "./callAPI";
import { authenticateUser } from "./context.js";
import { useDispatch, useSelector } from "react-redux";

const useFetchData = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.appState.isAuthenticated
  );
  const [waitForResponse, setWaitForResponse] = useState(false);

  useEffect(async () => {
    try {
      if (!isAuthenticated) {
        setWaitForResponse(true);
        const { user, message, opponentID } = await callAPI(
          "GET",
          "api/user",
          null
        );

        if (user) {
          authenticateUser(dispatch, user, opponentID);
        } else if (message) dispatch({ type: "setLoginError", value: message });
        setWaitForResponse(false);
      }
    } catch (err) {
      dispatch({ type: "setLoginError", value: err.message });
    }
  }, [isAuthenticated]);

  return [waitForResponse, setWaitForResponse];
};

export default useFetchData;
