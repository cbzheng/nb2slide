import React, { useState, useEffect } from 'react';
import '../../style/slideview.css'
import { InputGroup, FormControl, Button } from 'react-bootstrap'

interface IProps {
    title: string,
    subtitle: string,
    points: Array<string>,
    select: boolean,
    handleClick: React.MouseEventHandler<HTMLDivElement>;
    cellOutput: string | null
}

function Slide(props: IProps) {
    const [pointsList, setPointsList] = useState([<></>])
    const [selectedPoint, setSelectedPoint] = useState(-1)
    const [layout, setLayout] = useState('row')

    useEffect(() => {
        const img = new Image();
        img.onload = function() {
            // @ts-ignore
            if (this.width / this.height > 1.2)
                setLayout('column')
        }
        console.log('img')
        img.src = props.cellOutput;
    }, [props.cellOutput])

    useEffect(() => {
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
                    <h4>{props.subtitle}</h4>
                    <div
                        style={{
                            display: 'flex',
                            // @ts-ignore
                            flexDirection: layout
                        }}>
                        <ul 
                            className='slide-point-list'
                            style={{
                                width: props.cellOutput && layout=='row'? "50%": "100%"
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
                                    width: layout=='row'? '50%': '60%',
                                    marginTop: '3px',
                                    marginBottom: '3px'
                                }}
                            // onClick={() => {
                            //     props.navNBCb(cellData.index)
                            // }}
                            ></img>
                        }
                    </div>
                </div>
            </div>
        </>

    )
}

export default Slide;