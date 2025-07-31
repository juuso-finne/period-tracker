import type { CustomDate, PeriodData, SettingsData } from "../model/types";

export function mean(array: number[]): number{
   return array.reduce((a, b) => a + b)/array.length;
}

export function getCycleLengths(data: PeriodData[], min:number = 15, max: number = 45): number[]{
    const cycleLengths:number[] = [];

    for (let i = 0; i < data.length -1; i++){
        const current = data[i];
        const next = data[i + 1];

        cycleLengths.push(current.start.differenceInDays(next.start));

    }

    return cycleLengths.filter(i => i >= min && i <= max);
}

export function standardDeviation(array: number[]): number{
    if (array.length < 2){
        return 0;
    }
    const meanValue = mean(array);
    const variance = array.reduce((a, b) => a + Math.pow(b - meanValue, 2), 0) / (array.length - 1);
    return Math.sqrt(variance);
}

export function nextPeriod(data: PeriodData[], settings: SettingsData):{earliest: CustomDate, latest: CustomDate}{

  const cycleLengths = getCycleLengths(data);
  const latestPeriodStart = data[0].start;
  const parameters = {
    plusMinus: settings.plusMinus,
    cycleLength: settings.cycleLength
  }

  if (!settings.useDefaults && cycleLengths.length >= settings.threshold){
    parameters.plusMinus = Math.round(standardDeviation(cycleLengths) * 2);
    parameters.cycleLength = Math.round(mean(cycleLengths));
  }

  const median = latestPeriodStart.daysBeforeOrAfter(parameters.cycleLength);
  const earliest = median.daysBeforeOrAfter(parameters.plusMinus * -1);
  const latest = median.daysBeforeOrAfter(parameters.plusMinus);
  return {earliest, latest};
}