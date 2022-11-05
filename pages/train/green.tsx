import { useEffect , useState } from 'react';
import TrainMap from './components/train-map';
import TrainTitle from './components/train-title';
import { fetchStops } from './utils/mbta-fetch';

// Set train primary color
const color = "#139c13";

// List visible branch names of the train
const branchNames: string[] = ["E Branch", "D Branch", "C Branch", "B Branch"];

// Define the React FC
const Trains = () => {
    // Make state for storing each of the branches respective stop lists
    const [greenBranch, setGreenBranch] = useState<string[][] | null>(null);

    // Load the all the branch stop data on page load or on mount
    useEffect(() => {
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
        <div className='w-full px-8 h-screen bg-yellow-50 flex justify-between pb-[200px] pt-[50px] flex-col overflow-hidden'>
            <TrainTitle name="Green Line" branchNames={branchNames} color={color} />
            {greenBranch != null ? <TrainMap branches={greenBranch} color={color} branchNames={branchNames} /> : null}
        </div>
    )
}


export default Trains;
