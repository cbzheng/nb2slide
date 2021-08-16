import React, { useState, useEffect, useRef } from 'react';
import { Button, FormControl } from 'react-bootstrap';
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
    modifySlide: Function,
    egpromptSecs: Array<string>,
    pasteClipboard: Function,
    getHow: Function,
    getWhy: Function
}

function Slide(props: IProps) {
    const [subsectionList, setSubsectionList] = useState([<></>])
    const [layout, setLayout] = useState('row')
    // const [copySrc, setCopySrc] = useState(null as string | null)
    const [imgSrcs, setImgSrcs] = useState([] as Array<string>)
    const [imgBlocks, setImgBlocks] = useState(<></>)
    const [containEg, setContainEg] = useState(false)
    const [editingSubtitle, setEditingSubtitle] = useState('')
    const inputContent = useRef(null);

    const parseContent = (content: string) => {
        const stns = content.split('\n')
        const results = {} as {
            [subtitle: string]: Array<string>
        }
        let latestSubtitle = null as string | null
        for (let i = 0; i < stns.length; i++) {
            if (stns[i].length > 2 && stns[i].slice(0, 2) === '* ') {
                if (!latestSubtitle) {
                    return Error
                }
                results[latestSubtitle].push(stns[i].slice(2))
            } else {
                latestSubtitle = stns[i]
                results[latestSubtitle] = []
            }
        }
        return results
    }

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
        // setCopySrc(src)
        setImgSrcs([...imgSrcs, src])
    }

    useEffect(() => {
        let imgList = imgSrcs.map((src) => {
            return <img
                src={
                    src
                }
                className='nb-cell-rect'
                style={{
                    width: layout == 'row' ? '50%' : '70%',
                    marginTop: '3px',
                    marginBottom: '3px'
                }}
            ></img>
        })
        setImgBlocks(
            <div>
                {imgList}
            </div>
        )
    }, [imgSrcs])

    useEffect(() => {
        if (props.cellOutput) {
            const img = new Image();
            img.onload = function () {
                // @ts-ignore
                if (this.width / this.height > 1.2)
                    setLayout('column')
            }
            img.src = props.cellOutput;
            setImgSrcs([...imgSrcs, props.cellOutput])
        }
    }, [props.cellOutput])

    useEffect(() => {
        setSubsectionList(props.subtitles.map(subtitle => {
            let content = <></>

            if (subtitle === editingSubtitle) {
                let simpleMD = [] as Array<string>
                simpleMD.push(subtitle)
                if (props.points[subtitle])
                    props.points[subtitle].forEach(p => {
                        simpleMD.push("* " + p)
                    })

                content = (
                    <div>
                        <FormControl
                            as='textarea'
                            ref={inputContent}
                            style={{ height: '100px' }}
                            defaultValue={simpleMD.join('\n')}
                        />
                        <Button
                            variant="outline-primary"
                            onClick={() => {
                                console.log(inputContent.current.value)
                                try {
                                    const parsedResults = parseContent(inputContent.current.value)
                                    props.modifySlide(props.index, props.title, subtitle, parsedResults)
                                    setEditingSubtitle('')
                                } catch (Error) {
                                    alert('Not valide slide modification!')
                                }
                            }}
                        >Ok</Button>
                        <Button
                            variant="outline-primary"
                            onClick={() => {
                                setEditingSubtitle('')
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                )
            } else {
                const egOrNot = props.egpromptSecs.includes(subtitle)
                setContainEg(egOrNot)
                if (egOrNot) {
                    content = <ExamplePrompt points={props.points[subtitle]}></ExamplePrompt>
                } else {
                    content = (
                        <ul
                            className='slide-point-list'
                        >
                            {
                                props.points[subtitle] && props.points[subtitle].map(point => {
                                    return <li className='slide-point'>
                                        {point}
                                    </li>
                                })
                            }
                        </ul>
                    )
                }
            }

            return (
                <div
                    className='subtitle-content'
                    onDoubleClick={() => {
                        setEditingSubtitle(subtitle)
                    }}
                >
                    {
                        subtitle === editingSubtitle ? content : <>
                            <h4>
                                {subtitle}
                            </h4>
                            {content}
                        </>
                    }
                </div>
            )
        }))
    }, [props.subtitles, props.points, editingSubtitle])


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
                    {imgBlocks}
                    <div className='slide-index'>{props.index}</div>
                    <EditPanel
                        addSlide={() => { props.addSlide(props.index) }}
                        removeSlide={() => { props.removeSlide(props.index) }}
                        title={props.title}
                        subtitles={props.subtitles}
                        exportSlides={props.exportSlides}
                        paste={pasteChart}
                        getWhy={props.getWhy}
                        getHow={props.getHow}
                    />
                </div>
            </div>
        </>

    )
}

export default Slide;