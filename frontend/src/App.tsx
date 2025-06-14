import { useState, useEffect } from "react";
import { skipToken, useQuery } from "@tanstack/react-query"
import LoginRegisterPage from "./view/pages/LoginRegisterPage"
import { getPeriodData } from "./model/API/periodData"
import { getCookie } from "./control/cookies";


function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const {isFetching, error, data} = useQuery({
    queryKey: ["getPeriodData"],
    queryFn: loggedIn ? getPeriodData : skipToken
  });

  useEffect(() => {
    if (getCookie("username") !== ""){
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [data])
  return (
    <>
      <h1 className="text-red-400">Period tracker</h1>
      <LoginRegisterPage />
      {isFetching ? <p>Loading...</p> : <></>}
      {error ? <p>{error.message}</p> : <></>}
      {data && data.map((period, i) =>
        <div key = {i} className="border-2 my-4 p-2 w-fit">
          <p>id: {period.id}</p>
          <p>start: {period.start.toISOString().split("T")[0]}</p>
          <p>end: {period.end?.toISOString().split("T")[0]}</p>
          <p>notes: {period.notes}</p>
        </div>
      )}
    </>
  )
}

export default App
