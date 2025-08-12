import BaseDialog from "./Dialog/BaseDialog"
import { useState } from "react"

export default function PeriodStartButton({currentPeriod}:{currentPeriod:boolean}) {
    const [isOpen, setIsOpen] = useState(false);
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
                <button className="btn-primary">
                    My period started today
                </button>
                <button className="btn-primary">
                    My period started earlier
                </button>
                <button className="btn-primary" onClick={() => setIsOpen(false)}>
                    Cancel
                </button>
            </div>
        </BaseDialog>
    </>
    )
}