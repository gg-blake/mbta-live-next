import React from 'react';
import {useEffect, useState, useRef } from 'react';
import LinkedList from '../utils/linked-list';
import { Position , ArrivalData, ArrivalDataState } from '../utils/types';
import { fetchStopData } from '../utils/mbta-fetch';
import { sliceAtFirstMutual } from '../utils/operations';

/* I made a variable with a global scope so that once the color prop is passed within TrainMap, 
it can be accessed by other separate components */
var staticColor:string = "#000000";

// Global variable stores all stops grid positions
// This is useful for adding event listeners to grid segments
var coords: any[] = [];

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
function _buildBranch(branches: string[][], branch: Array<string>, x: number, y: number, color: string) {
    /* Determine the number of coord entries that should be
    present on the loaded train map */
    var count = 0;
    branches.map(branch => {
        branch.map(() => {
            count++
        })
    })

    // To prevent overlap of other subway stops, reset the properties of coords
    if (coords.length > count) {
        coords = [];
    }

    

    // Assign an array of all DOM representations of the branch's stops
    const l = branch.map((e: any, i: number) => {
        // Record all the filled grid cells so event listeners can be added
        
        if (!coords.find((coord) => (coord.name == e && coord.x == x+i && coord.y == y))) {
            // Prevent stop duplicates from being added to coords
            coords.push({x: x+i, y: y, name: e});
        }

        const css = `
        .stop {
            border-color: ${color+"30"};
        }

        .stop:hover {
            border-width: 4px;
        }
        `
        
        return (
            <div style={{backgroundColor: color}} key={i} className='h-[20px] w-full font-PublicSans text-sm flex items-center justify-center'>
                <style>{css}</style>
                <div className='stop w-[1vw] h-[1vw] max-w-[14px] max-h-[14px] min-w-[10px] min-h-[10px] bg-white rounded-full'></div>
            </div>
        )
    });

    return l
}


function Stop({name, selectedRef, row, col}:{name: string | unknown, selectedRef: any[], row:number, col:number}) {
    const thisRef = useRef<HTMLDivElement | null>(null);

    return (
        <div ref={thisRef} onMouseEnter={() => selectedRef[1]({x:col, y:row, name: name})} style={{gridColumn: col, gridRow: row}} className="w-full h-full flex items-center justify-center">
            <div style={{borderColor: staticColor+"45"}} className='absolute w-[1vw] h-[1vw] rounded-full border-0 hover:border-[10px] hover:w-[calc(1vw_+_20px)] hover:h-[calc(1vw_+_20px)] transition-all'></div>
        </div>
    )
}


function Connection({row, col, isEndpoint=false}: {row: number, col: number, isEndpoint: boolean}) {
    return (
        <div style={{gridColumn: col, gridRow: `${row - 1} / span 2`}} className="w-full h-full flex flex-col justify-center items-center relative rounded-full py-[2px]">
            <div style={{borderRadius: `${isEndpoint ? "0px 0px .6vw .6vw" : ".6vw"}`, borderWidth: `${isEndpoint ? "0 2px 2px 2px" : "2px"}`}} className='w-[1.2vw] h-[100%] border-[2px] max-w-[15px] border-black bg-white z-30 font-PublicSans text-black text-md'></div>
        </div>
    )
}


function RootBranch({data, children, rootList , trains , branches }: {data: ArrivalDataState, children: JSX.Element[] | JSX.Element, rootList: JSX.Element[], trains: any, branches: string[][], branchNames: string[]}) {
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


    useEffect(() => {
        var count = 0;
        branches.map(branch => {
            branch.map(() => {
                count++
            })
        })
        if (coords.length > count) {
            do {
                coords = [];
                getCells();
            } while (coords.length > count);
        } else {
            getCells();
        }
        
    }, [])

    const getCells = () => {
        let cellList: JSX.Element[] = [];
        let connectorRows: number[] = [1];
        let connectorCols: number[] = [];

        for (let obj of coords) {
            const col = obj.x + 1;
            const row = obj.y + 1;
            if (!connectorRows.includes(row)) {
                connectorRows.push(row);
                cellList.push(<Connection row={row} col={col} isEndpoint={connectorCols.includes(col)} key={row} />);
                connectorCols.push(col);
            } else {
                let element = <Stop name={obj.name} selectedRef={[selectedRef, setSelectedRef]} row={row} col={col} />;
                cellList.push(element);
            }
            
        }

        return cellList;
    }


    useEffect(() => {
        if (selectedRef != null) {
            fetchStopData(selectedRef).then((time: any) => {
                data[1](time);
            })
        } else {
            setToolTip(null);
        }
        
    }, [selectedRef])

    return (
        <div style={{gridTemplateColumns: `repeat(${rootList.length + overflow}, 1fr)`}} className='relative flex-grow grid gap-y-3'>
            <div style={{gridTemplateColumns: 'subgrid', gridColumn: '1/'+(rootList.length+1)}} className='grid h-auto rounded-full overflow-hidden shadow-md'>{rootList}</div>
            {children}
            
            
            <div style={{gridTemplateColumns: 'subgrid', gridTemplateRows: `repeat(${React.Children.toArray(children).length+1}, minmax(0, 1fr))`}} className='grid absolute w-full h-full gap-y-3'>
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


export default function TrainMap({ data, branches , color , branchNames } : { data: ArrivalDataState, branches : Array<string>[], color: string, branchNames: string[]}) {
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
            <ChildBranch key={"child-branch-"+index} start={offset + 1}>{_buildBranch(branches, branch, offset, index + 1, color)}</ChildBranch>
        )
    })

    return (
        <div className='flex flex-row w-full h-auto gap-x-2'>
            <RootBranch data={data} rootList={_buildBranch(branches, fBranches[0], 0, 0, color)} trains={trains} branches={fBranches} branchNames={branchNames}>
            {branchList}
            </RootBranch>
            <div className='h-full w-auto flex flex-col gap-y-3'>
                {branchNames.map((name, index) => <div key={"branch-label-"+index} className='w-full flex-grow flex justify-center items-center'><div style={{color: color, backgroundColor: color+"45"}} className=' bg-gray-400 rounded-full text-[10px] py-[2px] px-[10px] drop-shadow-md h-auto w-auto font-Inter'>{name}</div></div>)}
            </div>
        </div>
    )
}