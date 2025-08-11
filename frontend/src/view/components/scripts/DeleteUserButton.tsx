import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useDeleteUserMutation } from "../../../control/mutations/userMutations";
import BaseDialog from "./Dialog/BaseDialog"
import SuccessDialog from "./Dialog/SuccessDialog";
import { AuthError } from "../../../model/types";
import { getCookie } from "../../../control/cookies";

export default function DeleteUserButton({setErrorText}:{setErrorText: React.Dispatch<React.SetStateAction<string>>}) {
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [usernameConfirmation, setUsernameConfirmation] = useState("");

    const userName = getCookie("username");

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

    const mutation = useDeleteUserMutation(deleteSuccess, deleteFail);
    return (
        <>
            <SuccessDialog
                isOpen={successOpen}
                setIsOpen={setSuccessOpen}
                message="Account deleted"
                stayOnPageOption={false}
            />
            <BaseDialog
                isOpen={confirmationOpen}
                setIsOpen={setConfirmationOpen}
            >
                <div className="flex flex-col gap-2">
                    <p>Deleting your account will permanently remove all your period data. Please type your username to the text field to confirm this action:</p>
                    <div className="flex justify-center gap-2">
                        <input type="text" onChange={e => setUsernameConfirmation(e.target.value)}/>
                        <button
                            disabled={usernameConfirmation !== userName}
                            className="btn-danger"
                            onClick={(e) => {
                                e.preventDefault();
                                mutation.mutate();
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
                onClick={(e) => {
                    e.preventDefault();
                    setConfirmationOpen(true)
                }}
            >
                Delete my account
            </button>
        </>
    )
}
