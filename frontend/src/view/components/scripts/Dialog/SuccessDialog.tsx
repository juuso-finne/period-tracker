import BaseDialog from "./BaseDialog"
import { useQueryClient } from "@tanstack/react-query";

export default function SuccessDialog({isOpen, setIsOpen, message="", stayOnPageOption=true, returnMessage="Back to main", backToMainOption=true, stayMessage="Stay on this page"} : {isOpen:boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, message: string, stayOnPageOption?: boolean, returnMessage?: string, backToMainOption?:boolean, stayMessage?:string}) {
    const defaultMessage = "Operation completed successfully";
    const queryClient = useQueryClient();
    return (
        <BaseDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <div className="flex flex-col items-center gap-2">
                <p>{message === "" ? defaultMessage : message}</p>
                {
                    stayOnPageOption &&
                    <button className="btn-primary" onClick={() => {
                            queryClient.invalidateQueries();
                            setIsOpen(false)
                        }
                    }>
                        {stayMessage}
                    </button>
                }

                {
                    backToMainOption &&
                    <button
                        className="btn-primary"
                        onClick={() => {
                            setIsOpen(false)
                            window.location.href = "/";
                        }
                    }>
                        {returnMessage}
                    </button>
                }

            </div>
        </BaseDialog>
    )
}
