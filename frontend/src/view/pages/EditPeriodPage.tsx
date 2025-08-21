import { useQuery } from "@tanstack/react-query"
import { getPeriodData } from "../../model/API/periodData"
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState, useRef } from "react";
import { AuthError, CustomDate } from "../../model/types";
import { usePutPeriodMutation } from "../../control/mutations/periodDataMutations";
import validate from "../../control/validation";
import Calendar from "../components/scripts/Calendar";
import SuccessDialog from "../components/scripts/Dialog/SuccessDialog";

export default function EditPeriodPage() {
    const navigate = useNavigate();
    const {isFetching, error, data} = useQuery({
        queryKey: ["getPeriodData"],
        queryFn: getPeriodData,
        refetchOnWindowFocus: false
    });

    const notesRef = useRef<HTMLTextAreaElement>(null)

    const params = useParams();
    const [searchParams] = useSearchParams();

    const [selectionStart, setSelectionStart] = useState<CustomDate|null>(null);
    const [selectionEnd, setSelectionEnd] = useState<CustomDate|null>(null);
    const [currentPeriod, setCurrentPeriod] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>("");
    const [validSubmission, setValidSubmission] = useState<boolean>(false);
    const [endPeriod] = useState<boolean>(searchParams.get("endPeriod") === "true");
    const [fixedStart, setFixedStart] = useState<CustomDate | null>(null);
    const [successOpen, setSuccessOpen] = useState<boolean>(false);
    const [initialYear, setInitialYear] = useState<number>(new Date().getFullYear());
    const [initialMonth, setInitialMonth] = useState<number>(new Date().getMonth());

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

        if(endPeriod){
            setFixedStart(period.start)
        }

        setSelectionEnd(period.end);
        setSelectionStart(period.start);
        setCurrentPeriod(period.end === null && !endPeriod);
        setInitialMonth(period.start.getUTCMonth());
        setInitialYear(period.start.getUTCFullYear());
        if (notesRef.current) {
            notesRef.current.value = period.notes;
        }

    },[data, params, navigate, endPeriod])

    useEffect(() =>{
        if (!selectionStart || (!selectionEnd && !currentPeriod)){
            if(endPeriod){
                setErrorText("Please select when your period ended.")
            } else if(currentPeriod){
                setErrorText("Please select when your period started")
            } else{
                setErrorText("Please select a start date and an end date.");
            }
            setValidSubmission(false);
            return;
        }

        const {message, isValid} = validate({id:Number(params.id), start:selectionStart, end:selectionEnd, notes:""}, data || []);
        setErrorText(message);
        setValidSubmission(isValid);
    }, [selectionStart, selectionEnd, currentPeriod, data, params, endPeriod]);

    const editSuccess = () => {
        setSuccessOpen(true);
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
    <div className="flex flex-col items-center gap-2">
        <SuccessDialog
            isOpen={successOpen}
            setIsOpen={setSuccessOpen}
            message={"Changes saved"}
        />
        <div>Starting date: {selectionStart?.toLocaleDateString(undefined, {timeZone:"UTC"})}</div>
        <div>End date: {selectionEnd?.toLocaleDateString(undefined, {timeZone:"UTC"})}</div>
        <div>Notes:</div>
        <textarea ref={notesRef} className="xl:min-w-xl data-entry"/>
        <div className="flex gap-2">
            <input type="checkbox" onChange={e => setCurrentPeriod(e.target.checked)} checked={currentPeriod}/>
            <p>I'm currently on this period</p>
        </div>

        <div className="error-text">{errorText}</div>

        <Calendar
        mode = "RANGE"
        periodData={data || []}
        selectionStart={selectionStart}
        setSelectionStart={setSelectionStart}
        selectionEnd={selectionEnd}
        setSelectionEnd={setSelectionEnd}
        fixedEnd={memoizedFixedEnd}
        fixedStart={fixedStart}
        initialMonth={initialMonth}
        initialYear={initialYear}
        />

        <div className="flex justify-center gap-5">
            <button
                className="btn-save"
                disabled={!validSubmission}
                onClick={() => {mutation.mutate({
                    id: Number(params.id),
                    start: selectionStart!,
                    end: currentPeriod ? null : selectionEnd,
                    notes: notesRef.current?.value || ""})}}
            >
                Save
            </button>
            <button className="btn-primary" onClick={() => navigate(-1)}>Back</button>
        </div>
    </div>
    )
}
