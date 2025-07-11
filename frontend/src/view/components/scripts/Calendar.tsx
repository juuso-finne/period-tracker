import { CustomDate, type CalendarDayProps, type PeriodData } from "../../../model/types";
type Mode = "RANGE" | "SINGLE"
type Props = {
    periodData: PeriodData[],
    initialMonth?: number,
    initialYear?: number,
    mode: Mode,
    selectionStart?: CustomDate | null,
    selectionEnd?: CustomDate | null,
    setSelectionStart?: React.Dispatch<React.SetStateAction<CustomDate | null>>,
    setSelectionEnd?: React.Dispatch<React.SetStateAction<CustomDate | null>>,
    value?: {day: CustomDate, period: number | null}|null,
    setValue?: React.Dispatch<React.SetStateAction<{day: CustomDate, period: number | null} | null>>
    fixedStart?: boolean,
    fixedEnd?: boolean
}


import { useState, useMemo, useEffect} from "react";
import * as calendarUtils from "../../../control/calendar"

export default function Calendar(props: Props) {
    const {periodData, selectionEnd, selectionStart, setSelectionEnd, setSelectionStart, mode, setValue, initialMonth, initialYear, fixedStart, fixedEnd} = props;

    const [month, setMonth] = useState<number>(initialMonth || new Date().getMonth());
    const [year, setYear] = useState<number>(initialYear || new Date().getFullYear());
    const [hoverTarget, setHoverTarget] = useState<CustomDate| null>(selectionEnd || null);
    const [pivot, setPivot] = useState<CustomDate | null>(() => calendarUtils.setInitialPivot(fixedStart || false, fixedEnd || false, selectionStart || null, selectionEnd || null));
    const [openSelection, setOpenSelection] = useState<boolean>((selectionStart !== null) != (selectionEnd !== null));

    const days = useMemo(() => calendarUtils.getDays(month, year),[month, year])

    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    const hoverHandler = (d: CustomDate) => {
        if (!openSelection){
            return;
        }

        if (pivot && fixedStart && d < pivot){
            setHoverTarget(pivot);
            return
        }

        if (pivot && fixedEnd && d > pivot){
            setHoverTarget(pivot);
            return
        }

        setHoverTarget(d);
    }

    const clickHandler = (dayProps: CalendarDayProps) => {
        const {day, period} = dayProps
        if (mode === "SINGLE" && setValue){
            setValue({day, period});
            return
        }

        if (pivot && fixedEnd && day > pivot){
            return;
        }

        if (pivot && fixedStart && day < pivot){
            return;
        }

        if (openSelection){
            setOpenSelection(false);
            return
        }
        setOpenSelection(true);
        setHoverTarget(null)

        if (selectionEnd && fixedEnd){
            setPivot(selectionEnd);
            setHoverTarget(new CustomDate(Math.min(+day, +pivot!)));
            return;
        }

        if (selectionStart && fixedStart){
            setPivot(selectionStart);
            setHoverTarget(new CustomDate(Math.max(+day, +pivot!)));
            return;
        }

        setPivot(day);
    }

    useEffect(()=>{
        if (mode === "SINGLE" || !setSelectionEnd || !setSelectionStart){
            return;
        }
        setSelectionStart(hoverTarget && pivot && !openSelection ? new CustomDate(Math.min(+hoverTarget, +pivot)): null);
        setSelectionEnd(hoverTarget && pivot && !openSelection ? new CustomDate(Math.max(+hoverTarget, +pivot)):null)
    },[hoverTarget, pivot, mode, openSelection, setSelectionEnd, setSelectionStart])

    const propArray = useMemo(
    () => calendarUtils.getDayProps(
        days,
        periodData,
        props.mode ==="RANGE" ? pivot : props.value?.day || null,
        props.mode ==="RANGE" ? hoverTarget :  props.value?.day || null),
    [days, periodData, props, pivot, hoverTarget]
    );

  return (
    <div className="flex flex-col items-center mx-2 md:mx-0">
        <div className=" w-full md:w-3/4 ">

            <div className="flex justify-center">
                <select className="border" onChange={ e => setMonth(Number(e.target.value))} defaultValue={month}>
                    {months.map((month, i) => (<option value={i} key={month}>{month}</option>))}
                </select>
                <input className="border p-1" type="number" min="1900" max={new Date().getFullYear() + 5} defaultValue={year} onChange={e => setYear(Number(e.target.value))}/>
            </div>

            <div className='grid grid-cols-7 border'>
                {weekDays.map((day, i) => <div className="text-center" key={i}>{day}</div>)}
            </div>

            <div className='grid grid-cols-7'>
                {propArray.map((dayProps, i) => <CalendarDay {...dayProps} hoverHandler={hoverHandler} clickHandler={clickHandler} key={i}/>)}
            </div>

        </div>
    </div>
  )
}

function CalendarDay(
    props: CalendarDayProps &
    { hoverHandler: (_:CustomDate) => void } &
    { clickHandler: (_:CalendarDayProps) => void}
) {
    const {period, day, isSelected, hoverHandler, clickHandler} = props;

    return(
        <div
            className={`relative border hover:bg-blue-500 hover:text-white min-h-7 md:min-h-12 p-[5%] ${isSelected ? " selected" : ""}`}
            onMouseEnter={() => hoverHandler(day)}
            onClick={() => clickHandler(props)}
        >
            {day.getUTCDate()}
            {period ? <img className="size-5 absolute top-[0%] right-[0%] md:top-2 md:right-5" src="http://localhost:5000/images/blood_icon.png"/> : null}
        </div>
    )
}