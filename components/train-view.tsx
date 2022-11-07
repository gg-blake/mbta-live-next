import { Position , ArrivalData } from "../utils/types";
import { useEffect } from "react";
import '../styles/Train.module.css';

function TrainViewTooltip({ position , arrivalTimes , color } : { position: Position, arrivalTimes: ArrivalData , color: string }) {
    const formatTime = (date: Date | null) => {
        if (date == null) {
            return "Unavailable"
        }
        let timeLeft = Math.floor((date.getTime() - Date.now()) / 60000);
        switch (timeLeft) {
            case 0:
                return "Arriving now"
            case 1:
                return "Arriving soon"
            default:
                return timeLeft + " mins"
        }
    }

    return (
        <div style={{gridColumn: position.x, gridRow: position.y, borderColor: color}} className='w-[150px] h-[150px] mt-8 bg-white border-[1px] transition-all p-2 justify-self-center'>
            <h1 style={{color: color}} className='font-Inter text-md bold'>{arrivalTimes.name}</h1>
            <p className='font-Inter text-md text-gray-300'>{formatTime(arrivalTimes.left)}</p>
            <p className='font-Inter text-md text-gray-300'>{formatTime(arrivalTimes.right)}</p>
        </div>
    )
}


function TrainView({ trainData , color }: { trainData: ArrivalData , color: string }) {
    const onMountKeyframe = [
        {transform: 'translateY(10px)', easing: 'ease-out'},
        {transform: 'translateY(0)', easing: 'ease-in'}
    ];
    
    const css = `
    h1 {
        color: ${color};
    }

    @keyframes slideInFromLeft {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(0);
        }
    }
    `

    useEffect(() => {
        // Animate the arrival name
        const head = document.getElementById('data-head');
        head?.animate(onMountKeyframe, 200);
        // Animate the arrival (a) time

        // Animate the arrival (b) time

    }, [trainData.name])
    
    return (
        <div className="flex-grow h-auto text-right">
            <style>{css}</style>
            <h1 id="data-head" className="h-auto py-4 font-Inter text-2xl">{trainData.name}</h1>
            <p id="data-arrival-a"></p>
            <p id="data-arrival-b"></p>
        </div>
    )
}

export { TrainViewTooltip , TrainView };