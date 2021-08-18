import React, { useRef, useState } from 'react';
import { Overlay, Tooltip } from 'react-bootstrap';
import '../../../style/slideview.css'
// import { CopyBlock } from "react-code-blocks";

interface IProps {
    src: string,
    layout: string
}

function SlideImage(props: IProps) {
    const [show, setShow] = useState(false);
    const target = useRef(null);

    return (
        <>
            <img
                src={
                    props.src
                }
                className='nb-cell-rect'
                style={{
                    width: props.layout == 'row' ? '50%' : '70%',
                    marginTop: '3px',
                    marginBottom: '3px'
                }}
                onClick={() => {
                    console.log('click')
                    setShow(!show)
                }}
            ></img>
            <Overlay target={target.current} show={show} placement="right">
                {(props) => (
                    <Tooltip id="overlay-example" {...props}>
                        Remove
                    </Tooltip>
                )}
            </Overlay>
        </>
    )
}

export default SlideImage;