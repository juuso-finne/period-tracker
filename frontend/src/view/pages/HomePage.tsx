import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { skipToken, useQueries } from "@tanstack/react-query"
import { getPeriodData } from "../../model/API/periodData"
import { getSettingsData } from "../../model/API/settingsData";
import { getCookie, deleteCookie } from "../../control/cookies";
import { AuthError, type PeriodData, type SettingsData } from "../../model/types";
import { useLogoutMutation } from "../../control/mutations/userMutations";
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

  const logoutSuccess = () =>{
    deleteCookie("session_token");
    deleteCookie("csrf_token");
    deleteCookie("username");
    setLoggedIn(false);
  }

  const logoutFail = (error: Error) => {
    setErrorText(error.message);
  }

  const logoutMutation = useLogoutMutation(logoutSuccess, logoutFail);

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
    <div className="flex flex-col gap-6 items-center text-center">
      <h1 className="text-red-400 text-2xl">Period tracker</h1>
      <p>Welcome, {getCookie("username")}!</p>
      {errorText !== "" ? <p>{errorText}</p> : <></>}
      <Prediction data={data} settings={settings}/>
      <div className="flex flex-col gap-2 items-center">
        <p>{`You are currently marked as ${!currentPeriod ? "not" : ""} on your period`}</p>
        { currentPeriod ?
          <PeriodEndButton setErrorText={setErrorText} data={data}/>
          :
          <PeriodStartButton data={data} setErrorText={setErrorText}/>
        }
      </div>
      <MenuButtons/>
      <button className="btn-primary" onClick={() => logoutMutation.mutate()}>Log out</button>
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

function MenuButtons (){
  const navigate = useNavigate();
  return(
    <div className="flex flex-col gap-2 items-center">
      <button className="btn-primary" onClick={() => navigate("/view")}>View/edit period data</button>
      <button className="btn-primary" onClick={() => navigate("/new")}>Insert period data</button>
      <button className="btn-primary" onClick={() => navigate("/settings")}>Settings</button>
    </div>
  )
}

export default HomePage
