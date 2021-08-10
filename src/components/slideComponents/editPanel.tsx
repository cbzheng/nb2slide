import { faPlusSquare, faMinusSquare, faFileExport } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react';
import { Button, OverlayTrigger } from 'react-bootstrap';
import '../../../style/slideview.css'
import ExportPopover from './exportPopover';

interface IProps {
    exportSlides: Function,
    addSlide: Function,
    removeSlide: Function,
    title: string,
    subtitle: string
}

function EditPanel(props: IProps) {

    const popoverExport = <ExportPopover exportSlides={props.exportSlides}></ExportPopover>

    return (
        <div className={'edit-icon-list'} onClick={(e) => { e.stopPropagation() }}>
            <div id='edit-panel'>
                <FontAwesomeIcon
                    className={"edit-icon icon-add"}
                    icon={faPlusSquare}
                    size="2x"
                    onClick={() => props.addSlide(props.title, props.subtitle)}
                />
                <FontAwesomeIcon
                    className={"edit-icon icon-minus"}
                    icon={faMinusSquare}
                    size="2x"
                    onClick={() => props.removeSlide(props.title, props.subtitle)}
                />
                <div
                >
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
                                size="2x"
                            />
                        </Button>
                    </OverlayTrigger>
                </div>
            </div>
        </div>

    )
}

export default EditPanel;