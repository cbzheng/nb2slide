import React from 'react';
import { Button, Popover } from 'react-bootstrap';
import '../../../style/slideview.css'

interface IProps {
    exportSlides: Function
}

function ExportPopover(props: IProps) {

    return (
        <Popover id="popover-export">
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
    )
}

export default ExportPopover;