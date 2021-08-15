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

interface IProps {
    exportSlides: Function,
    addSlide: Function,
    removeSlide: Function,
    title: string,
    subtitle: string,
    paste: Function
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

    const popoverHelp = <Popover id="popover-export">
        <Popover.Header as="h4">Help</Popover.Header>
        <Popover.Body style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
                <b>Why:</b>
            </div>
            <div>
                <b>How:</b>
            </div>
        </Popover.Body>
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