import React, {useState, useEffect} from 'react';
import '../../style/slideview.css'
import { StaticNotebookCell } from '../notebookUtils';
import * as d3 from 'd3'

interface IProps {
    cells: Array<StaticNotebookCell>
}

function NotebookVisView(props: IProps) {
    const [notebookData, setNotebookData] = useState([])

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

    useEffect(()=> {
        d3.selectAll("svg > *").remove()
        const svg = d3.select('#d3-panel')
        const {height, width} = (svg.node() as HTMLElement).getBoundingClientRect()
        const paddingLeft = "1rem"
        console.log(width, height)
        const codeLinesNum = notebookData.reduce((acc, cur) => { acc + cur.length}, 0)
        console.log(codeLinesNum)
        const lineHeight = height/codeLinesNum
        console.log(lineHeight)


        svg.append('g')
        .attr('x', paddingLeft)
    }, [notebookData])

    return (
        <>
            <div id={"nb-vis-view"}>
                <svg id='d3-panel' />
            </div>
        </>
    )
}

export default NotebookVisView;