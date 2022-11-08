import { Position , ArrivalData } from "../utils/types";
import { useEffect, useState } from "react";
import { range } from "../utils/operations";
import '../styles/Train.module.css';

function _timeDelta(date: Date | null) {
    if (date == null) {
        return null
    }
    let delta = Math.floor((date.getTime() - Date.now()) / 60000);
    return delta
}


function _formatTime(date: Date | null) {
    let timeLeft = _timeDelta(date);
    switch (timeLeft) {
        case null:
            return "Currently Unavailable";
        case 0:
            return "Arriving now";
        case 1:
            return "Arriving soon";
        default:
            return timeLeft + " mins";
    }
}


function TrainViewTooltip({ position , arrivalTimes , color } : { position: Position, arrivalTimes: ArrivalData , color: string }) {

    return (
        <div style={{gridColumn: position.x, gridRow: position.y, borderColor: color}} className='w-[150px] h-[150px] mt-8 bg-white border-[1px] transition-all p-2 justify-self-center'>
            <h1 style={{color: color}} className='font-Inter text-md bold'>{arrivalTimes.name}</h1>
            <p className='font-Inter text-md text-gray-300'>{_formatTime(arrivalTimes.left)}</p>
            <p className='font-Inter text-md text-gray-300'>{_formatTime(arrivalTimes.right)}</p>
        </div>
    )
}

function TrainView({ trainData , color }: { trainData: ArrivalData , color: string }) {
    const onMountKeyframe = [
        {transform: 'translateY(10px)'}, {opacity: 0},
        {transform: 'translateY(0)', easing: 'cubic-bezier(0,1.05,.59,1)'}, {opacity: 1}
    ];

    useEffect(() => {
        // Animate the arrival name
        const head = document.getElementById('data-head');
        head?.animate(onMountKeyframe, 200);
        
        // Animate the arrival (a) time
        const leftDot = document.getElementById("left-dot");
        leftDot?.animate([
            {left: ((((_timeDelta(trainData.left) || 0) <= 10 ? _timeDelta(trainData.left) || 0 : 10) * 10)).toString() + "%", easing:"ease-out"},
            {left: 0, easing:'linear'}
        ], (_timeDelta(trainData.left) || 0) * 60000);

        // Animate the arrival (b) time
        const rightDot = document.getElementById("right-dot");
        rightDot?.animate([
            {right: ((((_timeDelta(trainData.right) || 0) <= 10 ? _timeDelta(trainData.right) || 0 : 10) * 10)).toString() + "%", easing:"ease-out"},
            {right: 0, easing:'linear'}
        ], (_timeDelta(trainData.right) || 0) * 60000);
    }, [trainData.name, trainData.left, trainData.right])


    function TimeMeter({d}:{d: number}) {
        return (
            <>
            <div style={{borderColor: color}} className="absolute top-[-3px] w-full h-[16px] grid grid-cols-10 grid-rows-2 font-Inter text-[10px]">
                {range(10).map((i) => <div key={i} style={{borderColor: color, borderRight: i == 9 ? `2px solid ${color}` : 'none'}} className="w-full h-[8px] border-l-2"></div>)}
                {d == 1 ? range(10).map((i) => <div key={i} style={{color: color, borderColor: 'rgb(254, 252, 232)', borderRight: i == 10 ? `2px solid ${color}` : 'none'}} className="w-full h-full text-left border-l-2 ml-[-12%] border-r-2">{10 - i}</div>)
                : range(10).map((i) => <div key={i} style={{color: color, borderColor: 'rgb(254, 252, 232)'}} className="w-full h-full border-l-2 text-right ml-[8%]">{i + 1}</div>)}
            </div>
            <div style={{borderColor: color}} className="absolute top-[-2px] w-full h-[6px] grid grid-cols-100 grid-rows-1 border-r-[1px]">
                {range(100).map((i) => <div key={i} style={{borderColor: color}} className="w-full h-full border-l-[1px]"></div>)}
            </div>
            </>
        )
    }
    
    return (
        <div className="flex-grow h-auto flex flex-col items-end text-right gap-y-8 relative">
            <h1 style={{color: color}} id="data-head" className="h-auto py-4 font-Inter text-3xl">{trainData.name}</h1>
            <div id="time-ruler-1" style={{backgroundColor: color}} className="w-[80%] max-w-[500px] h-[2px] relative mt-4">
                
                
                <TimeMeter d={0} />
                <p style={{color: color}} id="data-arrival-a" className="absolute right-0 h-auto py-2 font-Inter text-xl font-semibold top-[-50px]">{_formatTime(trainData.left) || 0}</p>
                <div id="left-dot" className="w-[10px] h-[10px] absolute top-[-4px] bg-inherit transition-all left-0 rounded-full animate-ping"></div>
            </div>
            <div id="time-ruler-2" style={{backgroundColor: color}} className="w-[80%] max-w-[500px] h-[2px] relative mt-8">
                
                <TimeMeter d={1} />
                <p style={{color: color}} id="data-arrival-b" className="absolute right-0 h-auto py-2 font-Inter text-xl font-semibold top-[-50px]">{_formatTime(trainData.right)}</p>
                <div id="right-dot" className="w-[10px] h-[10px] absolute top-[-4px] bg-inherit transition-all right-0 rounded-full animate-ping"></div>
            </div>
        </div>
    )
}

export { TrainViewTooltip , TrainView };