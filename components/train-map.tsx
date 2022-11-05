import React from 'react';
import {useEffect, useState, useRef } from 'react';
import LinkedList from '../utils/linked-list';
import { Position , ArrivalData } from '../utils/types';
import { fetchStopData } from '../utils/mbta-fetch';
import { sliceAtFirstMutual } from '../utils/operations';

/* I made a variable with a global scope so that once the color prop is passed within TrainMap, 
it can be accessed by other separate components */
var staticColor:string = "#000000";

// Global variable stores all stops grid positions
// This is useful for adding event listeners to grid segments
var coords: any = {};

// LinkedTrain objects require that node values are of type string[]
// So I made some extra methods for computing these node values
class LinkedTrain extends LinkedList {
    offset: number = 0;

    constructor() {
        // Inherit this.head
        super();
        // Extend constructor
        this.offset = 0;
    }

    // Locate where a node's value and the next node's value meet
    /* If the node is the last in the linked list, return the distance, 
    in grid number of grid cells, from the ending edge of the grid */
    findJunction(index: number) {
        let current = this.valueAt(index);
        if (current != null) {
            let parent = current.value;
            let child = current.next ? current.next.value : null;

            if (child != null) {
                return parent.indexOf(child[0]);
            } else {
                return parent.length;
            }
        }
        return null
    }

    /* Calculate and return a node's total distance, in number of grid cells, 
    from the starting edge of the grid */
    findDistance(index: number) {
        let current = this.valueAt(index);
        if (current != null) {
            let parent: string[] = current.value;
            let child: string[] | null = current.next ? current.next.value : null;

            if (child != null) {
                return parent.indexOf(child[0]);
            } else {
                return 0;
            }
        }
        return 0;
    }

}

// Add all the stops for specified node into subgrid
// Subgrids in CSS allow a grid to inherit the cell dimensions of its parent, no matter how many cells it contains
// SUBGRID BE AWESOME
function _buildBranch(branch: Array<string>, x: number, y: number, color: string) {
    // Assign an array of all DOM representations of the branch's stops
    const l = branch.map((e: any, i: number) => {
        // Record all the filled grid cells so event listeners can be added
        let c = [x+i, y];
        coords[c.toString()] = e; // YOU DIDN'T SEE ANYTHING, FOOL!
        
        return (
            <div style={{backgroundColor: color}} key={i} className='h-[20px] w-full font-PublicSans text-sm flex items-center justify-center'>
                <div className='w-[1vw] h-[1vw] max-w-[14px] max-h-[14px] min-w-[10px] min-h-[10px] bg-white rounded-full'></div>
            </div>
        )
    });

    return l
}


function Stop({name, selectedRef, row, col}:{name: string | unknown, selectedRef: any[], row:number, col:number}) {
    const thisRef = useRef<HTMLDivElement | null>(null);

    return (
        <div ref={thisRef} onMouseEnter={() => selectedRef[1]({x:col, y:row, name: name})} style={{gridColumn: col, gridRow: row}} className="w-full h-full"></div>
    )
}


function Tooltip({ position , arrivalTimes } : { position: Position, arrivalTimes: ArrivalData }) {
    const formatTime = (date: Date | null) => {
        if (date == null) {
            return "Unavailable"
        }
        let timeLeft = Math.floor((date.getTime() - Date.now()) / 60000);
        switch (timeLeft) {
            case 0:
                return "Arriving now"
            case 1:
                return "Arriving soon"
            default:
                return timeLeft + " mins"
        }
    }

    return (
        <div style={{gridColumn: position.x, gridRow: position.y, borderColor: staticColor}} className='w-[150px] h-[150px] mt-8 bg-white border-[1px] transition-all p-2 justify-self-center'>
            <h1 style={{color: staticColor}} className='font-Inter text-md bold'>{arrivalTimes.name}</h1>
            <p className='font-Inter text-md text-gray-300'>{formatTime(arrivalTimes.left)}</p>
            <p className='font-Inter text-md text-gray-300'>{formatTime(arrivalTimes.right)}</p>
        </div>
    )
}


