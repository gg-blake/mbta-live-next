import { useEffect , useState } from 'react';
import { ArrivalData } from '../utils/types';
import { fetchStops } from '../utils/mbta-fetch';
import Window from '../components/window';
import TrainTitle from '../components/train-title';
import { TrainView } from '../components/train-view';
import TrainMap from '../components/train-map';
import Navigation from '../components/navigation';

// Set train primary color
const color = "#3551de";

// List visible branch names of the train
const branchNames: string[] = ["Wonderland - Bowdoin"];

// Define the React FC
const Trains = () => {
    // Make state for storing each of the branches respective stop lists
    const [blueBranch, setBlueBranch] = useState<string[][] | null>(null);
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
        fetchStops('Blue').then(stops => setBlueBranch([Array.from(stops)]))
    }, [])

    // Render component to DOM
    return (
        <Window isCompat={isFirefox}>
            <div className='w-full px-8 h-screen bg-yellow-50 flex justify-between py-[50px] flex-col overflow-hidden'>
                <div className='flex flex-row w-full h-auto'>
                    <TrainTitle name="Blue Line" branchNames={branchNames} color={color} />
                    <TrainView trainData={data} color={color} />
                </div>
                {blueBranch != null ? <TrainMap data={[data, setData]} branches={blueBranch} color={color} branchNames={branchNames} /> : null}
                <Navigation color={color} />
            </div>
        </Window>
        
    )
}


export default Trains;
