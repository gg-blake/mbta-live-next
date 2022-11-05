import { useEffect , useState } from 'react';
import TrainMap from '../../components/train-map';
import TrainTitle from '../../components/train-title';
import { fetchStops } from '../../utils/mbta-fetch';

// Set train primary color
const color = "#fa902d";

// List visible branch names of the train
const branchNames: string[] = ["Oak Grove - Forest Hills"];

// Define the React FC
const Trains = () => {
    // Make state for storing each of the branches respective stop lists
    const [orangeBranch, setOrangeBranch] = useState<string[][] | null>(null);

    // Load the all the branch stop data on page load or on mount
    useEffect(() => {
        // Once the stops request is fulfilled set the branch state to an array of the stop array (2D-array)
        fetchStops('Orange').then(stops => setOrangeBranch([Array.from(stops)]));
    }, [])

    // Render component to DOM
    return (
        <div className='w-full px-8 h-screen bg-yellow-50 flex justify-between pb-[200px] pt-[50px] flex-col overflow-hidden'>
            <TrainTitle name="Orange Line" branchNames={branchNames} color={color} />
            {orangeBranch != null ? <TrainMap branches={orangeBranch} color={color} branchNames={branchNames} /> : null}
            
        </div>
    )
}


export default Trains;
