import type { PeriodData } from "../model/types";

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
    const meanValue = mean(array);
    const variance = array.reduce((a, b) => a + Math.pow(b - meanValue, 2), 0) / (array.length - 1);
    return Math.sqrt(variance);
}