import BaseDialog from "./Dialog/BaseDialog"
import SuccessDialog from "./Dialog/SuccessDialog";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { usePutPeriodMutation } from "../../../control/mutations/periodDataMutations";
import { AuthError, CustomDate, type PeriodData } from "../../../model/types";

export default function PeriodEndButton({data, setErrorText}:{data: PeriodData[], setErrorText: React.Dispatch<React.SetStateAction<string>>}) {

    const [isOpen, setIsOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    const submissionSuccess = () => {
        setIsOpen(false);
        setSuccessOpen(true);
    }

    const submissionFail = (error: Error) =>{
        if (error instanceof AuthError){
            navigate("/redirect");
        }else{
            setErrorText(error.message);
        }
    }

    const mutation = usePutPeriodMutation(submissionSuccess, submissionFail);

    if (data.length === 0 || data[0].end !== null){
        return(<></>)
    }
    return (
    <>
        <button className="btn-primary" onClick={() => setIsOpen(true)}>
            My period has ended
        </button>

        <BaseDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <div className="flex gap-2 p-4">
                <button
                    className="btn-primary"
                    onClick={() => mutation.mutate({...data[0], end: CustomDate.todayAsUTC()})}
                >
                    My period ended today
                </button>
                <button
                    className="btn-primary"
                    onClick={() => navigate(`/editPeriod/${data[0].id}/?endPeriod=true`)}
                >
                    My period ended earlier
                </button>
                <button className="btn-primary" onClick={() => setIsOpen(false)}>
                    Cancel
                </button>
            </div>
        </BaseDialog>

        <SuccessDialog
            message="Period data saved successfully"
            isOpen={successOpen}
            setIsOpen={setSuccessOpen}
            stayOnPageOption={false}
            acknowledgeMessage="OK"
        />
    </>
    )
}