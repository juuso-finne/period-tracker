import { useState, useEffect } from "react";
import { skipToken, useQuery } from "@tanstack/react-query"
import LoginRegisterPage from "./view/pages/LoginRegisterPage"
import Calendar from "./view/components/scripts/Calendar";
import { getPeriodData } from "./model/API/periodData"
import { getCookie } from "./control/cookies";
import { CustomDate } from "./model/types";


function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const [selectionStart, setSelectionStart] = useState<CustomDate|null>(CustomDate.UTCFromValues(2025, 5, 4))
  const [selectionEnd, setSelectionEnd] = useState<CustomDate|null>(null)

  useEffect(()=>{
    console.log(`${selectionStart?.isoStringDateOnly()} - ${selectionEnd?.isoStringDateOnly()}`)
  },[selectionEnd, selectionStart])

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
  }, [])
  return (
    <>
      <h1 className="text-red-400">Period tracker</h1>
      <LoginRegisterPage />
      {isFetching ? <p>Loading...</p> : <></>}
      {error ? <p>{error.message}</p> : <></>}
      {(data || []).map((period) =>
        <div key = {period.id} className="border-2 my-4 p-2 w-fit">
          <p>id: {period.id}</p>
          <p>start: {period.start.isoStringDateOnly()}</p>
          <p>end: {period.end?.isoStringDateOnly()}</p>
          <p>notes: {period.notes}</p>
        </div>
      )}
      <Calendar
        periodData={data || []}
        selectionStart={selectionStart}
        setSelectionStart={setSelectionStart}
        selectionEnd={selectionEnd}
        setSelectionEnd={setSelectionEnd}
      />
    </>
  )
}

export default App
