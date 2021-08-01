import React, { useEffect, useState, useRef } from 'react';
import '../../style/nbview.css'
import '../../style/slideview.css'
import { slideReducerInitialState } from '../reducer/slidesReducer';
import { SlideAPIInfo, SlideSection } from "../types/slideTypes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlusSquare, faMinusSquare, faFileExport } from '@fortawesome/free-solid-svg-icons'
// import OptionsView from './optionsView';
import ListGroup from 'react-bootstrap/ListGroup'
import Accordion from 'react-bootstrap/Accordion'
import Slide from './slide';
import { StaticNotebookCell } from '../notebookUtils';
import NotebookVisView from './notebookVisView';
import ExampleView from './exampleView';

interface IProps {
    slides: SlideAPIInfo,
    cells: Array<StaticNotebookCell>,
    navNBCb: Function
}

function SlideViewer(props: IProps) {
    const [slideState, setSlideState] = useState(slideReducerInitialState)
    const [slideHierarchy, setSlideHierarchy] = useState(<></>)
    const [slideDeck, setSlideDeck] = useState(<></>)
    const [currentTitle, setCurrentTitle] = useState("")
    const [currentSubTitle, setCurrentSubTitle] = useState("")
    const hierarchyTitleRefs = useRef([])

    useEffect(() => {
        // slideInfoDispatch({ type: "updateSlides", payload: props.slides })
        let state = slideReducerInitialState
        state.sectionTitles = []
        state.templateSectionTitles.forEach((section: SlideSection) => {
            if (section.title in props.slides) {
                state.sectionSubtitles[section.title] = section.subtitles
                state.sectionTitles.push(section.title)
                state.sectionPoints[section.title] = props.slides[section.title].points
                state.sectionCodeCells[section.title] = props.slides[section.title].cells
            }
        })

        setSlideState(state)
        // slide structure
        const strucutreItems = slideState.sectionTitles.map((title, idx) => {
            const subtitles = slideState.sectionSubtitles[title]
            const subtitleList = subtitles.map(subtitle => {
                return (
                    <ListGroup.Item>
                        <a className='slide-link' href={'#section-' + title + '-sub-' + subtitle}> {subtitle}</a>
                    </ListGroup.Item>
                )
            })
            return (
                <Accordion.Item
                    eventKey={idx.toString()}
                >
                    <Accordion.Button ref={(el: any) => (hierarchyTitleRefs.current[idx] = el)}>
                        <a className='slide-link' href={'#section-' + title}>
                            {title}
                        </a>
                    </Accordion.Button>
                    <Accordion.Body>
                        <ListGroup variant='flush'>
                            {subtitleList}
                        </ListGroup>
                    </Accordion.Body>
                </Accordion.Item>
            )
        })
        setSlideHierarchy(
            <Accordion>
                {strucutreItems}
            </Accordion>
        )

        // slides
        //@ts-ignore
        setSlideDeck(slideState.sectionTitles.map((title, tIdx) => {
            return slideState.sectionSubtitles[title].map((subtitle, idx) => {
                return (
                    <div id={idx === 0 ? 'section-' + title : ''}>
                        <Slide
                            title={title}
                            subtitle={subtitle}
                            points={slideState.sectionPoints[title][subtitle]}
                            select={currentTitle === title && currentSubTitle === subtitle}
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
                    <div id='explore-view'>
                        <div id='vis-panel'>
                            <NotebookVisView
                                cells={props.cells}
                                navNBCb={props.navNBCb}
                                slidesMapToCells={slideState.sectionCodeCells}
                                selectedTitle={currentTitle}
                                selectedSubTitle={currentSubTitle}
                            />
                        </div>
                        <div id='ref-panel'>
                            <div id='hierarchy-panel'>
                                {slideHierarchy}
                            </div>
                            <div id='prompt-panel'>
                                <ExampleView currentSubTitle={currentSubTitle} currentTitle={currentTitle} />
                            </div>
                        </div>
                    </div>
                    <div id={"slideview"}>
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