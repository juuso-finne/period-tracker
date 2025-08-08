import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query"
import Calendar from "../components/scripts/Calendar";
import { getPeriodData } from "../../model/API/periodData"
import { useNavigate } from "react-router-dom";
import type { CustomDate, PeriodData } from "../../model/types";
import { AuthError } from "../../model/types";
import DeletePeriodButton from "../components/scripts/DeletePeriodButton";

function ViewDataPage() {
  const navigate = useNavigate();

  const {isFetching, error, data} = useQuery({
    queryKey: ["getPeriodData"],
    queryFn: getPeriodData
  });

  const [singleSelection, setSingleselection ] = useState<{day: CustomDate, period: number | null}|null>(null);
  const [activePeriod, setActivePeriod] = useState<PeriodData | null>(null);
  const [errorText, setErrorText] = useState<string>("");

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
    <>
      {<p>{errorText}</p>}

    {activePeriod ?
      <div className="border-2 my-4 p-2 min-w-sm w-fit flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <p>start: {activePeriod.start.isoStringDateOnly()}</p>
          <p>end: {activePeriod.end?.isoStringDateOnly()}</p>
          <p>notes: {activePeriod.notes}</p>
        </div>
        <div className="flex gap-2 justify-center">
          <DeletePeriodButton id={activePeriod.id || 0} setErrorText={setErrorText}/>
          <button className="btn-primary" onClick={() =>navigate(`/editPeriod/${activePeriod.id}`)}>Edit</button>
        </div>
      </div>
      :
      <></>
}

      <Calendar
        mode="SINGLE"
        periodData={data || []}
        setValue={setSingleselection}
        value={singleSelection}
        />
    </>
  )
}

export default ViewDataPage