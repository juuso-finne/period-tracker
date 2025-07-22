import { useQuery } from "@tanstack/react-query"
import { getPeriodData } from "../../model/API/periodData"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthError, CustomDate } from "../../model/types";

export default function NewPeriodPage() {
    const navigate = useNavigate();
    const {isFetching, error, data} = useQuery({
        queryKey: ["getPeriodData"],
        queryFn: getPeriodData
    });

    const [selectionStart, setSelectionStart] = useState<CustomDate|null>(null);
    const [selectionEnd, setSelectionEnd] = useState<CustomDate|null>(null);
    const [currentPeriod, setCurrentPeriod] = useState<boolean>(true);

    useEffect(() => {
    if (error && error instanceof AuthError){
        navigate("/redirect")
    }
    }, [error, navigate]);

    if (isFetching){
        return(<div>Loading...</div>)
    }

    return (
    <>
        {error ? <p>{error.message}</p> : <></>}
        {(data || []).map((period) =>
        <div key = {period.id} className="border-2 my-4 p-2 w-fit">
          <p>id: {period.id}</p>
          <p>start: {period.start.isoStringDateOnly()}</p>
          <p>end: {period.end?.isoStringDateOnly()}</p>
          <p>notes: {period.notes}</p>
        </div>
      )}
    </>
    )
}
