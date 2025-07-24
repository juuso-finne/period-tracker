import { useQuery } from "@tanstack/react-query"
import { getPeriodData } from "../../model/API/periodData"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState, useRef } from "react";
import { AuthError, CustomDate } from "../../model/types";
import { usePutPeriodMutation } from "../../control/mutations/periodDataMutations";
import validate from "../../control/validation";
import Calendar from "../components/scripts/Calendar";

export default function EditPeriodPage() {
    const navigate = useNavigate();
    const {isFetching, error, data} = useQuery({
        queryKey: ["getPeriodData"],
        queryFn: getPeriodData,
        refetchOnWindowFocus: false
    });

    const notesRef = useRef<HTMLTextAreaElement>(null)

    const params = useParams();

    const [selectionStart, setSelectionStart] = useState<CustomDate|null>(null);
    const [selectionEnd, setSelectionEnd] = useState<CustomDate|null>(null);
    const [currentPeriod, setCurrentPeriod] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>("");
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

    useEffect(() => {
        if(!data){
            return;
        }

        if(!params.id || params.id === ""){
            navigate("/");
            return;
        }


        const period = data.find(p => p.id === parseInt(params.id!));
        if(!period){
            navigate("/");
            return;
        }

        setSelectionEnd(period.end);
        setSelectionStart(period.start);
        setCurrentPeriod(period.end === null);
        if (notesRef.current) {
            notesRef.current.value = period.notes;
        }

    },[data, params, navigate])

    useEffect(() =>{
        if (!selectionStart || (!selectionEnd && !currentPeriod)){
            setErrorText("Please select a start date and an end date.");
            setValidSubmission(false);
            return;
        }

        const {message, isValid} = validate({id:Number(params.id), start:selectionStart, end:selectionEnd, notes:""}, data || []);
        setErrorText(message);
        setValidSubmission(isValid);
    }, [selectionStart, selectionEnd, currentPeriod, data, params]);

    const editSuccess = () => {
        navigate("/");
    }

    const editFail = (error: Error) =>{
        if (error instanceof AuthError){
            navigate("/redirect");
        }else{
            setErrorText(error.message);
        }
    }

    const mutation = usePutPeriodMutation(editSuccess, editFail);

    if (isFetching){
        return(<div>Loading...</div>)
    }



    return (
    <>
        <div>Starting date: {selectionStart?.toLocaleDateString(undefined, {timeZone:"UTC"})}</div>
        <div>End date: {selectionEnd?.toLocaleDateString(undefined, {timeZone:"UTC"})}</div>
        <div>Notes:</div>
        <textarea ref={notesRef}/>
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
                    id: Number(params.id),
                    start: selectionStart!,
                    end: currentPeriod ? null : selectionEnd,
                    notes: notesRef.current?.value || ""})}}
            >
                Save
            </button>
            <button className="btn-primary" onClick={() => navigate("/")}>Cancel</button>
        </div>
    </>
    )
}
