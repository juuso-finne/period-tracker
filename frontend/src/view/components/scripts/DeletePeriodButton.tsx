import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useDeletePeriodMutation } from "../../../control/mutations/periodDataMutations";
import BaseDialog from "./Dialog/BaseDialog"
import SuccessDialog from "./Dialog/SuccessDialog";
import { AuthError } from "../../../model/types";

export default function DeletePeriodButton({id, setErrorText}:{id: number, setErrorText: React.Dispatch<React.SetStateAction<string>>}) {
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);

    const navigate = useNavigate();

    const deleteSuccess = () => {
        setConfirmationOpen(false);
        setSuccessOpen(true);
    }

    const deleteFail = (error: Error) =>{
        setConfirmationOpen(false);
        if (error instanceof AuthError){
            navigate("/redirect");
        }else{
            setErrorText(error.message);
        }
    }

    const mutation = useDeletePeriodMutation(deleteSuccess, deleteFail);
    return (
        <>
            <SuccessDialog
                isOpen={successOpen}
                setIsOpen={setSuccessOpen}
                message="Period data deleted"
            />
            <BaseDialog
                isOpen={confirmationOpen}
                setIsOpen={setConfirmationOpen}
            >
                <div className="flex flex-col gap-2">
                    <p>Are you sure you want to delete this period data?</p>
                    <div className="flex justify-center gap-2">
                        <button
                            className="btn-danger"
                            onClick={() => {
                                mutation.mutate(id);
                            }}
                        >
                            Delete
                        </button>
                        <button
                            className="btn-primary"
                            onClick={() => setConfirmationOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </BaseDialog>
            <button
                className="btn-danger"
                onClick={() => setConfirmationOpen(true)}
            >
                Delete
            </button>
        </>
    )
}
