import '../../styles/Train.module.css';
import MBTA from 'mbta-client';
import { useEffect , useState } from 'react';
import { NextPage } from 'next';
import TrainMap from './components/train-map';
import { Stop , Area } from './utils/types';
import { difference } from './utils/set-operations';

const API_KEY = '7226f7ee55514c019819bac6eacdaad9';
const mbta: MBTA = new MBTA(API_KEY);
const ASHMONT_STOPS: Set<string> = new Set(['place-shmnl', 'place-fldcr', 'place-smmnl', 'place-asmnl']);

const Trains: NextPage = () => {
    const [redBranch, setRedBranch] = useState<string[][] | null>(null);

    useEffect(() => {
        const brainBranch = getStops('Red').then(stops => {
            return Array.from(difference(stops, ASHMONT_STOPS))
        });
        const ashBranch = getStops('Red').then(stops => {
            return ["place-jfk", ...Array.from(ASHMONT_STOPS)]
        })
        const mattBranch = getStops('Mattapan').then(stops => {
            return Array.from(stops)
        });

        Promise.all([brainBranch, ashBranch, mattBranch]).then(responses => setRedBranch(responses))

        
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
        <div className='w-full px-8 h-screen bg-yellow-50 flex items-center'>{redBranch != null ? <TrainMap branches={redBranch} color="#DA291C" /> : null}</div>
    )
}


export default Trains;
