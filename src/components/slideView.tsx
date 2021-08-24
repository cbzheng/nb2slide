import React, { useEffect, useState, useRef } from 'react';
import '../../style/nbview.css'
import '../../style/slideview.css'
import { slideReducerInitialState } from '../reducer/slidesReducer';
import { SlideAPIInfo, SlideSection } from "../types/slideTypes";
import { downloadFromAPI } from "../handler";
// import OptionsView from './optionsView';

import Slide from './slide';
import { getOutputAreaElements, StaticNotebookCell } from '../notebookUtils';
import NotebookVisView from './notebookVisView';
import HierarchyView from './hierarchyView';
import TitleSlide from './titleSlide';
import { Toast, ToastContainer } from 'react-bootstrap';
import QASlide from './QASlide';
// import { TransitionGroup } from 'react-transition-group' 

interface IProps {
    slides: SlideAPIInfo,
    cells: Array<StaticNotebookCell>,
    navNBCb: Function,
    getNBCell: Function,
    title: string,
    clipboard: string,
    bindCellIdx: number,
    log: Function
}

type ExportedSlide = {
    title: string;
    subtitles: Array<string>;
    img: Array<string>
    points: {
        [subtitle: string]: Array<string>
    };
    eg: boolean
    startSlide: boolean;
    endSlide: boolean;
}

type Action = {
    add: [string, string] | null,
    remove: [string, Array<string>] | null
}

