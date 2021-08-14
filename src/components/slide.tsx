import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../style/slideview.css'
// import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'


import ExamplePrompt from './examplePrompt';
import EditPanel from './slideComponents/editPanel';

interface IProps {
    index: number,
    title: string,
    subtitles: Array<string>,
    points: {
        [subtitle: string]: string[];
    },
    select: boolean,
    handleClick: React.MouseEventHandler<HTMLDivElement>;
    cellOutput: string | null,
    exportSlides: Function,
    removeSlide: Function,
    addSlide: Function,
    egpromptSecs: Array<string>,
    pasteClipboard: Function
}

function Slide(props: IProps) {
    const [subsectionList, setSubsectionList] = useState([<></>])
    const [layout, setLayout] = useState('row')
    const [copySrc, setCopySrc] = useState(null as string | null)
    const [containEg, setContainEg] = useState(false)

    const pasteChart = () => {
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
        setSubsectionList(props.subtitles.map(subtitle => {
            const egOrNot = props.egpromptSecs.includes(subtitle)
            setContainEg(egOrNot)
            let content = <></>

            if (egOrNot) {
                content = <ExamplePrompt points={props.points[subtitle]}></ExamplePrompt>
            } else {
                content = (
                    <ul
                        className='slide-point-list'
                    >
                        {
                            props.points[subtitle].map(point => {
                                return <li className='slide-point'>
                                    {point}
                                </li>
                            })
                        }
                    </ul>
                )
            }

            return (
                <div>
                    <h4>
                        {subtitle}
                    </h4>
                    {content}
                </div>
            )
        }))
    }, [props.subtitles, props.points])


    return (
        <>
            <div
                id={'section-' + props.title + '-sub-' + props.subtitles[0]}
                onClick={props.handleClick}
                className={props.select ? "sl-box sl-current-box" : "sl-box"}
            >
                <div className={"slide"}>
                    <div
                        className='status-circle'
                        style={{
                            backgroundColor: containEg ? '#feb24c' : '#2c7fb8'
                        }}
                    ></div>
                    <h2>{props.title}</h2>
                    <div
                        style={{
                            display: 'flex',
                            // @ts-ignore
                            flexDirection: layout
                        }}>
                        <div
                            style={{
                                width: props.cellOutput && layout == 'row' ? "50%" : "100%"
                            }}
                        >
                            {subsectionList}
                        </div>
                    </div>
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
                    <div className='slide-index'>{props.index}</div>
                    <EditPanel
                        addSlide={props.addSlide}
                        removeSlide={props.removeSlide}
                        title={props.title}
                        subtitle={props.subtitles[0]}
                        exportSlides={props.exportSlides}
                        paste={pasteChart}
                    />
                </div>
            </div>
        </>

    )
}

export default Slide;