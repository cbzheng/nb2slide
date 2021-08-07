import React, { useState, useEffect } from 'react';
import '../../style/slideview.css'
import '../../style/nbview.css'
import Accordion from 'react-bootstrap/Accordion'
import { SlideReducerState } from '../types/slideTypes';
import ListGroup from 'react-bootstrap/ListGroup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'



interface IProps {
    updateHierarchySignal: number,
    slideState: SlideReducerState,
    setHierarchyRef: Function,
    slideOverviewHide: boolean,
    setSlideOverviewHide: Function
}

function HierarchyView(props: IProps) {
    const [structureItems, setStructureItems] = useState([<></>])
    const [isCollapose, setIsCollapose] = useState(true)

    useEffect(() => {
        if (props.slideState === undefined || props.slideState === null) {
            return
        }
        setStructureItems(props.slideState.sectionTitles.map((title, idx) => {
            const subtitles = props.slideState.sectionSubtitles[title]
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
                    <Accordion.Button ref={(el: any) => { props.setHierarchyRef(el, idx) }}>
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
        }))
    }, [props.slideState, props.updateHierarchySignal])

    return (
        <>

            <div
                id='collapose-bar'
                onClick={() => {
                    props.setSlideOverviewHide(!props.slideOverviewHide)
                    setIsCollapose(!isCollapose)
                }}
            >
                <FontAwesomeIcon 
                    icon={faAngleRight} 
                    size="1x"
                    style={{
                        color: '#999',
                        margin: '3px'
                    }}
                />
            </div>
            {
                !isCollapose &&
                <div
                    style={{
                        transition: '0.3s',
                        width: '90%'
                        // visibility: props.slideOverviewHide ? "hidden" : 'visible'
                    }}
                >
                    <Accordion>
                        {structureItems}
                    </Accordion>
                </div>
            }
        </>
    )
}

export default HierarchyView;