import BaseDialog from "./Dialog/BaseDialog"
import SuccessDialog from "./Dialog/SuccessDialog";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { usePostPeriodMutation } from "../../../control/mutations/periodDataMutations";
import { AuthError, CustomDate } from "../../../model/types";

export default function PeriodStartButton({currentPeriod, setErrorText}:{currentPeriod:boolean, setErrorText: React.Dispatch<React.SetStateAction<string>>}) {

    const [isOpen, setIsOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    const submissionSuccess = () => {
        setSuccessOpen(true);
    }

    const submissionFail = (error: Error) =>{
        if (error instanceof AuthError){
            navigate("/redirect");
        }else{
            setErrorText(error.message);
        }
    }

    const mutation = usePostPeriodMutation(submissionSuccess, submissionFail);

    if (currentPeriod){
        return(<></>)
    }
    return (
    <>
        <button className="btn-primary" onClick={() => setIsOpen(true)}>
            My period has started
        </button>

        <BaseDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <div className="flex gap-2 p-4">
                <button
                    className="btn-primary"
                    onClick={() => mutation.mutate({id:null, start: CustomDate.todayAsUTC(), end: null, notes: ""})}
                >
                    My period started today
                </button>
                <button
                    className="btn-primary"
                    onClick={() => navigate("/new?current=true")}
                >
                    My period started earlier
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