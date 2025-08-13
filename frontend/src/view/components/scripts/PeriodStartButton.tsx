import BaseDialog from "./Dialog/BaseDialog"
import SuccessDialog from "./Dialog/SuccessDialog";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { usePostPeriodMutation } from "../../../control/mutations/periodDataMutations";
import { AuthError, CustomDate, type PeriodData } from "../../../model/types";

export default function PeriodStartButton({data, setErrorText}:{data: PeriodData[], setErrorText: React.Dispatch<React.SetStateAction<string>>}) {

    const [isOpen, setIsOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState<boolean>(false);
    const [dialogError, setDialogError] = useState("");

    const navigate = useNavigate();

    const submissionSuccess = () => {
        setIsOpen(false);
        setSuccessOpen(true);
    }

    const submissionFail = (error: Error) =>{
        setIsOpen(false);
        if (error instanceof AuthError){
            navigate("/redirect");
        }else{
            setErrorText(error.message);
        }
    }

    const mutation = usePostPeriodMutation(submissionSuccess, submissionFail);

    return (
    <>
        <button className="btn-primary" onClick={() => setIsOpen(true)}>
            My period has started
        </button>

        <BaseDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <div className="flex flex-col gap-2 p-4">
                <p className="text-center">{dialogError}</p>
                <div className="flex gap-2 justify-center">

                    <button
                        className="btn-primary"
                        onClick={() => {
                            const today = CustomDate.todayAsUTC();
                            const yesterday = today.daysBeforeOrAfter(-1);
                            if (data.length !== 0 && (data[0].end?.valueOf() === today.valueOf() || data[0].end?.valueOf() === yesterday.valueOf())){
                                setDialogError("There is a period ending today or yesterday. Please edit or remove the conflicting data")
                                return;
                            }
                            mutation.mutate({id:null, start: CustomDate.todayAsUTC(), end: null, notes: ""});
                        }}
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