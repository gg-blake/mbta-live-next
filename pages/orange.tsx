import { useEffect , useState } from 'react';
import { ArrivalData } from '../utils/types';
import { fetchStops } from '../utils/mbta-fetch';
import Window from '../components/window';
import TrainTitle from '../components/train-title';
import { TrainView } from '../components/train-view';
import TrainMap from '../components/train-map';
import Navigation from '../components/navigation';

// Set train primary color
const color = "#fa902d";

// List visible branch names of the train
const branchNames: string[] = ["Oak Grove - Forest Hills"];

// Define the React FC
const Trains = () => {
    // Make state for storing each of the branches respective stop lists
    const [orangeBranch, setOrangeBranch] = useState<string[][] | null>(null);
    // Set state for whether user's browser is firefox or not
    const [isFirefox, setIsFirefox] = useState(false);
    // Set state for current selected stop info (arrival times, directions, etc.)
    const [data, setData] = useState<ArrivalData>({name: null, left: null, right: null});

    // Load the all the branch stop data on page load or on mount
    useEffect(() => {
        // @ts-ignore
        // NOTE : InstallTrigger has depreciated as of 2018
        setIsFirefox(typeof InstallTrigger !== 'undefined');
        // Once the stops request is fulfilled set the branch state to an array of the stop array (2D-array)
        fetchStops('Orange').then(stops => setOrangeBranch([Array.from(stops)]));
    }, [])

    // Render component to DOM
    return (
        <Window isCompat={isFirefox}>
            <div className='w-full px-8 h-screen bg-yellow-50 flex justify-between py-[50px] flex-col overflow-hidden'>
                <div className='flex flex-row w-full h-auto'>
                    <TrainTitle name="Orange Line" branchNames={branchNames} color={color} />
                    <TrainView trainData={data} color={color} />
                </div>
                {orangeBranch != null ? <TrainMap data={[data, setData]} branches={orangeBranch} color={color} branchNames={branchNames} /> : null}
                <Navigation color={color} />
            </div>
        </Window>
        
    )
}


export default Trains;
