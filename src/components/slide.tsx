import React, { useState, useEffect, useRef } from 'react';
import { Button, FormControl } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../style/slideview.css'
// import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'


import ExamplePrompt from './examplePrompt';
import EditPanel from './slideComponents/editPanel';
// import SlideImage from './slideComponents/image';

interface IProps {
    exportSlideInfoPasteImg: Function
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
    modifySlideTitle: Function,
    egpromptSecs: Array<string>,
    pasteClipboard: string,
    getHow: Function,
    getWhy: Function,
    log: Function
}

function Slide(props: IProps) {
    const [subsectionList, setSubsectionList] = useState([<></>])
    const [layout, setLayout] = useState('row')
    // const [copySrc, setCopySrc] = useState(null as string | null)
    const [imgSrcs, setImgSrcs] = useState([] as Array<string>)
    const [imgBlocks, setImgBlocks] = useState(<></>)
    const [containEg, setContainEg] = useState(false)
    const [isModified, setModified] = useState(false)
    const [editingSubtitle, setEditingSubtitle] = useState('')
    const [titleDiv, setTitleDiv] = useState(<></>)
    const [editTitle, setEditTitle] = useState(false)
    const inputContent = useRef(null);
    const inputTitle = useRef(null)

    const parseContent = (content: string) => {
        const stns = content.split('\n')
        const results = {} as {
            [subtitle: string]: Array<string>
        }
        let latestSubtitle = ' ' as string
        for (let i = 0; i < stns.length; i++) {
            if (stns[i].length > 1 && stns[i].slice(0, 1) === '*') {
                if (!(latestSubtitle in results))
                    results[latestSubtitle] = []
                results[latestSubtitle].push(stns[i].slice(1))
            } else if (stns[i].length > 0) {
                latestSubtitle = stns[i]
                results[latestSubtitle] = []
            }
        }
        return results
    }

    const pasteChart = () => {
        props.log({
            actionName: 'paste-output',
            timestamp: new Date().toUTCString(),
            oldValue: props.title + ": " + props.subtitles[0],
            newValue: ''
        })

        const src = props.pasteClipboard
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
        props.exportSlideInfoPasteImg(src)
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
            // return <SlideImage src={src} layout={layout}></SlideImage>
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
            console.log("add images in slides")
        }
    }, [props.cellOutput])

    useEffect(() => {
        if (editTitle) {
            setTitleDiv(
                <div>
                    <FormControl
                        type='text'
                        ref={inputTitle}
                        defaultValue={props.title}
                    />
                    <Button
                        variant="outline-primary"
                        onClick={() => {
                            if (props.title !== inputTitle.current.value) {
                                props.modifySlideTitle(
                                    props.index,
                                    inputTitle.current.value,
                                    props.title,
                                    props.points
                                )
                            }
                            setEditTitle(false)
                        }}
                    >
                        OK
                    </Button>
                    <Button
                        variant="outline-primary"
                        onClick={() => {
                            setEditTitle(false)
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            )
        } else {
            setTitleDiv(
                <span
                    onDoubleClick={() => {
                        setEditTitle(true)
                    }}
                >
                    {props.title}
                </span>
            )
        }
    }, [props.title, editTitle])

    useEffect(() => {
        setSubsectionList(props.subtitles.map(subtitle => {
            let content = <></>

            if (subtitle === editingSubtitle) {
                let simpleMD = [] as Array<string>
                simpleMD.push(subtitle)
                if (props.points[subtitle])
                    props.points[subtitle].forEach(p => {
                        simpleMD.push("*" + p)
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
                                try {
                                    props.log({
                                        actionName: 'modify-slide',
                                        timestamp: new Date().toUTCString(),
                                        oldValue: props.title + subtitle,
                                        newValue: inputContent.current.value
                                    })
                                    const parsedResults = parseContent(inputContent.current.value)
                                    if (parsedResults && Object.keys(parsedResults).length > 0) {
                                        props.modifySlide(props.index, props.title, subtitle, parsedResults)
                                        setEditingSubtitle('')
                                        setModified(true)
                                    } else if (parsedResults && Object.keys(parsedResults).length == 0) {
                                        props.modifySlide(props.index, props.title, subtitle, {})
                                        setEditingSubtitle('')
                                        setModified(true)

                                    }
                                    else {
                                        alert('Not valide input, check the User Guide, example:\nsubtitle1\n*oint1\n*point2')
                                    }
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
                            backgroundColor: containEg ? '#feb24c' : '#2c7fb8',
                            visibility: isModified ? 'hidden' : 'visible'
                        }}
                    ></div>
                    <h2>{titleDiv}</h2>
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
                        log={props.log}
                        showHelp={
                            (() => {
                                let isShowHelp = false
                                props.subtitles.forEach(subtitle => {
                                    const why = props.getWhy(subtitle)
                                    const how = props.getHow(subtitle)
                                    if (why && why !== undefined) {
                                        isShowHelp = true
                                    }
                                    if (how && how !== undefined) {
                                        isShowHelp = true
                                    }
                                })
                                return isShowHelp
                            })() as boolean
                        }
                    />
                </div>
            </div>
        </>

    )
}

export default Slide;