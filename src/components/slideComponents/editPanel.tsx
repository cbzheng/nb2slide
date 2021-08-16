import {
    faPlusSquare,
    faMinusSquare,
    faFileExport,
    faQuestionCircle,
    faClipboard
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import '../../../style/slideview.css'
// import ExportPopover from './exportPopover';
import { CopyBlock, atomOneLight } from 'react-code-blocks'


interface IProps {
    exportSlides: Function,
    addSlide: Function,
    removeSlide: Function,
    title: string,
    subtitles: Array<string>,
    paste: Function,
    getWhy: Function,
    getHow: Function
}

function EditPanel(props: IProps) {

    const popoverExport = <Popover id="popover-export">
        <Popover.Header as="h3">Export Slides</Popover.Header>
        <Popover.Body style={{ display: 'flex', flexDirection: 'column' }}>
            <Button variant="outline-primary" style={{ marginBottom: '0.5rem' }}>
                Export Single Slide
            </Button>
            <Button variant="outline-primary" onClick={() => { props.exportSlides() }}>
                Export All Slides
            </Button>
        </Popover.Body>
    </Popover>

    const constructHelp = () => {
        if (!props.subtitles) {
            return <Popover.Header as="h4">Help</Popover.Header>
        }
        return props.subtitles.map(subtitle => {
            const why = props.getWhy(subtitle)
            const how = props.getHow(subtitle)
            let whyDiv = <></>;
            let howDiv = <></>;
            console.log('get')

            if (why && why !== undefined) {
                whyDiv = <div>
                    <b>WHY: </b> {why}
                </div>
            }

            if (how && how !== undefined) {
                howDiv = <div>
                    <b>HOW: </b> {how.text}
                    {how.code.length > 0 ?
                        <CopyBlock
                            text={how.code}
                            language={'python'}
                            wrapLines
                            theme={	atomOneLight}
                        /> :
                        null
                    }
                </div>
            }
            return (
                <>
                    <Popover.Header as="h4">Help: {subtitle}</Popover.Header>
                    <Popover.Body style={{ display: 'flex', flexDirection: 'column' }}>
                        {whyDiv}
                        {howDiv}
                    </Popover.Body>
                </>
            )
        })
    }

    const popoverHelp = <Popover id="popover-export">
        {constructHelp()}
    </Popover>

    return (
        <div className={'edit-icon-list'} onClick={(e) => { e.stopPropagation() }}>
            <div id='edit-panel'>
                <div>
                    <OverlayTrigger
                        trigger='click'
                        key='export'
                        placement='left'
                        overlay={popoverHelp}
                    >
                        <Button variant="link" style={{ padding: '0' }}>
                            <FontAwesomeIcon
                                className={"edit-icon icon-help"}
                                icon={faQuestionCircle}
                            />
                        </Button>
                    </OverlayTrigger>
                </div>
                <div>
                    <Button variant="link" style={{ padding: '0' }}>
                        <FontAwesomeIcon
                            className={"edit-icon icon-add"}
                            icon={faClipboard}
                            onClick={() => { props.paste() }}
                        />
                    </Button>
                </div>
                <div>
                    <Button variant="link" style={{ padding: '0' }}>
                        <FontAwesomeIcon
                            className={"edit-icon icon-add"}
                            icon={faPlusSquare}
                            onClick={() => props.addSlide()}
                        />
                    </Button>
                </div>
                <div>
                    <Button variant="link" style={{ padding: '0' }}>
                        <FontAwesomeIcon
                            className={"edit-icon icon-minus"}
                            icon={faMinusSquare}
                            onClick={() => props.removeSlide()}
                        />
                    </Button>
                </div>
                <div>
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
                            />
                        </Button>
                    </OverlayTrigger>
                </div>
            </div>
        </div>

    )
}

export default EditPanel;