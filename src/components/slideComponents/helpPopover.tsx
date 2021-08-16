import React from 'react';
import { Popover } from 'react-bootstrap';
import '../../../style/slideview.css'
// import { CopyBlock } from "react-code-blocks";

interface IProps {
    exportSlides: Function
    subtitles: Array<string>,
    getWhy: Function,
    getHow: Function
}

function HelpPopover(props: IProps) {

    return (
        <Popover id="popover-export">
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
    )
}

export default HelpPopover;