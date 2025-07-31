import { CustomDate, type PeriodData, type SettingsData } from "../model/types";

function mean(array: number[]): number{
   return array.reduce((a, b) => a + b)/array.length;
}

function getCycleLengths(data: PeriodData[], min:number = 15, max: number = 45): number[]{
    const cycleLengths:number[] = [];

    for (let i = 0; i < data.length -1; i++){
        const current = data[i];
        const next = data[i + 1];

        cycleLengths.push(current.start.differenceInDays(next.start));

    }

    return cycleLengths.filter(i => i >= min && i <= max);
}

function standardDeviation(array: number[]): number{
    if (array.length < 2){
        return 0;
    }
    const meanValue = mean(array);
    const variance = array.reduce((a, b) => a + Math.pow(b - meanValue, 2), 0) / (array.length - 1);
    return Math.sqrt(variance);
}

function getParameters(data: PeriodData[], settings: SettingsData):{plusMinus: number, averageCycleLength: number}{
    const cycleLengths = getCycleLengths(data);
    const parameters = {
        plusMinus: settings.plusMinus,
        averageCycleLength: settings.cycleLength
  }

    if (!settings.useDefaults && cycleLengths.length >= settings.threshold){
        parameters.plusMinus = Math.round(standardDeviation(cycleLengths) * 2);
        parameters.averageCycleLength = Math.round(mean(cycleLengths));
  }

  return parameters;
}

export function nextPeriod(data: PeriodData[], settings: SettingsData):{earliest: CustomDate, latest: CustomDate}{
  const latestPeriodStart = data[0].start;
  const parameters = getParameters(data,settings);

  const median = latestPeriodStart.daysBeforeOrAfter(parameters.averageCycleLength);
  const earliest = median.daysBeforeOrAfter(parameters.plusMinus * -1);
  const latest = median.daysBeforeOrAfter(parameters.plusMinus);
  return {earliest, latest};
}

export function cyclePhase(data: PeriodData[], settings: SettingsData):{daysElapsed: number, phase: string, ovulationDay: CustomDate}{
    const today = CustomDate.todayAsUTC();
    const {averageCycleLength} = getParameters(data, settings);

    const latestPeriodStart = data[0].start;
    const nextPeriodStart = latestPeriodStart.daysBeforeOrAfter(averageCycleLength);
    const daysElapsed = latestPeriodStart.differenceInDays(today);

    const currentOvulationDay = latestPeriodStart.daysBeforeOrAfter(Math.floor(averageCycleLength / 2));
    const pastOvulation = today > currentOvulationDay;
    const nextOvulationDay = nextPeriodStart.daysBeforeOrAfter(Math.floor(averageCycleLength / 2));


    let phase = "follicular";

    if (currentOvulationDay === today){
        phase = "ovulation";
    } else if(pastOvulation){
        phase = "luteal";
    }

    return {daysElapsed, phase, ovulationDay: pastOvulation ? nextOvulationDay : currentOvulationDay};
}