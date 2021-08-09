import React, { useState, useEffect } from 'react';
import '../../style/slideview.css'
import { InputGroup, FormControl, Button, Popover, OverlayTrigger, Badge } from 'react-bootstrap'
import { faPlusSquare, faMinusSquare, faFileExport } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ExamplePrompt from './examplePrompt';

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
    egprompt: boolean
}

function Slide(props: IProps) {
    const [pointsList, setPointsList] = useState([<></>])
    const [selectedPoint, setSelectedPoint] = useState(-1)
    const [layout, setLayout] = useState('row')

    const popoverExport = (
        <Popover id="popover-export">
            <Popover.Header as="h3">Export Slides</Popover.Header>
            <Popover.Body style={{ display: 'flex', flexDirection: 'column' }}>
                <Button variant="outline-primary" style={{ marginBottom: '0.5rem' }}>
                    Export Single Slide
                </Button>
                <Button variant="outline-primary" onClick={() => { props.exportSlides() }}>
                    Export Slides
                </Button>
            </Popover.Body>
        </Popover>
    )

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
                    <h3>{props.title}</h3>
                    <h5>
                        {props.subtitle}
                        {
                            props.egprompt && 
                            <Badge bg="danger" style={{marginLeft: '1rem'}}>TODO</Badge>
                        }
                    </h5>
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
                            </div>
                    }
                    <div className='slide-index'>{props.index}</div>
                    <div className={'edit-icon-list'} onClick={(e) => { e.stopPropagation() }}>
                        <div id='edit-panel'>
                            <FontAwesomeIcon
                                className={"edit-icon icon-add"}
                                icon={faPlusSquare}
                                size="2x"
                                onClick={() => props.addSlide(props.title, props.subtitle)}
                            />
                            <FontAwesomeIcon
                                className={"edit-icon icon-minus"}
                                icon={faMinusSquare}
                                size="2x"
                                onClick={() => props.removeSlide(props.title, props.subtitle)}
                            />
                            <div
                            >
                                <OverlayTrigger
                                    trigger='click'
                                    key='export'
                                    placement='left'
                                    overlay={popoverExport}
                                >
                                    <Button variant="link" style={{ padding: '0' }}>
                                        <FontAwesomeIcon
                                            className={"edit-icon icon-edit"}
                                            icon={faFileExport}
                                            size="2x"
                                        />
                                    </Button>
                                </OverlayTrigger>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Slide;