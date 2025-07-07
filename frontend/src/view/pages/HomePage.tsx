import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { skipToken, useQuery } from "@tanstack/react-query"
import Calendar from "../components/scripts/Calendar";
import { getPeriodData } from "../../model/API/periodData"
import { getCookie } from "../../control/cookies";
import { CustomDate, AuthError } from "../../model/types";

function HomePage() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const [selectionStart, setSelectionStart] = useState<CustomDate|null>(null);
  const [selectionEnd, setSelectionEnd] = useState<CustomDate|null>(null);
  const [singleSelection, setSingleselection ] = useState<{day: CustomDate, period: number | null}|null>(null);

  useEffect(()=>{
    console.log(singleSelection)
  },[singleSelection])

  useEffect(()=>{
    console.log(`${selectionStart?.isoStringDateOnly()} - ${selectionEnd?.isoStringDateOnly()}`)
    if (!selectionEnd || !selectionStart)
      return
    console.log(CustomDate.todayAsUTC().isBetween(selectionStart, selectionEnd))
  },[selectionEnd, selectionStart])

  const {isFetching, error, data} = useQuery({
    queryKey: ["getPeriodData"],
    queryFn: loggedIn ? getPeriodData : skipToken
  });

  useEffect(() => {
    setLoggedIn(getCookie("username") !== "");
  }, []);

  useEffect(() => {
    if (error && error instanceof AuthError){
      setLoggedIn(false);
    }
  }, [error]);

  if (!loggedIn){
    return(<div>
      <p>Please <Link to={"login"}>log in or register</Link></p>
    </div>)
  }

  return (
    <>
      <h1 className="text-red-400">Period tracker</h1>
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
      <div>Welcome, {getCookie("username")}!</div>
      <Calendar
        mode = "RANGE"
        periodData={data || []}
        selectionStart={selectionStart}
        setSelectionStart={setSelectionStart}
        selectionEnd={selectionEnd}
        setSelectionEnd={setSelectionEnd}
      />

      <Calendar
        mode="SINGLE"
        periodData={data || []}
        setValue={setSingleselection}
        value={singleSelection}
        />
    </>
  )
}

export default HomePage
