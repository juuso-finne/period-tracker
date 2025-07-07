import { CustomDate, type PeriodData } from "../model/types"

const validate = (data: PeriodData, dataArray:PeriodData[]): {message: string, isValid: boolean} => {
    const filteredArray = dataArray.filter((d)=>d.id !== data.id).map((d) => ({...d, end: d.end ? d.end : CustomDate.todayAsUTC()}));
    const currentPeriod = data.end === null;
    const newPeriod = data.id === null

    if(data.start > CustomDate.todayAsUTC() || (!!data.end && data.end > CustomDate.todayAsUTC())){
        return{
            message: "Start or end date cannot be in the future.",
            isValid: false
        }
    }

    if(currentPeriod && !newPeriod && data.id !== dataArray[0].id){
        return{
            message: "This cannot be a current period because there are periods starting after this",
            isValid: false
        }
    }

    const overlap = filteredArray.some((d) =>{
        const overlapA = d.start.isBetween(data.start, data.end ? data.end : CustomDate.todayAsUTC());
        const overlapB = d.end.isBetween(data.start, data.end ? data.end : CustomDate.todayAsUTC());
        const overlapC = data.start.isBetween(d.start, d.end);
        return overlapA || overlapB || overlapC
    })

    if(overlap){
        return {
            message: "Period data cannot overlap with each other.",
            isValid: false
        }
    }
    return {
        message: "",
        isValid: true
    }
}

export default validate