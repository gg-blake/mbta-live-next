import { useEffect , useState } from 'react';
import { ArrivalData } from '../utils/types';
import { fetchStops } from '../utils/mbta-fetch';
import { difference } from '../utils/operations';
import Window from '../components/window';
import TrainTitle from '../components/train-title';
import { TrainView } from '../components/train-view';
import TrainMap from '../components/train-map';
import Navigation from '../components/navigation';


// Ashmont will be treated in this project as a separate branch of the red line
// Because of this, I will need to specify its unique stops and assign it to its own object of type Set
const ASHMONT_STOPS: Set<string> = new Set(['place-shmnl', 'place-fldcr', 'place-smmnl', 'place-asmnl']);

// Set train primary color
const color = "#DA291C";

// List visible branch names of the train
const branchNames: string[] = ["Alewife - Braintree", "Alewife - Ashmont", "Mattapan Branch"];

// Define the React FC
const Trains = () => {
    // Make state for storing each of the branches respective stop lists
    const [redBranch, setRedBranch] = useState<string[][] | null | any[]>(null);
    // Set state for whether user's browser is firefox or not
    const [isFirefox, setIsFirefox] = useState(true);
    // Set state for current selected stop info (arrival times, directions, etc.)
    const [data, setData] = useState<ArrivalData>({name: null, left: null, right: null});

    // Load the all the branch stop data on page load or on mount
    useEffect(() => {
        // When client side is rendered, update state
        // @ts-ignore
        // NOTE : InstallTrigger has depreciated as of 2018
        setIsFirefox(typeof InstallTrigger !== 'undefined');
        // Store a promise object for each of the branches' stops upon making request
        const brainBranch = fetchStops('Red').then(stops => Array.from(difference(stops, ASHMONT_STOPS)));
        const ashBranch = fetchStops('Red').then(stops => ["place-jfk", ...Array.from(ASHMONT_STOPS)]);
        const mattBranch = fetchStops('Mattapan').then(stops => Array.from(stops));

        /* Once all the promises have been fulfilled (all stop data is received),
        set the branch state to an array of all the stop arrays (2D-array) */
        Promise.all([brainBranch, ashBranch, mattBranch]).then(responses => setRedBranch(responses))
    }, [])

    useEffect(() => {
        console.log(data);
    }, [data])

    // Render component to DOM
    return (
        <Window isCompat={isFirefox}>
            <div className='w-full px-8 h-screen bg-yellow-50 flex justify-between py-[50px] flex-col overflow-hidden'>
                <div className='flex flex-row w-full h-auto'>
                    <TrainTitle name="Red Line" branchNames={branchNames} color={color} />
                    <TrainView trainData={data} color={color} />
                </div>
                {redBranch != null ? <TrainMap data={[data, setData]} branches={redBranch} color={color} branchNames={branchNames} /> : null}
                <Navigation color={color} />
            </div>
        </Window> 
    )
}


export default Trains;
