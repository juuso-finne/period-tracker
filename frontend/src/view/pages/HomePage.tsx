import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { skipToken, useQueries } from "@tanstack/react-query"
import { getPeriodData } from "../../model/API/periodData"
import { getSettingsData } from "../../model/API/settingsData";
import { getCookie } from "../../control/cookies";
import { AuthError, type PeriodData, type SettingsData } from "../../model/types";
import * as stats from "../../control/periodStats"

function HomePage() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

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

  if (!loggedIn){
    return(<div>
      <p>Please <Link to={"login"}>log in or register</Link></p>
    </div>)
  }

  if(isFetching){
    return(<p>Loading...</p>)
  }



  return (
    <div className="flex flex-col gap-4 items-center text-center">
      <h1 className="text-red-400 text-2xl">Period tracker</h1>
      <div>Welcome, {getCookie("username")}!</div>
      <Prediction data={data} settings={settings}/>
    </div>
  )
}

function Prediction({data, settings}: {data: PeriodData[], settings: SettingsData|null}){
  if(!data || !settings){
    return(<></>)
  }

  if (data.length === 0){
    return(<p>No previous data to base a prediction on.</p>)
  }

  const {earliest, latest} = stats.nextPeriod(data, settings);
  const {daysElapsed, phase, ovulationDay} = stats.cyclePhase(data, settings);
  return(
    <div>
      <p>It has been <span className="font-bold">{daysElapsed}</span> day{daysElapsed === 1 ? "" : "s"} since the start of your cycle.</p>
      <p>You are likely in the <span className="font-bold">{phase}</span> phase of your cycle. </p>
      <p>Next ovulation most likely happens around <span className="font-bold"> {ovulationDay.toLocaleDateString(undefined, {timeZone:"UTC"})}</span>.</p>
      <p>
        Your next period will likely start between
        <span className="font-bold"> {earliest.toLocaleDateString(undefined, {timeZone:"UTC"})} </span>
        and
        <span className="font-bold"> {latest.toLocaleDateString(undefined, {timeZone:"UTC"})}</span>
      </p>
    </div>
  )
}

export default HomePage
