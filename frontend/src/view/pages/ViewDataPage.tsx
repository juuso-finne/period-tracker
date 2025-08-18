import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query"
import Calendar from "../components/scripts/Calendar";
import { getPeriodData } from "../../model/API/periodData"
import { useNavigate } from "react-router-dom";
import { CustomDate, type PeriodData } from "../../model/types";
import { AuthError } from "../../model/types";
import DeletePeriodButton from "../components/scripts/DeletePeriodButton";

type ViewMode = "LIST" | "CALENDAR";

function ViewDataPage() {
  const navigate = useNavigate();

  const {isFetching, error, data} = useQuery({
    queryKey: ["getPeriodData"],
    queryFn: getPeriodData
  });

  const [singleSelection, setSingleselection ] = useState<{day: CustomDate, period: number | null}|null>(null);
  const [activePeriod, setActivePeriod] = useState<PeriodData | null>(null);
  const [errorText, setErrorText] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("CALENDAR");

  useEffect(()=>{
    if(isFetching || !data || !singleSelection?.period){
      setActivePeriod(null);
      return
    }
    const selectedPeriod = data.find(p => p.id === singleSelection.period);
    if (!selectedPeriod){
      setActivePeriod(null);
      return;
    }

    setActivePeriod({...selectedPeriod});
  },[singleSelection, data, isFetching])

  useEffect(() => {
    if (!error){
        setErrorText("");
        return;
    }
    if (error instanceof AuthError){
        navigate("/redirect");
    }else{
        setErrorText(error.message)
    }
  }, [error, navigate]);

  if (isFetching){
    return(<p>Loading...</p>)
  }


  return (
    <div className="flex flex-col gap-2 items-center">
      {<p>{errorText}</p>}

      {activePeriod ?
        <div className="border-2 my-4 p-2 min-w-xs w-fit flex flex-col gap-2">
          <div className="flex flex-col gap-1 items-center">
            <p>start: {activePeriod.start.toLocaleDateString(undefined, {timeZone:"UTC"})}</p>
            <p>end: {activePeriod.end?.toLocaleDateString(undefined, {timeZone:"UTC"})}</p>
            <p>notes: {activePeriod.notes}</p>
          </div>
          <div className="flex gap-2 justify-center items-center flex-col sm:flex-row">
            <DeletePeriodButton id={activePeriod.id || 0} setErrorText={setErrorText}/>
            <button className="btn-primary" onClick={() =>navigate(`/editPeriod/${activePeriod.id}`)}>Edit</button>
          </div>
        </div>
        :
        <></>
      }

      <div className="flex gap-2">
        <p>View mode:</p>

        <div>
          <label htmlFor="calendar" className="mr-1">Calendar</label>
          <input type="radio" checked={viewMode==="CALENDAR"} id="calendar" value={"CALENDAR"} name="selectViewMode" onChange={(e) => setViewMode(e.target.value as ViewMode)}/>
        </div>

        <div>
          <label htmlFor="list" className="mr-1">List</label>
          <input type="radio" checked={viewMode==="LIST"} id="list" value={"LIST"} name="selectViewMode" onChange={(e) => setViewMode(e.target.value as ViewMode)}/>
        </div>
      </div>


      { viewMode === "CALENDAR" ?
        <Calendar
        mode="SINGLE"
        periodData={data || []}
        setValue={setSingleselection}
        value={singleSelection}
        />
      :
        <List data={data||[]} setSingleSelection={setSingleselection}/>
      }

      <button className="btn-primary" onClick={() => navigate(-1)}>Back to main</button>

    </div>
  )
}

function List({data, setSingleSelection}:{data: PeriodData[], setSingleSelection:React.Dispatch<React.SetStateAction<{day: CustomDate, period: number | null}|null>>}){
  return(
    <div className="grid grid-cols-[max-content_1fr] p-2 max-w-5xl w-full">
        {data.map(item => (<ListItem data={item} key={item.id} setSingleSelection={setSingleSelection}/>))}
    </div>
  )
}

function ListItem({data, setSingleSelection}:{data: PeriodData, setSingleSelection:React.Dispatch<React.SetStateAction<{day: CustomDate, period: number | null}|null>>}){
  return(
      <div className="contents group" onClick={() => setSingleSelection({day: CustomDate.todayAsUTC(), period: data.id})}>
          <div className="period-item">
            {data.start.toLocaleDateString()} - {data.end?.toLocaleDateString()}
          </div>
          <div className="pl-4 min-w-0 truncate period-item">
            {data.notes}
          </div>
      </div>
  )
}

export default ViewDataPage