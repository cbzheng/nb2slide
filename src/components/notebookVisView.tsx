import React, { useState, useEffect } from 'react';
import '../../style/slideview.css'
import { StaticNotebookCell } from '../notebookUtils';
import * as d3 from 'd3';

interface IProps {
    cells: Array<StaticNotebookCell>
}

function NotebookVisView(props: IProps) {
    const [notebookData, setNotebookData] = useState([])
    const [notebookVis, setNotebookVis] = useState(<></>)

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

    useEffect(() => {
        const panel = d3.select('#nb-vis-view')
        const { height } = (panel.node() as HTMLElement).getBoundingClientRect()
        const minCellHeight = 2;
        const cellInterval = 2
        console.log(height)

        // use pow(0.5) for better overview(assumption)
        const codeLinesNum = notebookData.reduce((acc, cur) => acc + Math.pow(cur.length, 0.5), 0)
        const codeCellsHeightsSum = height - notebookData.length * (cellInterval +  minCellHeight)
        const codeCellHeightScaler = codeCellsHeightsSum / codeLinesNum
        const computeCellHeight: Function = (cellLen: any) => minCellHeight + Math.pow(cellLen, 0.5) * codeCellHeightScaler

        //@ts-ignore
        setNotebookVis(notebookData.map((cellData, idx) => {
            let isAdjSameType = false
            if (idx > 0 && notebookData[idx-1].code_type === notebookData[idx].code_type) {
                isAdjSameType = true
            }
            return (
                <div
                    className='nb-cell-rect'
                    style={{
                        height: computeCellHeight(cellData.length).toString() + 'px',
                        marginTop: isAdjSameType? '0px': cellInterval.toString() + 'px',
                        width: '80%',
                        backgroundColor: cellData.code_type === 'markdown'? '#ddd': '#ccc'
                    }}
                >
                </div>
            )
        }))

    }, [notebookData])

    return (
        <>
            <div id={"nb-vis-view"}>
                {notebookVis}
            </div>
        </>
    )
}

export default NotebookVisView;