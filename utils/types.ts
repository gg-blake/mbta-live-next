import React from 'react';

type Stop = {
    name: string,
    id: string
}

type Area = {
    width: number, 
    height: number
}

type Position = {
    x: number,
    y: number,
    name: string
}

type ArrivalData = {
    right: Date | null,
    left: Date | null,
    name: string | null
}

type ArrivalDataState = [ArrivalData, React.Dispatch<React.SetStateAction<ArrivalData>>];

export type { Stop , Area , Position , ArrivalData , ArrivalDataState };