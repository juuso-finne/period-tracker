import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { skipToken, useQueries } from "@tanstack/react-query"
import { getPeriodData } from "../../model/API/periodData"
import { getSettingsData } from "../../model/API/settingsData";
import { getCookie } from "../../control/cookies";
import { AuthError, type PeriodData, type SettingsData } from "../../model/types";
import PeriodStartButton from "../components/scripts/PeriodStartButton";
import PeriodEndButton from "../components/scripts/PeriodEndButton";
import * as stats from "../../control/periodStats"

function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [currentPeriod, setCurrentPeriod] = useState(false);

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
    if (!error){
      setErrorText("");
      return;
    }

    if (error instanceof AuthError){
      setLoggedIn(false);
      return;
    }

    setErrorText(error.message);
  }, [error]);

  useEffect(() => {
    if(!results[0].data || results[0].data?.length === 0){
      return;
    }
    setCurrentPeriod(results[0].data[0].end === null);
  },[results])

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
      <p>Welcome, {getCookie("username")}!</p>
      <p>{errorText}</p>
      <Prediction data={data} settings={settings}/>
      <p>{`You are currently ${!currentPeriod ? "not" : ""} on your period`}</p>
      <MenuButtons currentPeriod={currentPeriod} setErrorText={setErrorText} latestPeriod={data[0]}/>
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

function MenuButtons ({latestPeriod, currentPeriod, setErrorText}:{latestPeriod: PeriodData, currentPeriod:boolean, setErrorText: React.Dispatch<React.SetStateAction<string>>}){
  return(<div className="flex flex-col gap-2">
      <PeriodStartButton currentPeriod={currentPeriod} setErrorText={setErrorText}/>
      <PeriodEndButton currentPeriod={currentPeriod} setErrorText={setErrorText} data={latestPeriod}/>
  </div>)
}

export default HomePage
