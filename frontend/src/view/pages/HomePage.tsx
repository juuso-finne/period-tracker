import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { skipToken, useQueries } from "@tanstack/react-query"
import Calendar from "../components/scripts/Calendar";
import { getPeriodData } from "../../model/API/periodData"
import { getSettingsData } from "../../model/API/settingsData";
import { getCookie } from "../../control/cookies";
import { CustomDate, AuthError, type PeriodData, type SettingsData } from "../../model/types";
import * as stats from "../../control/periodStats"

function HomePage() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const [selectionStart, setSelectionStart] = useState<CustomDate|null>(new CustomDate(Date.UTC(2025, 6, 1)));
  const [selectionEnd, setSelectionEnd] = useState<CustomDate|null>(CustomDate.todayAsUTC());
  const [singleSelection, setSingleselection ] = useState<{day: CustomDate, period: number | null}|null>(null);
  const [currentPeriod, setCurrentPeriod] = useState<boolean>(false)

  useEffect(()=>{
    console.log(singleSelection)
  },[singleSelection])

  useEffect(()=>{
    if(currentPeriod){
      setSelectionEnd(CustomDate.todayAsUTC());
    }
  },[currentPeriod])

  useEffect(()=>{
    if (!selectionEnd || !selectionStart)
      return
    console.log(`${selectionStart?.isoStringDateOnly()} - ${selectionEnd?.isoStringDateOnly()}`)

    console.log(CustomDate.todayAsUTC().isBetween(selectionStart, selectionEnd))
  },[selectionEnd, selectionStart])

  const results = useQueries({
    queries: [
      {
        queryKey: ["getPeriodData"],
        queryFn: loggedIn ? getPeriodData : skipToken
      },
      {
        queryKey: ["getSettingsData"],
        queryFn: loggedIn ? getSettingsData : skipToken
      }
    ]
  });

  const isFetching = results.some(query => query.isFetching);
  const error = results.find(query => query.error) ? results.find(query => query.error)?.error : null;
  const data = results[0].data || [];
  const settings = results[1].data || null;

  useEffect(() => {
    setLoggedIn(getCookie("username") !== "");
  }, []);

  useEffect(() => {
    if (error && error instanceof AuthError){
      setLoggedIn(false);
    }
  }, [error]);

  const memoizedFixedEnd = useMemo(
  () => (currentPeriod ? CustomDate.todayAsUTC() : null),
  [currentPeriod]
);

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
      <div>I'm currently on this period</div>
      <input type="checkbox" onChange={e => setCurrentPeriod(e.target.checked)} defaultChecked={currentPeriod}/>
      <div>Selection start: {selectionStart?.isoStringDateOnly()}</div>
      <div>Selection end: {selectionEnd?.isoStringDateOnly()}</div>

      <Prediction data={data} settings={settings}/>

      <Calendar
        mode = "RANGE"
        periodData={data || []}
        selectionStart={selectionStart}
        setSelectionStart={setSelectionStart}
        selectionEnd={selectionEnd}
        setSelectionEnd={setSelectionEnd}
        fixedEnd={memoizedFixedEnd}
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

function Prediction({data, settings}: {data: PeriodData[], settings: SettingsData|null}){
  if(!data || !settings){
    return(<></>)
  }

  if (data.length === 0){
    return(<p>No previous data to base a prediction on.</p>)
  }

  const cycleLengths = stats.getCycleLengths(data);
  const latestPeriodStart = data[0].start;
  const parameters = {
    plusMinus: settings.plusMinus,
    cycleLength: settings. cycleLength
  }

  if (!settings.useDefaults && cycleLengths.length >= settings.threshold){
    parameters.plusMinus = Math.round(stats.standardDeviation(cycleLengths));
    parameters.cycleLength = Math.round(stats.mean(cycleLengths));
  }

  const median = latestPeriodStart.daysBeforeOrAfter(parameters.cycleLength);
  const earliest = median.daysBeforeOrAfter(parameters.plusMinus * -1);
  const latest = median.daysBeforeOrAfter(parameters.plusMinus);
  return(
    <div>
      <p>Your next period will likely start between {earliest.toLocaleDateString()} and {latest.toLocaleDateString()}</p>
    </div>
  )
}

export default HomePage
