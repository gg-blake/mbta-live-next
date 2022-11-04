import '../../styles/Train.module.css';
import MBTA from 'mbta-client';
import {useEffect, useState, useRef, useImperativeHandle, useInsertionEffect} from 'react';
import { NextPage } from 'next';
import TrainMap from './components/train-map';
import { Stop , Area } from './utils/types';

const API_KEY = '7226f7ee55514c019819bac6eacdaad9';
const mbta = new MBTA(API_KEY);

const Trains: NextPage = () => {
    const [greenBranch, setGreenBranch] = useState<string[][] | null>(null);

    useEffect(() => {
        const branchE = getStops("Green-D").then(stops => Array.from(stops).reverse());
        const branchD = getStops("Green-E").then(stops => Array.from(stops).reverse());
        const branchC = getStops("Green-C").then(stops => Array.from(stops).reverse());
        const branchB = getStops("Green-B").then(stops => Array.from(stops));

        Promise.all([branchE, branchD, branchC, branchB]).then(responses => setGreenBranch(responses));
    }, [])

    async function getStops(name: string) {
        return await mbta.fetchStopsByRoute(name)
        .then((response: Stop[]) => {
            let stops: Set<string> = new Set([]);
            response.map(response_item  => {
                stops.add(response_item.id);
            })
            return stops
         })
    }
    

    return (
        <div className='w-full px-8 h-screen bg-yellow-50 flex items-center'>
            {greenBranch != null ? <TrainMap branches={greenBranch} color="#139c13" /> : null}
        </div>
    )
}


export default Trains;
