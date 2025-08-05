import BaseDialog from "./BaseDialog"
//import { useNavigate } from "react-router-dom";

export default function SuccessDialog({isOpen, setIsOpen, message=""} : {isOpen:boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, message: string}) {
    const defaultMessage = "Operation completed successfully";
    //const navigate = useNavigate();
    return (
        <BaseDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <div className="flex flex-col items-center gap-2">
                <p>{message === "" ? defaultMessage : message}</p>
                <button className="btn-primary" onClick={() => {
                    setIsOpen(false)
                    window.location.reload();
                    }}>Stay on this page
                </button>
                <button className="btn-primary" onClick={() => window.location.href = "/"}>
                    Back to main
                </button>
            </div>
        </BaseDialog>
    )
}
