import { useEffect , useState } from 'react';
import { fetchStops } from '../utils/mbta-fetch';
import Window from '../components/window';
import TrainTitle from '../components/train-title';
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
                <TrainTitle name="Blue Line" branchNames={branchNames} color={color} />
                {blueBranch != null ? <TrainMap branches={blueBranch} color={color} branchNames={branchNames} /> : null}
                <Navigation color={color} />
            </div>
        </Window>
        
    )
}


export default Trains;