function RootBranch({children, rootList , trains , branches }: {children: JSX.Element[] | JSX.Element, rootList: JSX.Element[], trains: any, branches: string[][], branchNames: string[]}) {
    const [overflow, setOverflow] = useState(0);
    const [selectedRef, setSelectedRef] = useState<Position | null>(null);
    const [toolTip, setToolTip] = useState<JSX.Element | null>(null);

    useEffect(() => {
        /* when child grid goes out of the bounds of the parent grid,
        expand the bounds of the parent grid to offset the disparity */

        let offset = 0;
        for (var i = 0; i < branches.length; i++) {
            offset += trains.findJunction(i);
        }

        let boundDistance = offset - (rootList.length);
        if (boundDistance > 0) {
            setOverflow(boundDistance);
        }
    }, [children, rootList, branches, trains])

    const getCells = () => {
        let cellList: JSX.Element[] = [];
        for (const [key, value] of Object.entries(coords)) {
            const c = key.split(',');
            const col = parseInt(c[0]) + 1;
            const row = parseInt(c[1]) + 1;
            let element = <Stop name={value} selectedRef={[selectedRef, setSelectedRef]} row={row} col={col} />;
            cellList.push(element);
        }

        return cellList;
    }


    useEffect(() => {
        if (selectedRef != null) {
            fetchStopData(selectedRef).then((time: any) => {
                setToolTip(<Tooltip  position={selectedRef} arrivalTimes={time} />);
            })
        } else {
            setToolTip(null);
        }
    }, [selectedRef])

    return (
        <div style={{gridTemplateColumns: `repeat(${rootList.length + overflow}, 1fr)`}} className='relative flex-grow grid gap-y-3'>
            <div style={{gridTemplateColumns: 'subgrid', gridColumn: '1/'+(rootList.length+1)}} className='grid h-auto rounded-full overflow-hidden shadow-md'>{rootList}</div>
            {children}
            
            
            <div style={{gridTemplateColumns: 'subgrid', gridTemplateRows: `repeat(${React.Children.toArray(children).length+1}, minmax(0, 1fr))`}} className='grid absolute w-full h-full'>
                {getCells()}
                {toolTip}
            </div>
            
        </div>
    )
}


function ChildBranch(props: any) {

    return (
        <>
        <div style={{gridTemplateColumns: 'subgrid', gridColumn: props.start+'/'+(props.start+props.children.length)}} className='grid overflow-hidden rounded-full shadow-md'>
            {props.children}
        </div>
        </>
        
    )
}


export default function TrainMap({ branches , color , branchNames } : { branches : Array<string>[], color: string, branchNames: string[]}) {
    staticColor = color;
    const trains = new LinkedTrain();
    var currentBranch = branches[0];
    const fBranches = branches.map((b, i) => {
        if (i > 0) {
            currentBranch = sliceAtFirstMutual(currentBranch, b);
            return currentBranch
        } else {
            return currentBranch
        }
    })

    for (let branch of fBranches) {
        trains.insertLastNode(branch);
    }

    // map all of the child branches by slicing the branch list from the second index
    const branchList = fBranches.slice(1).map((branch, index) => {
        // set distance from border of contained grid to 0
        let offset = 0;

        // calculate distance between all nodes before current node
        for (var i = 0; i < index + 1; i++) {
            offset += trains.findDistance(i);
            
        }

        // render child branch starting on total offset distance of the contained grid
        return (
            <ChildBranch key={"child-branch-"+index} start={offset + 1}>{_buildBranch(branch, offset, index + 1, color)}</ChildBranch>
        )
    })

    return (
        <div className='flex flex-row w-full h-auto gap-x-2'>
            <RootBranch rootList={_buildBranch(fBranches[0], 0, 0, color)} trains={trains} branches={fBranches} branchNames={branchNames}>
            {branchList}
            </RootBranch>
            <div className='h-full w-auto flex flex-col gap-y-3'>
                {branchNames.map((name, index) => <div key={"branch-label-"+index} className='w-full flex-grow flex justify-center items-center'><div style={{color: color, backgroundColor: color+"45"}} className=' bg-gray-400 rounded-full text-[10px] py-[2px] px-[10px] drop-shadow-md h-auto w-auto font-Inter'>{name}</div></div>)}
            </div>
        </div>
    )
}