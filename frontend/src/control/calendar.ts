export function changeMonth(setMonth: React.Dispatch<React.SetStateAction<number>>, selector: React.RefObject<HTMLSelectElement | null>){
    setMonth(parseInt(selector.current?.value || "0"))
}

export function changeYear(setYear: React.Dispatch<React.SetStateAction<number>>, selector: React.RefObject<HTMLSelectElement | null>){
    setYear(parseInt(selector.current?.value || new Date().getFullYear().toString()))
}