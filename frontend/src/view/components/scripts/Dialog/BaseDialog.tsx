import { useEffect, useRef } from "react"

export default function BaseDialog({isOpen, children, setIsOpen}:{isOpen: boolean, children: React.ReactNode, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() =>{
        if (isOpen){
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [isOpen]);
    return (
        <dialog
            ref={ref}
            onCancel={() => setIsOpen(false)}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3"
        >
            {children}
        </dialog>
    )
}
