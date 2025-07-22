import { useQuery } from "@tanstack/react-query"
import { getPeriodData } from "../../model/API/periodData"
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { AuthError, CustomDate } from "../../model/types";
import { usePostPeriodMutation } from "../../control/mutations/periodDataMutations";
import validate from "../../control/validation";
import Calendar from "../components/scripts/Calendar";

export default function NewPeriodPage() {
    const navigate = useNavigate();
    const {isFetching, error, data} = useQuery({
        queryKey: ["getPeriodData"],
        queryFn: getPeriodData
    });

    const [searchParams] = useSearchParams();

    const [selectionStart, setSelectionStart] = useState<CustomDate|null>(null);
    const [selectionEnd, setSelectionEnd] = useState<CustomDate|null>(null);
    const [currentPeriod, setCurrentPeriod] = useState<boolean>(searchParams.get("current") === "true");
    const [errorText, setErrorText] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [validSubmission, setValidSubmission] = useState<boolean>(false);

    const memoizedFixedEnd = useMemo(
    () => (currentPeriod ? CustomDate.todayAsUTC() : null),
    [currentPeriod]);

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

    useEffect(() =>{
        if (!selectionStart || (!selectionEnd && !currentPeriod)){
            setErrorText("Please select a start date and an end date.");
            setValidSubmission(false);
            return;
        }

        const {message, isValid} = validate({id:null, start:selectionStart, end:selectionEnd, notes:""}, data || []);
        setErrorText(message);
        setValidSubmission(isValid);
    }, [selectionStart, selectionEnd, currentPeriod, data]);

    const submissionSuccess = () => {
        navigate("/");
    }

    const submissionFail = (error: Error) =>{
        if (error instanceof AuthError){
            navigate("/redirect");
        }else{
            setErrorText(error.message);
        }
    }

    const mutation = usePostPeriodMutation(submissionSuccess, submissionFail);

    if (isFetching){
        return(<div>Loading...</div>)
    }



    return (
    <>
        <div>Starting date: {selectionStart?.toLocaleDateString(undefined, {timeZone:"UTC"})}</div>
        <div>End date: {selectionEnd?.toLocaleDateString(undefined, {timeZone:"UTC"})}</div>
        <div>Notes:</div>
        <textarea onChange={e => setNotes(e.target.value)}/>
        <div className="flex gap-2">
            <input type="checkbox" onChange={e => setCurrentPeriod(e.target.checked)} defaultChecked={currentPeriod}/>
            <p>I'm currently on this period</p>
        </div>

        <div>{errorText}</div>

        <Calendar
        mode = "RANGE"
        periodData={data || []}
        selectionStart={selectionStart}
        setSelectionStart={setSelectionStart}
        selectionEnd={selectionEnd}
        setSelectionEnd={setSelectionEnd}
        fixedEnd={memoizedFixedEnd}
        />

        <div className="flex justify-center gap-5">
            <button
                className="btn-primary"
                disabled={!validSubmission}
                onClick={() => {mutation.mutate({
                    id: null,
                    start: selectionStart!,
                    end: currentPeriod ? null : selectionEnd,
                    notes})}}
            >
                Submit
            </button>
            <button className="btn-primary">Cancel</button>
        </div>
    </>
    )
}
