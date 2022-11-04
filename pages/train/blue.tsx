import '../../styles/Train.module.css';
import MBTA from 'mbta-client';
import {useEffect, useState, useRef, useImperativeHandle, useInsertionEffect} from 'react';
import NextApp from 'next';
import TrainMap from './components/train-map';
import { Stop , Area } from './utils/types';

const API_KEY = '7226f7ee55514c019819bac6eacdaad9';
const mbta = new MBTA(API_KEY);

const Trains: NextApp = () => {
    const [blueBranch, setBlueBranch] = useState<string[][] | null>(null);

    useEffect(() => {
        getStops('Orange').then(stops => {
            setBlueBranch([Array.from(stops)]);
        })
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
        <div className='w-full px-8 h-screen bg-yellow-50 flex items-center'>{blueBranch != null ? <TrainMap branches={blueBranch} color="#3551de" /> : null}</div>
    )
}


export default Trains;
