import BaseDialog from "./Dialog/BaseDialog"
import { useState } from "react"

export default function PeriodEndButton({currentPeriod}:{currentPeriod:boolean}) {
    const [isOpen, setIsOpen] = useState(false);
    if (!currentPeriod){
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
                <button className="btn-primary">
                    My period ended today
                </button>
                <button className="btn-primary">
                    My period ended earlier
                </button>
                <button className="btn-primary" onClick={() => setIsOpen(false)}>
                    Cancel
                </button>
            </div>
        </BaseDialog>
    </>
    )
}