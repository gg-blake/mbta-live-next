import '../../../styles/Train.module.css';
import MBTA from 'mbta-client';
import {useEffect, useState, useRef, useImperativeHandle, useInsertionEffect} from 'react';
import NextApp from 'next';
import React, { ReactNode } from "react";
import JSXStyle from 'styled-jsx/style';
import { createSecureContext } from 'tls';
import LinkedList from '../utils/linked-list';
import { Area , Position , ArrivalData } from '../utils/types';
import { callbackify } from 'util';

const mbta = new MBTA('7226f7ee55514c019819bac6eacdaad9');

var staticColor:string = "#000000";

var coords = {};

  
async function getNextTrainTime(stop_id, direction_id) {
    const handleResponse = res => {
        // filter for upcoming train times that have a valid timestamp
        var times = res.data.map(d => {
            if (d.attributes.arrival_time != null) {
                var timestamp = new Date(d.attributes.arrival_time);

                if (timestamp.getTime() > Date.now()) {
                    return timestamp
                }
            }
        }).filter(d => d != null);

        // find the soonest arriving train predicted to be arriving
        var nearestArrival = null;
        for (var timestamp of times) {
            if (nearestArrival != null) {
                nearestArrival = compareDates(timestamp, nearestArrival);
            } else {
                nearestArrival = timestamp;
            }
        }

        // returns the soonest arriving train timestamp (returns 'null' if station unavailable)
        return nearestArrival
    }

    return await mbta.fetchPredictions({stop: stop_id, sort:"arrival_time", limit:10, direction_id:direction_id}).then(res => handleResponse(res));

}
  
function compareDates(a, b) {
    // compares two Date objects and returns the lowest of the two
    if (a.getTime() > b.getTime()) {
        return b
    } else if (a.getTime() < b.getTime()) {
        return a
    } else {
        return b
    }
}


function sliceAtFirstMutual(a: string[], b: string[]) {
    // Accepts two arrays of strings as inputs
    // Returns spliced segment of Array B starting from first shared value with Array A
    var index: number = 0;
    let indices = b.map(i => {
        return a.lastIndexOf(i)
    })
    index = b.indexOf(a[Math.max(...indices)]);
    return b.slice(index)
    
    
}


class LinkedTrain extends LinkedList {
    offset: number = 0;

    constructor() {
        super();
        this.offset = 0;
    }

    findJunction(index: number) {
        let current = this.valueAt(index);
        let parent = current.value;
        let child = current.next ? current.next.value : null;

        if (child != null) {
            return parent.indexOf(child[0]);
        } else {
            return parent.length;
        }
        
        console.log(parent, child);
    }

    findDistance(index: number) {
        let current = this.valueAt(index);
        let parent = current.value;
        let child = current.next ? current.next.value : null;

        if (child != null) {
            return parent.indexOf(child[0]);
        } else {
            return 0;
        }
    }

}


function buildBranch(branch: Array<string>, x, y, color: string) {

    const l = branch.map((e: any, i: number) => {
        coords[[x+i, y]] = e;
        
        return (
            <div style={{backgroundColor: color}} key={i} className='h-[20px] w-full font-PublicSans text-sm flex items-center justify-center'>
                <div className='w-4 h-4 bg-white rounded-full'></div>
            </div>
        )
    });

    return l
}


function Stop({name, selectedRef, row, col}:{name: string, selectedRef: any[], row:number, col:number}) {
    const thisRef = useRef<HTMLDivElement | null>(null);

    return (
        <div ref={thisRef} onMouseEnter={() => selectedRef[1]({x:col, y:row, name: name})} style={{gridColumn: col, gridRow: row}} className="w-full h-full"></div>
    )
}


function Tooltip({ position , arrivalTimes } : { position: Position, arrivalTimes: ArrivalData }) {
    return (
        <div style={{gridColumn: position.x, gridRow: position.y, borderColor: staticColor}} className='w-[150px] h-[150px] mt-8 bg-white border-[1px] transition-all p-2 justify-self-center'>
            <h1 style={{color: staticColor}} className='font-Inter text-md bold'>{arrivalTimes.name}</h1>
            <p className='font-Inter text-md text-gray-300'>{Math.floor((arrivalTimes.left?.getTime() - Date.now()) / 60000) + "mins"}</p>
            <p className='font-Inter text-md text-gray-300'>{Math.floor((arrivalTimes.right?.getTime() - Date.now()) / 60000) + "mins"}</p>
        </div>
    )
}


function RootBranch({children, rootList , trains , branches , d0, d1 }: {children: JSX.Element[] | JSX.Element, rootList: JSX.Element[], trains: LinkedTrain, branches: Array<string>[], d0: string, d1: string}) {
    const [overflow, setOverflow] = useState(0);
    const [selectedRef, setSelectedRef] = useState<Position | null>(null);
    const [toolTip, setToolTip] = useState<JSX.Element | null>(null);
    const [arrivalTimes, setArrivalTimes] = useState<ArrivalData | null>(null);

    useEffect(() => computeBounds(), [children])

    function computeBounds() {
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
    }

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
            getNextTrainTime(selectedRef.name, 0).then(responseA => {
                getNextTrainTime(selectedRef.name, 1).then(responseB => {
                    mbta.fetchStops({id:selectedRef.name}).then((responseC: any) => {
                        let arrivalTimes: ArrivalData = {
                            right: responseA,
                            left: responseB,
                            name: responseC.data[0].attributes.name
                        }
                        setToolTip(<Tooltip  position={selectedRef} arrivalTimes={arrivalTimes} />);
                    })
                })
            });
            
            
        } else {
            setToolTip(null);
        }
    }, [selectedRef])

    return (
        <div style={{gridTemplateColumns: `repeat(${rootList.length + overflow}, 1fr)`}} className='relative w-full grid gap-y-3'>
            <div style={{gridTemplateColumns: 'subgrid', gridColumn: '1/'+(rootList.length+1)}} className='grid h-auto rounded-full overflow-hidden rounded-full shadow-md'>{rootList}</div>
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
        <div style={{gridTemplateColumns: 'subgrid', gridColumn: props.start+'/'+(props.start+props.children.length)}} className='grid overflow-hidden rounded-full shadow-md'>
            {props.children}
        </div>
    )
}


export default function TrainMap({ branches , color } : { branches : Array<string>[], color: string}) {
    const [overflow, setOverflow] = useState(0);
    const [table, setTable] = useState(<div className='hi'></div>);
    
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

    console.log(fBranches);

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
            <ChildBranch start={offset + 1}>{buildBranch(branch, offset, index + 1, color)}</ChildBranch>
        )
    })

    return (
        <RootBranch rootList={buildBranch(fBranches[0], 0, 0, color)} trains={trains} branches={fBranches}>
            {branchList}
        </RootBranch>
    )
}