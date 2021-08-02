import React, { useState, useEffect } from 'react';
import '../../style/slideview.css'
import { getOutputAreaElements, StaticNotebookCell } from '../notebookUtils';
import * as d3 from 'd3';
import { SlideCellRelation } from '../types/slideTypes';

interface IProps {
    cells: Array<StaticNotebookCell>,
    navNBCb: Function,
    getNBCell: Function
    slidesMapToCells: { [title: string]: { [subtitle: string]: Array<Array<SlideCellRelation>> } },
    selectedTitle: string,
    selectedSubTitle: string,
    mode: string
}

function NotebookVisView(props: IProps) {
    const [notebookData, setNotebookData] = useState([])
    const [notebookVis, setNotebookVis] = useState(<></>)
    const [currentRelatedCells, setCurrentRelatedCells] = useState({} as { [cell_idx: number]: SlideCellRelation })

    // prepare related cells data
    useEffect(() => {
        console.log('set cells')
        if (props.selectedTitle.length > 0 && props.selectedSubTitle.length > 0) {
            // extract related code cells
            const cells = props.slidesMapToCells[props.selectedTitle][props.selectedSubTitle]
            if (cells) {
                const cellArray = {} as { [cell_idx: number]: SlideCellRelation }
                cells.forEach(cArray => {
                    cellArray[cArray[0]['cell_idx']] = cArray[0]
                })
                setCurrentRelatedCells(cellArray)
            } else {
                setCurrentRelatedCells({})
            }
        }
    }, [props.slidesMapToCells, props.selectedTitle, props.selectedSubTitle])

    // prepare data
    useEffect(() => {
        setNotebookData(props.cells.map(cell => {
            const lines = cell.source.split('\n').filter(l => l.length > 1)
            const codeLineLength = lines.map(l => l.length)

            return {
                index: cell.index,
                code_type: cell.cell_type,
                length: lines.length,
                lines: codeLineLength
            }
        }))
    }, [props.cells])

    // compute the vis
    useEffect(() => {
        const panel = d3.select('#nb-vis-view')
        const { height } = (panel.node() as HTMLElement).getBoundingClientRect()
        const minCellHeight = 2;
        const cellInterval = 2
        console.log(height)

        // use pow(0.5) for better overview(assumption)
        const codeLinesNum = notebookData.reduce((acc, cur) => acc + Math.pow(cur.length, 0.5), 0)
        const codeCellsHeightsSum = height - notebookData.length * (cellInterval + minCellHeight)
        const codeCellHeightScaler = codeCellsHeightsSum / codeLinesNum
        const computeCellHeight: Function = (cellLen: any) => minCellHeight + Math.pow(cellLen, 0.5) * codeCellHeightScaler

        let distExtend: Array<number> = d3.extent(Object.entries(currentRelatedCells).map(entry => {
            return entry[1].dist
        }))

        let orange = d3.scaleOrdinal(d3.schemeOranges[3])
            // @ts-ignore
            .domain([distExtend[1], distExtend[0]])

        //@ts-ignore
        setNotebookVis(notebookData.map((cellData, idx) => {
            let isAdjSameType = false
            if (idx > 0 && notebookData[idx - 1].code_type === notebookData[idx].code_type) {
                isAdjSameType = true
            }

            // set colors for related cells
            let color = cellData.code_type === 'markdown' ? '#ccc' : '#eee'
            let exHeight = 0
            let exWidth = 0
            if (cellData.index in currentRelatedCells) {
                // @ts-ignore
                color = orange(currentRelatedCells[cellData.index].dist)
                exHeight = 10
                exWidth = 30
            }

            let cellOutput = null
            if (props.mode === 'detail') {
                cellOutput = getOutputAreaElements(props.getNBCell(cellData.index).node).output_arr[0].item(0)
                if (cellOutput !== null) {
                    cellOutput = cellOutput.getElementsByTagName('img');
                    console.log(cellOutput)
                    if (cellOutput) cellOutput = cellOutput[0]
                    // @ts-ignore
                    if (cellOutput) cellOutput = cellOutput.cloneNode(true)
                }
            }

            return (
                <div>
                    <div
                        className='nb-cell-rect'
                        style={{
                            height: (computeCellHeight(cellData.length) + exHeight).toString() + 'px',
                            marginTop: isAdjSameType ? '0px' : cellInterval.toString() + 'px',
                            width: (50 + exWidth).toString() + '%',
                            backgroundColor: color,
                            transitionDuration: '0.3s',
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            console.log('on click')
                            props.navNBCb(cellData.index)
                        }}
                    >
                    </div>
                    {
                        props.mode === 'detail' && cellOutput !== null && cellOutput !== undefined &&

                        <img src={
                            cellOutput.currentSrc
                        } style={{width: '100%'}}></img>
//  {/* <div dangerouslySetInnerHTML={{__html: (cellOutput as HTMLElement).innerHTML}} /> */}

                    }
                </div>
            )
        }))

    }, [notebookData, currentRelatedCells, props.mode])

    return (
        <>
            <div id={"nb-vis-view"}>
                {notebookVis}
            </div>
        </>
    )
}

export default NotebookVisView;