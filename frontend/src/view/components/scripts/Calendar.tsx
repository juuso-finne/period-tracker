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
    fixedStart?: CustomDate | null,
    fixedEnd?: CustomDate | null
}


import { useState, useMemo, useEffect, useRef} from "react";
import * as calendarUtils from "../../../control/calendar"

export default function Calendar(props: Props) {
    const {periodData, selectionEnd, selectionStart, setSelectionEnd, setSelectionStart, mode, setValue, initialMonth, initialYear, fixedStart, fixedEnd} = props;

    const [month, setMonth] = useState<number>(initialMonth || new Date().getMonth());
    const [year, setYear] = useState<number>(initialYear || new Date().getFullYear());
    const [hoverTarget, setHoverTarget] = useState<CustomDate| null>(selectionEnd || null);
    const [pivot, setPivot] = useState<CustomDate | null>(() => calendarUtils.setInitialPivot(fixedStart || null, fixedEnd || null, selectionStart || null, selectionEnd || null));
    const [openSelection, setOpenSelection] = useState<boolean>((selectionStart !== null) != (selectionEnd !== null) || !!fixedStart || !!fixedEnd);

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

        if (!setSelectionEnd || !setSelectionStart){
            return;
        }

        if (pivot && fixedEnd && day > pivot){
            return;
        }

        if (pivot && fixedStart && day < pivot){
            return;
        }

        if (openSelection && pivot){
            setOpenSelection(false);
            setSelectionStart(new CustomDate(Math.min(+day, +pivot)));
            setSelectionEnd(new CustomDate(Math.max(+day, +pivot)));
            return
        }

        setOpenSelection(true);
        setHoverTarget(null);
        setSelectionEnd(null);
        setSelectionStart(null);;

        if (fixedEnd){
            setPivot(fixedEnd);
            setHoverTarget(new CustomDate(Math.min(+day, +pivot!)));
            setSelectionEnd(fixedEnd);
            return;
        }


        if (fixedStart){
            setPivot(fixedStart);
            setHoverTarget(new CustomDate(Math.max(+day, +pivot!)));
            setSelectionStart(fixedStart);
            return;
        }

        setPivot(day);
    }

    // Add refs to always have the latest value
    const hoverTargetRef = useRef(hoverTarget);
    const pivotRef = useRef(pivot);

    useEffect(() => {
        hoverTargetRef.current = hoverTarget;
    }, [hoverTarget]);
    useEffect(() => {
        pivotRef.current = pivot;
    }, [pivot]);

    useEffect(()=>{

        if(!setSelectionEnd || !setSelectionStart || (!fixedEnd && !fixedStart)){
            return;
        }

        if (!(!!hoverTargetRef.current || !!pivotRef.current)){
            setOpenSelection(true);
        }

        if (fixedEnd){
            setHoverTarget( () => {
                if(!hoverTargetRef.current && !pivotRef.current){
                    return fixedEnd;
                }

                let oldEnd = null;

                if (hoverTargetRef.current && pivotRef.current){
                    oldEnd = new CustomDate(Math.min(+hoverTargetRef.current, +pivotRef.current));
                } else{
                    oldEnd = hoverTargetRef.current || pivotRef.current;
                }

                return oldEnd ? new CustomDate(Math.min(+oldEnd, +fixedEnd)) : oldEnd;
            });
            setSelectionEnd(fixedEnd);
            setPivot(fixedEnd);
        }

        if (fixedStart){
            setHoverTarget( () => {
                if(!hoverTargetRef.current && !pivotRef.current){
                    return fixedStart;
                }

                let oldStart = null;

                if (hoverTargetRef.current && pivotRef.current){
                    oldStart = new CustomDate(Math.max(+hoverTargetRef.current, +pivotRef.current));
                } else{
                    oldStart = hoverTargetRef.current || pivotRef.current;
                }

                return oldStart ? new CustomDate(Math.max(+oldStart, +fixedStart)) : oldStart;
            });
            setSelectionStart(fixedStart);
            setPivot(fixedStart);
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[fixedEnd, fixedStart])

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