function SlideViewer(props: IProps) {
    const [slideState, setSlideState] = useState(slideReducerInitialState)
    const [slideOrder, setSlideOrder] = useState([] as Array<{
        title: string;
        subtitles: Array<string>;
        startSlide: boolean;
        endSlide: boolean;
    }>)
    // const [slideIndexMap, setSlideIndexMap] = useState({} as {[tidx: string]: {[sidx: string]: number}})
    const [slideDeck, setSlideDeck] = useState([<></>])
    const [updateHierarchySignal, setUpdateHierarchySignal] = useState(0)
    const [currentTitle, setCurrentTitle] = useState("")
    const [currentSubTitle, setCurrentSubTitle] = useState("")
    const [currentSubtitles, setCurrentSubtitles] = useState([] as Array<string>)
    const [slideOverviewHide, setSlideOverviewHide] = useState(false)
    const hierarchyTitleRefs = useRef([])
    const [actionStore, setActionStore] = useState([] as Array<Action>)
    const [slideLoaded, setSlideLoaded] = useState(false)
    const [informMsg, setInformMsg] = useState(<></>)
    const [exportedSlides, setExportedSlides] = useState([] as Array<ExportedSlide>)
    const author = 'xx'
    const date = 'xx'

    // const pasteClipboard = () => {
    //     return props.clipboard
    // }

    useEffect(() => {
        if (props.bindCellIdx < 0) {
            return
        }
        if (currentTitle.length <= 0 || currentSubTitle.length <= 0) {
            setInformMsg(
                <Toast onClose={() => { setInformMsg(<></>) }} delay={3000}>
                    <Toast.Header>
                        <strong className="me-auto">NB2Slide</strong>
                    </Toast.Header>
                    <Toast.Body>You must select a silde first to bind code cells!</Toast.Body>
                </Toast>
            )
        }
        setInformMsg(
            <Toast onClose={() => { setInformMsg(<></>) }} delay={3000}>
                <Toast.Header>
                    <strong className="me-auto">NB2Slide</strong>
                </Toast.Header>
                <Toast.Body>Bind cde cell {props.bindCellIdx} with [{currentTitle}, {currentSubTitle}]</Toast.Body>
            </Toast>
        )
    }, [props.bindCellIdx])

    useEffect(() => {
        if (props.clipboard.length > 0) {
            setInformMsg(
                <Toast onClose={() => { setInformMsg(<></>) }} delay={3000}>
                    <Toast.Header>
                        <strong className="me-auto">NB2Slide</strong>
                    </Toast.Header>
                    <Toast.Body>Copy the output to the clipboard!</Toast.Body>
                </Toast>
            )
        }
    }, [props.clipboard])

    const removeSlide = (slideIdx: number) => {
        // store action for restore
        const action: Action = {
            add: null,
            remove: [slideOrder[slideIdx].title, slideOrder[slideIdx].subtitles]
        }
        setActionStore(actionStore => [...actionStore, action])
        console.log(actionStore)

        props.log({
            actionName: 'remove-slide',
            timestamp: new Date().toUTCString(),
            oldValue: slideOrder[slideIdx].title + ': ' + slideOrder[slideIdx].subtitles[0],
            newValue: ''
        })

        let order = [...slideOrder]
        order.splice(slideIdx, 1)
        setSlideOrder(order)
    }

    const addSlide = (slideIdx: number) => {
        // store action for restore
        const action: Action = {
            remove: null,
            add: ['title', 'subtitle']
        }
        setActionStore(actionStore => [...actionStore, action])

        let order = [...slideOrder]

        props.log({
            actionName: 'add-slide',
            timestamp: new Date().toUTCString(),
            oldValue: slideOrder[slideIdx].title + ': ' + slideOrder[slideIdx].subtitles[0],
            newValue: 'untitle' + order.length.toString()
        })

        order.splice(slideIdx, 0, {
            title: slideOrder[slideIdx].title,
            subtitles: ['untitle' + order.length.toString()],
            startSlide: false,
            endSlide: false
        })
        setSlideOrder(order)
    }

    const exportSlides = async () => {
        const data = JSON.stringify({
            'slides': exportedSlides,
            // "slides": {
            //     'titles': slideState.templateSectionTitles,
            //     'points': slideState.sectionPoints,
            // },
            'author': author,
            'date': date,
            'title': props.title
        })
        console.log(data)

        await downloadFromAPI<any>('export_slides', {
            body: data,
            method: "POST",
            headers: {
                "X-Download": "yes",
            }
        })
    }

    const getOutputImg = (imgs: number[]): string | null => {
        try {
            let cellOutput = null
            // currently consider only the first one
            for (let i = 0; i < imgs.length; i++) {
                const output = getOutputAreaElements(props.getNBCell(imgs[i]).node).output_arr[0].item(0)
                if (output !== null) {
                    const img = output.getElementsByTagName('img');
                    if (img)
                        if (img[0] !== undefined) {
                            cellOutput = img[0].currentSrc
                            break
                        }
                }
            }
            return cellOutput
        } catch (error) {
            return null
        }
    }

    useEffect(() => {
        setSlideOrder(props.slides.slidesOrder.slice())
        let state = slideReducerInitialState
        state.sectionTitles = []
        state.exampleSubsections = []
        if (!slideLoaded) {
            state.templateSectionTitles = props.slides.template
            setSlideLoaded(true)
        } else {
            state.templateSectionTitles = slideState.templateSectionTitles
        }
        state.templateSectionTitles.forEach((section: SlideSection) => {
            if (section.title in props.slides.slidesContent) {
                if (props.slides.slidesContent[section.title].egprompt)
                    state.exampleSubsections = state.exampleSubsections.concat(props.slides.slidesContent[section.title].egprompt)
                state.sectionSubtitles[section.title] = section.subtitles
                state.sectionTitles.push(section.title)
                state.sectionPoints[section.title] = props.slides.slidesContent[section.title].points
                state.sectionCodeCells[section.title] = props.slides.slidesContent[section.title].cells
                state.sectionImages[section.title] = props.slides.slidesContent[section.title].img
            }
        })

        setSlideState(state)
        setUpdateHierarchySignal(updateHierarchySignal + 1)
    }, [props.slides])

    useEffect(() => {
        let titleFirstSlide = true
        let latestTitle = ''
        let ex_slides = [] as Array<ExportedSlide>
        ex_slides = slideOrder.map((slide) => {
            return {
                title: slide.title,
                subtitles: slide.subtitles,
                img: [],
                points: {},
                startSlide: slide.startSlide,
                endSlide: slide.endSlide,
                eg: slideState.exampleSubsections.includes(slide.subtitles[0])
            }
        })

        setSlideDeck(slideOrder.map((slide, index) => {
            if (slide.startSlide) {
                return <TitleSlide
                    title={props.title}
                    select={currentTitle === 'slides-title'}
                    handleClick={() => {
                        if (currentTitle === 'slides-title')
                            return
                        setCurrentTitle('slides-title')
                    }}
                    exportSlides={exportSlides}
                    removeSlide={removeSlide}
                    addSlide={addSlide}
                    log={props.log}
                />
            }
            if (slide.endSlide) {
                return <QASlide
                    select={currentTitle === 'slides-title'}
                    handleClick={() => {
                        if (currentTitle === 'slides-title')
                            return
                        setCurrentTitle('slides-title')
                    }}
                    exportSlides={exportSlides}
                    removeSlide={removeSlide}
                    addSlide={addSlide}
                    log={props.log}
                />
            }
            if (slide.title !== latestTitle) {
                titleFirstSlide = true
                latestTitle = slide.title
            } else {
                titleFirstSlide = false
            }
            const title = slide.title;
            const subtitles = slide.subtitles;
            let imgSrc: string | null = null
            if (subtitles.length === 1) {
                const imgs = slideState.sectionImages[title][subtitles[0]]
                if (imgs) {
                    imgSrc = getOutputImg(imgs)
                    ex_slides[index].img.push(imgSrc)
                }
            }

            // for export
            subtitles.forEach(subtitle => {
                ex_slides[index].points[subtitle] = slideState.sectionPoints[title][subtitle]
            })
            return (
                <div key={slide.title + slide.subtitles[0]} id={titleFirstSlide ? 'section-' + title : ''}>

                    <Slide
                        exportSlideInfoPasteImg={(src: string) => {
                            ex_slides[index].img.push(src)
                        }}
                        pasteClipboard={props.clipboard}
                        index={index}
                        title={title}
                        getWhy={(subtitle: string) => {
                            return props.slides.sectionWhy[subtitle]
                        }}
                        getHow={(subtitle: string) => {
                            return props.slides.sectionHow[subtitle]
                        }}
                        subtitles={subtitles}
                        egpromptSecs={slideState.exampleSubsections}
                        points={slideState.sectionPoints[title]}
                        select={currentTitle === title && currentSubTitle === subtitles[0]}
                        cellOutput={(imgSrc as string | null)}
                        handleClick={() => {
                            if (currentTitle === title) {
                                if (subtitles.includes(currentSubTitle))
                                    return
                                setCurrentSubTitle(subtitles[0])
                                setCurrentSubtitles(subtitles)
                                return
                            }
                            setCurrentTitle(title)
                            setCurrentSubTitle(subtitles[0])
                            setCurrentSubtitles(subtitles)
                            hierarchyTitleRefs.current[slideState.sectionTitles.indexOf(title)].click();
                        }}
                        exportSlides={exportSlides}
                        removeSlide={removeSlide}
                        addSlide={addSlide}
                        modifySlide={modifySlide}
                        log={props.log}
                    />
                </div>
            )
        }))
        setExportedSlides(ex_slides)
    }, [slideOrder, slideState, currentTitle, currentSubTitle, props.clipboard])

    const modifySlide = (
        slideIdx: number,
        title: string,
        oldSubtitle: string,
        newContent: { [subtitle: string]: Array<string> }
    ) => {

        // update the slides order and state
        console.log('modify slides content')
        const order = [...slideOrder]
        let state = { ...slideState }
        const slideStructure = order[slideIdx]
        let index = slideStructure.subtitles.findIndex((c) => c === oldSubtitle)
        if (index >= 0) {
            slideStructure.subtitles.splice(index, 1)
        } else {
            index = 0
        }
        const keylength = Object.keys(newContent).length
        if (keylength !== 0) {
            Object.keys(newContent).forEach((subtitle, i) => {
                slideStructure.subtitles.splice(index + i, 0, subtitle)
                state.sectionPoints[title][subtitle] = newContent[subtitle]
            })
        }

        if (state.exampleSubsections.includes(oldSubtitle)) {
            let i = state.exampleSubsections.findIndex((c) => c === oldSubtitle)
            state.exampleSubsections.splice(i, 1)
        }

        setSlideOrder(order)
        setSlideState(state)
    }

    return (
        <>
            <div id='main-body'>
                {/* <OptionsView></OptionsView> */}
                <div id='main-panel'>
                    <div
                        id='explore-view'
                        style={{
                            width: slideOverviewHide ? '20%' : '40%'
                        }}
                    >
                        <div
                            id='vis-panel'
                            style={{
                                width: slideOverviewHide ? '90%' : '30%'
                            }}
                        >
                            <NotebookVisView
                                cells={props.cells}
                                navNBCb={props.navNBCb}
                                getNBCell={props.getNBCell}
                                slidesMapToCells={slideState.sectionCodeCells}
                                selectedTitle={currentTitle}
                                selectedSubTitle={currentSubtitles}
                                log={props.log}
                            />
                        </div>
                        <div
                            id={'hierarchy-panel'}
                            style={{
                                width: slideOverviewHide ? '10%' : '70%',
                                display: 'flex',
                                flexDirection: 'row'
                            }}
                        >
                            <HierarchyView
                                slideState={slideState}
                                updateHierarchySignal={updateHierarchySignal}
                                setHierarchyRef={(el: any, idx: number) => (hierarchyTitleRefs.current[idx] = el)}
                                slideOverviewHide={slideOverviewHide}
                                setSlideOverviewHide={setSlideOverviewHide}
                                log={props.log}
                            ></HierarchyView>
                        </div>
                    </div>
                    <div
                        id={"slideview"}
                        style={{
                            width: slideOverviewHide ? '80%' : '60%'
                        }}
                    >
                        <div id={"slide-deck"}>
                            {slideDeck}
                        </div>
                    </div>
                    <div style={{ position: 'absolute', left: '1rem', bottom: '1rem' }}>
                        <ToastContainer>
                            {informMsg}
                        </ToastContainer>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SlideViewer;