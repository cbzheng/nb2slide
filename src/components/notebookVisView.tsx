import React, { useState, useEffect } from 'react';
import '../../style/slideview.css'
import { getOutputAreaElements, StaticNotebookCell } from '../notebookUtils';
import * as d3 from 'd3';
import { SlideCellRelation } from '../types/slideTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPoll } from '@fortawesome/free-solid-svg-icons'
import Switch from '@material-ui/core/Switch';

interface IProps {
    cells: Array<StaticNotebookCell>,
    navNBCb: Function,
    getNBCell: Function
    slidesMapToCells: { [title: string]: { [subtitle: string]: Array<Array<SlideCellRelation>> } },
    selectedTitle: string,
    selectedSubTitle: string
}

function NotebookVisView(props: IProps) {
    const [isShowOutputs, setIsShowOutputs] = useState(true)
    const [followCellLength, setFollowCellLength] = useState(true)
    const [notebookData, setNotebookData] = useState([])
    const [notebookVis, setNotebookVis] = useState(<></>)
    const [currentRelatedCells, setCurrentRelatedCells] = useState({} as { [cell_idx: number]: SlideCellRelation })
    const [codeLineExtent, setCodeLineExtent] = useState([Infinity, -Infinity])

    // prepare related cells data
    useEffect(() => {
        if (props.selectedTitle.length > 0 && props.selectedSubTitle.length > 0) {
            // extract related code cells
            const cellList = props.slidesMapToCells[props.selectedTitle]
            if (cellList && cellList[props.selectedSubTitle]) {
                const cells = cellList[props.selectedSubTitle]
                if (cells.length > 0) {
                    props.navNBCb(cells[0][0]['cell_idx'])
                }
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

        let minLen = Infinity
        let maxLen = -Infinity
        props.cells.forEach(cell => {
            const lines = cell.source.split('\n').filter(l => l.length > 1)
            lines.forEach(l => {
                if (l.length > maxLen) {
                    maxLen = l.length
                }
                if (l.length < minLen) {
                    minLen = l.length
                }
            })
        })
        setCodeLineExtent([minLen, maxLen])
    }, [props.cells])

    // compute the vis
    useEffect(() => {
        const panel = d3.select('#nb-vis-view')
        const { height, width } = (panel.node() as HTMLElement).getBoundingClientRect()
        const minCodeLineLength = 15
        const codeLineMargin = 5
        const minCellHeight = 3;
        const cellInterval = 2;

        // use pow(0.5) for better overview(assumption)
        const codeCellsHeightsSum = height - notebookData.length * (cellInterval + minCellHeight)
        let computeCellHeight: Function = (cellLen: any) => minCellHeight + codeCellsHeightsSum / notebookData.length

        if (followCellLength) {
            computeCellHeight = (cellLen: any) => minCellHeight * cellLen
        }

        let distExtend: Array<number> = d3.extent(Object.entries(currentRelatedCells).map(entry => {
            return entry[1].dist
        }))

        let blue = d3.scaleOrdinal(d3.schemeBlues[3])
            // @ts-ignore
            .domain([distExtend[0], distExtend[1]])

        let codeLineScale = d3.scaleLinear()
            .domain(codeLineExtent)
            .range(
                width > minCodeLineLength ?
                    [minCodeLineLength, width - codeLineMargin]
                    : [minCodeLineLength, 2 * minCodeLineLength]
            )

        //@ts-ignore
        setNotebookVis(notebookData.map((cellData, idx) => {
            let isAdjSameType = false
            if (idx > 0 && notebookData[idx - 1].code_type === notebookData[idx].code_type) {
                isAdjSameType = true
            }

            // set colors for related cells
            let color = cellData.code_type === 'markdown' ? '#ccc' : '#eee'
            let exHeight = 0
            if (cellData.index in currentRelatedCells) {
                // @ts-ignore
                color = blue(currentRelatedCells[cellData.index].dist)
                exHeight = 10
            }

            let cellOutput = null
            if (isShowOutputs) {
                cellOutput = getOutputAreaElements(props.getNBCell(cellData.index).node).output_arr[0].item(0)
                if (cellOutput !== null) {
                    cellOutput = cellOutput.getElementsByTagName('img');
                    if (cellOutput) cellOutput = cellOutput[0]
                    // @ts-ignore
                    if (cellOutput) cellOutput = cellOutput.cloneNode(true)
                }
            }

            let codeDetails = <></>
            if (followCellLength) {
                // visualize the code
                codeDetails = cellData.lines.map((line: Number) => {
                    return <div
                        style={{
                            width: codeLineScale(line).toString() + 'px',
                            height: '2px',
                            borderRadius: '1px',
                            backgroundColor: 'grey',
                            marginBottom: '1px',
                            marginLeft: '3px'
                        }}
                    />
                });
            }

            return (
                <div>
                    <div
                        className='nb-cell-rect'
                        style={{
                            height: (computeCellHeight(cellData.length) + exHeight).toString() + 'px',
                            marginTop: isAdjSameType ? '0px' : cellInterval.toString() + 'px',
                            width: (80).toString() + '%',
                            backgroundColor: color,
                            transitionDuration: '0.3s',
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            props.navNBCb(cellData.index)
                        }}
                    >
                        {codeDetails}
                    </div>
                    {
                        isShowOutputs && cellOutput !== null && cellOutput !== undefined &&

                        <img
                            src={
                                cellOutput.currentSrc
                            }
                            className='nb-cell-rect'
                            style={{
                                width: '80%',
                                marginTop: '3px',
                                marginBottom: '3px'
                            }}
                            onClick={() => {
                                props.navNBCb(cellData.index)
                            }}
                        ></img>
                        //  {/* <div dangerouslySetInnerHTML={{__html: (cellOutput as HTMLElement).innerHTML}} /> */}

                    }
                </div>
            )
        }))

    }, [notebookData, currentRelatedCells, isShowOutputs, followCellLength])

    return (
        <>
            <div id={'nb-vis-panel'}>
                <FontAwesomeIcon
                    className={"linking-icon icon-output"}
                    icon={faPoll}
                    size='2x'
                    style={{
                        color: isShowOutputs ? 'royalblue' : 'lightgrey'
                    }}
                />
                <Switch
                    defaultChecked={true}
                    onChange={() => {
                        setFollowCellLength(!followCellLength)
                        setIsShowOutputs(!isShowOutputs)
                    }}
                    color="primary"
                    name="checkedB"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                />
            </div>
            <div id={"nb-vis-view"}>
                {notebookVis}
            </div>
        </>
    )
}

export default NotebookVisView;