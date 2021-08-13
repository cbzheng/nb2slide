import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../style/slideview.css'
import { InputGroup, FormControl, Button } from 'react-bootstrap'
// import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'


import ExamplePrompt from './examplePrompt';
import EditPanel from './slideComponents/editPanel';

interface IProps {
    index: number,
    title: string,
    subtitle: string,
    points: Array<string>,
    select: boolean,
    handleClick: React.MouseEventHandler<HTMLDivElement>;
    cellOutput: string | null,
    exportSlides: Function,
    removeSlide: Function,
    addSlide: Function,
    egprompt: boolean,
    pasteClipboard: Function
}

function Slide(props: IProps) {
    const [pointsList, setPointsList] = useState([<></>])
    const [selectedPoint, setSelectedPoint] = useState(-1)
    const [layout, setLayout] = useState('row')
    const [copySrc, setCopySrc] = useState(null as string | null)

    const pasteChart = () => {
        console.log('paste')
        const src = props.pasteClipboard()
        if (src.length <= 0) {
            return
        }
        const img = new Image();
        img.onload = function () {
            // @ts-ignore
            if (this.width / this.height > 1.2)
                setLayout('column')
        }
        img.src = src
        setCopySrc(src)
    }

    useEffect(() => {
        const img = new Image();
        img.onload = function () {
            // @ts-ignore
            if (this.width / this.height > 1.2)
                setLayout('column')
        }
        img.src = props.cellOutput;
    }, [props.cellOutput])

    useEffect(() => {
        console.log(props.subtitle, props.points)
        if (props.points !== undefined) {
            setPointsList(props.points.map((point, i) => {
                if (selectedPoint === i) {
                    return (
                        <InputGroup className="mb-3">
                            <FormControl
                                // placeholder={point}
                                value={point}
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                            />
                            <Button variant="outline-secondary" id="button-addon2">
                                Ok
                            </Button>
                            <Button variant="outline-secondary" id="button-addon2">
                                Cancel
                            </Button>
                        </InputGroup>
                    )
                }

                return (
                    <li className='slide-point' onDoubleClick={() => {
                        console.log('double click')
                        setSelectedPoint(i)
                    }}>
                        {point}
                    </li>
                )
            }))
        } else {
            setPointsList(
                [<li></li>]
            )
        }
    }, [props.points, selectedPoint])


    return (
        <>
            <div
                id={'section-' + props.title + '-sub-' + props.subtitle}
                onClick={props.handleClick}
                className={props.select ? "sl-box sl-current-box" : "sl-box"}
            >
                <div className={"slide"}>
                    <div 
                        className='status-circle'
                        style={{
                            backgroundColor: props.egprompt? '#feb24c': '#2c7fb8'
                        }}
                    ></div>
                    <h2>{props.title}</h2>
                    <h4>
                        {props.subtitle}
                    </h4>
                    {
                        props.egprompt ?
                            <ExamplePrompt points={props.points}></ExamplePrompt> :
                            <div
                                style={{
                                    display: 'flex',
                                    // @ts-ignore
                                    flexDirection: layout
                                }}>
                                <ul
                                    className='slide-point-list'
                                    style={{
                                        width: props.cellOutput && layout == 'row' ? "50%" : "100%"
                                    }}
                                >
                                    {pointsList}
                                </ul>
                                {
                                    props.cellOutput && <img
                                        src={
                                            props.cellOutput
                                        }
                                        className='nb-cell-rect'
                                        style={{
                                            width: layout == 'row' ? '50%' : '60%',
                                            marginTop: '3px',
                                            marginBottom: '3px'
                                        }}
                                    // onClick={() => {
                                    //     props.navNBCb(cellData.index)
                                    // }}
                                    ></img>
                                }
                                {
                                    copySrc && 
                                    <img
                                        src={
                                            copySrc
                                        }
                                        className='nb-cell-rect'
                                        style={{
                                            width: layout == 'row' ? '50%' : '60%',
                                            marginTop: '3px',
                                            marginBottom: '3px'
                                        }}
                                    ></img>
                                }
                            </div>
                    }
                    <div className='slide-index'>{props.index + 1}</div>
                    <EditPanel 
                        addSlide={props.addSlide}
                        removeSlide={props.removeSlide}
                        title={props.title}
                        subtitle={props.subtitle}
                        exportSlides={props.exportSlides}
                        paste={pasteChart}
                    />
                </div>
            </div>
        </>

    )
}

export default Slide;