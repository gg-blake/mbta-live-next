import { useEffect , useState } from 'react';
import { ArrivalData } from '../utils/types';
import { fetchStops } from '../utils/mbta-fetch';
import Window from '../components/window';
import TrainTitle from '../components/train-title';
import { TrainView } from '../components/train-view';
import TrainMap from '../components/train-map';
import Navigation from '../components/navigation';

// Set train primary color
const color = "#139c13";

// List visible branch names of the train
const branchNames: string[] = ["E Branch", "D Branch", "C Branch", "B Branch"];

// Define the React FC
const Trains = () => {
    // Make state for storing each of the branches respective stop lists
    const [greenBranch, setGreenBranch] = useState<string[][] | null | any[]>(null);
    // Set state for whether user's browser is firefox or not
    const [isFirefox, setIsFirefox] = useState(false);
    // Set state for current selected stop info (arrival times, directions, etc.)
    const [data, setData] = useState<ArrivalData>({name: null, left: null, right: null});

    // Load the all the branch stop data on page load or on mount
    useEffect(() => {
        // @ts-ignore
        // NOTE : InstallTrigger has depreciated as of 2018
        setIsFirefox(typeof InstallTrigger !== 'undefined');
        // Store a promise object for each of the branches' stops upon making request
        const branchE = fetchStops("Green-D").then(stops => Array.from(stops).reverse());
        const branchD = fetchStops("Green-E").then(stops => Array.from(stops).reverse());
        const branchC = fetchStops("Green-C").then(stops => Array.from(stops).reverse());
        const branchB = fetchStops("Green-B").then(stops => Array.from(stops));

        /* Once all the promises have been fulfilled (all stop data is received),
        set the branch state to an array of all the stop arrays (2D-array) */
        Promise.all([branchE, branchD, branchC, branchB]).then(responses => setGreenBranch(responses));
    }, [])

    // Render component to DOM
    return (
        <Window isCompat={isFirefox}>
            <div className='w-full px-8 h-screen bg-yellow-50 flex justify-between py-[50px] flex-col overflow-hidden'>
                <div className='flex flex-row w-full h-auto'>
                    <TrainTitle name="Green Line" branchNames={branchNames} color={color} />
                    <TrainView trainData={data} color={color} />
                </div>
                {greenBranch != null ? <TrainMap data={[data, setData]} branches={greenBranch} color={color} branchNames={branchNames} /> : null}
                <Navigation color={color} />
            </div>
        </Window>
    )
}


export default Trains;
