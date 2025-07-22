import { useQuery } from "@tanstack/react-query"
import { getPeriodData } from "../../model/API/periodData"
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { AuthError, CustomDate } from "../../model/types";
import Calendar from "../components/scripts/Calendar";

export default function NewPeriodPage() {
    const navigate = useNavigate();
    const {isFetching, error, data} = useQuery({
        queryKey: ["getPeriodData"],
        queryFn: getPeriodData
    });

    const [searchParams, _] = useSearchParams();

    const [selectionStart, setSelectionStart] = useState<CustomDate|null>(null);
    const [selectionEnd, setSelectionEnd] = useState<CustomDate|null>(null);
    const [currentPeriod, setCurrentPeriod] = useState<boolean>(searchParams.get("current") === "true");
    const [errorText, setErrorText] = useState<string>("");
    const [notes, setNotes] = useState<string>("");

    const memoizedFixedEnd = useMemo(
    () => (currentPeriod ? CustomDate.todayAsUTC() : null),
    [currentPeriod]);

    useEffect(()=>{
        console.log(notes);
    },[notes])

    useEffect(() => {
    if (error && error instanceof AuthError){
        navigate("/redirect");
    }
    }, [error, navigate]);

    if (isFetching){
        return(<div>Loading...</div>)
    }

    return (
    <>
        {error ? <p>{error.message}</p> : <></>}
        <div>Starting date: {selectionStart?.toLocaleDateString(undefined, {timeZone:"UTC"})}</div>
        <div>End date: {selectionEnd?.toLocaleDateString(undefined, {timeZone:"UTC"})}</div>
        <div>Notes:</div>
        <textarea onChange={e => setNotes(e.target.value)}/>
        <div>I'm currently on this period</div>
        <input type="checkbox" onChange={e => setCurrentPeriod(e.target.checked)} defaultChecked={currentPeriod}/>
            <Calendar
            mode = "RANGE"
            periodData={data || []}
            selectionStart={selectionStart}
            setSelectionStart={setSelectionStart}
            selectionEnd={selectionEnd}
            setSelectionEnd={setSelectionEnd}
            fixedEnd={memoizedFixedEnd}
            />
    </>
    )
}
