import React, { useEffect, useState, useRef } from 'react';
import '../../style/nbview.css'
import '../../style/slideview.css'
import { slideReducerInitialState } from '../reducer/slidesReducer';
import { SlideAPIInfo, SlideSection } from "../types/slideTypes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlusSquare, faMinusSquare, faFileExport } from '@fortawesome/free-solid-svg-icons'
// import OptionsView from './optionsView';

import Slide from './slide';
import { getOutputAreaElements, StaticNotebookCell } from '../notebookUtils';
import NotebookVisView from './notebookVisView';
import HierarchyView from './hierarchyView';

interface IProps {
    slides: SlideAPIInfo,
    cells: Array<StaticNotebookCell>,
    navNBCb: Function,
    getNBCell: Function
}

function SlideViewer(props: IProps) {
    const [slideState, setSlideState] = useState(slideReducerInitialState)
    const [slideDeck, setSlideDeck] = useState(<></>)
    const [updateHierarchySignal, setUpdateHierarchySignal] = useState(0)
    const [currentTitle, setCurrentTitle] = useState("")
    const [currentSubTitle, setCurrentSubTitle] = useState("")
    const [slideOverviewHide, setSlideOverviewHide] = useState(true)
    const hierarchyTitleRefs = useRef([])

    useEffect(() => {
        // slideInfoDispatch({ type: "updateSlides", payload: props.slides })
        let state = slideReducerInitialState
        state.sectionTitles = []
        state.templateSectionTitles = props.slides.template
        state.templateSectionTitles.forEach((section: SlideSection) => {
            if (section.title in props.slides.slides) {
                state.sectionSubtitles[section.title] = section.subtitles
                state.sectionTitles.push(section.title)
                state.sectionPoints[section.title] = props.slides.slides[section.title].points
                state.sectionCodeCells[section.title] = props.slides.slides[section.title].cells
                state.sectionImages[section.title] = props.slides.slides[section.title].img
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
                    console.log('images on this slide', title, ':', imgs);

                    // currently consider only the first one
                    for (let i = 0; i < imgs.length; i++){
                        cellOutput = getOutputAreaElements(props.getNBCell(imgs[i]).node).output_arr[0].item(0)
                        if (cellOutput !== null) {
                            cellOutput = cellOutput.getElementsByTagName('img');
                            if (cellOutput && cellOutput[0] !== undefined) 
                            {
                                cellOutput = cellOutput[0].currentSrc
                            }
                        }
                    }
                }
                return (
                    <div id={idx === 0 ? 'section-' + title : ''}>
                        <Slide
                            title={title}
                            subtitle={subtitle}
                            points={slideState.sectionPoints[title][subtitle]}
                            select={currentTitle === title && currentSubTitle === subtitle}
                            cellOutput={(cellOutput as string|null)}
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

                        />
                    </div>
                )
            })
        })
        )
    }, [props.slides, currentTitle, currentSubTitle])

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
                                width: slideOverviewHide? '10%': '70%',
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
                        {slideDeck}
                        <div className={'edit-icon-list'}>
                            <div id='edit-panel'>
                                <FontAwesomeIcon className={"edit-icon icon-edit"} icon={faEdit} size="2x" />
                                <FontAwesomeIcon className={"edit-icon icon-add"} icon={faPlusSquare} size="2x" />
                                <FontAwesomeIcon className={"edit-icon icon-minus"} icon={faMinusSquare} size="2x" />
                                <FontAwesomeIcon className={"edit-icon icon-edit"} icon={faFileExport} size="2x" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default SlideViewer;