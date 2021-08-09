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
// import { TransitionGroup } from 'react-transition-group' 

interface IProps {
    slides: SlideAPIInfo,
    cells: Array<StaticNotebookCell>,
    navNBCb: Function,
    getNBCell: Function
}

type Action = {
    add: [string, string] | null,
    remove: [string, string] | null
}

function SlideViewer(props: IProps) {
    const [slideState, setSlideState] = useState(slideReducerInitialState)
    // const [slideIndexMap, setSlideIndexMap] = useState({} as {[tidx: string]: {[sidx: string]: number}})
    const [slideDeck, setSlideDeck] = useState(<></>)
    const [updateHierarchySignal, setUpdateHierarchySignal] = useState(0)
    const [currentTitle, setCurrentTitle] = useState("")
    const [currentSubTitle, setCurrentSubTitle] = useState("")
    const [slideOverviewHide, setSlideOverviewHide] = useState(false)
    const hierarchyTitleRefs = useRef([])
    const [actionStore, setActionStore] = useState([] as Array<Action>)
    const [slideLoaded, setSlideLoaded] = useState(false)

    const removeSlide = (title: string, subtitle: string) => {
        // store action for restore
        const action: Action = {
            add: null,
            remove: [title, subtitle]
        }
        setActionStore(actionStore => [...actionStore, action])
        console.log(actionStore)

        let state = { ...slideState }
        state.templateSectionTitles.forEach((section: SlideSection) => {
            if (section.title === title) {
                const index = section.subtitles.indexOf(subtitle)
                section.subtitles.splice(index, 1)
            }
        })
        setSlideState(state)
    }

    const addSlide = (title: string, subtitle: string) => {
        // store action for restore
        const action: Action = {
            remove: null,
            add: [title, subtitle]
        }
        setActionStore(actionStore => [...actionStore, action])
        console.log(actionStore)

        let state = { ...slideState }
        state.templateSectionTitles.forEach((section: SlideSection) => {
            if (section.title === title) {
                const index = section.subtitles.indexOf(subtitle)
                section.subtitles.splice(index + 1, 0, "subtitle")
            }
        })
        setSlideState(state)
    }

    const exportSlides = async () => {
        const data = JSON.stringify({
            "slides": {
                'titles': slideState.templateSectionTitles,
                'points': slideState.sectionPoints,
            }
        })

        await downloadFromAPI<any>('export_slides', {
            body: data,
            method: "POST",
            headers: {
                "X-Download": "yes",
            }
        })
    }

    useEffect(() => {
        console.log(slideState.templateSectionTitles)
        // slideInfoDispatch({ type: "updateSlides", payload: props.slides })
        let state = slideReducerInitialState
        let idxMap = {} as { [tidx: string]: { [sidx: string]: number } }
        state.sectionTitles = []
        state.exampleSubsections = []
        if (!slideLoaded) {
            state.templateSectionTitles = props.slides.template
            setSlideLoaded(true)
        } else {
            state.templateSectionTitles = slideState.templateSectionTitles
        }
        let slideIdx = 0;
        state.templateSectionTitles.forEach((section: SlideSection) => {
            if (section.title in props.slides.slides) {
                idxMap[section.title] = {}
                if (props.slides.slides[section.title].egprompt)
                    state.exampleSubsections = state.exampleSubsections.concat(props.slides.slides[section.title].egprompt)
                state.sectionSubtitles[section.title] = section.subtitles
                state.sectionTitles.push(section.title)
                state.sectionPoints[section.title] = props.slides.slides[section.title].points
                state.sectionCodeCells[section.title] = props.slides.slides[section.title].cells
                state.sectionImages[section.title] = props.slides.slides[section.title].img
                section.subtitles.forEach(st => {
                    idxMap[section.title][st] = slideIdx
                    slideIdx++
                })
            }
        })

        setSlideState(state)
        setUpdateHierarchySignal(updateHierarchySignal + 1)

        // slides
        //@ts-ignore
        setSlideDeck(slideState.sectionTitles.map((title, tIdx) => {
            return slideState.sectionSubtitles[title].map((subtitle, idx) => {
                const imgs = slideState.sectionImages[title][subtitle]
                let cellOutput = null
                if (imgs) {

                    // currently consider only the first one
                    for (let i = 0; i < imgs.length; i++) {
                        cellOutput = getOutputAreaElements(props.getNBCell(imgs[i]).node).output_arr[0].item(0)
                        if (cellOutput !== null) {
                            cellOutput = cellOutput.getElementsByTagName('img');
                            if (cellOutput) {
                                if (cellOutput[0] !== undefined) {
                                    cellOutput = cellOutput[0].currentSrc
                                    break
                                }
                            }
                        }
                    }
                }
                return (
                    <div key={idxMap[title][subtitle]} id={idx === 0 ? 'section-' + title : ''}>

                        <Slide
                            index={idxMap[title][subtitle]}
                            title={title}
                            subtitle={subtitle}
                            egprompt={slideState.exampleSubsections.includes(subtitle)}
                            points={slideState.sectionPoints[title][subtitle]}
                            select={currentTitle === title && currentSubTitle === subtitle}
                            cellOutput={(cellOutput as string | null)}
                            handleClick={() => {
                                if (currentTitle === title) {
                                    if (currentSubTitle === subtitle)
                                        return
                                    setCurrentSubTitle(subtitle)
                                    return
                                }
                                setCurrentTitle(title)
                                setCurrentSubTitle(subtitle)
                                hierarchyTitleRefs.current[tIdx].click();
                                console.log(hierarchyTitleRefs)
                            }}
                            exportSlides={exportSlides}
                            removeSlide={removeSlide}
                            addSlide={addSlide}
                        />
                    </div>
                )
            })
        })
        )
        console.log(slideDeck)
    }, [props.slides, slideState, currentTitle, currentSubTitle])

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
                                selectedSubTitle={currentSubTitle}
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
                            {/* <TransitionGroup
                                transitionName="example"
                                transitionEnterTimeout={500}
                                transitionLeaveTimeout={300}> */}
                                {slideDeck}
                            {/* </TransitionGroup> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SlideViewer;