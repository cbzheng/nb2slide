import { ReactWidget } from "@jupyterlab/apputils";
import React from "react";
import SlideViewer from "./components/slideView"
import { APISlideInfo } from "./mockdata"
import "../style/slidewidget.css"
import { StaticNotebookCell } from "./notebookUtils";

export class SlideViewWidget extends ReactWidget {
    constructor() {
        super();
    }

    async updateNotebookInfo(cells: Array<StaticNotebookCell>) {
        // await uploadNotebook(cells)
    }

    render(): JSX.Element {
        return (
            <div id={'slide-deck-widget'}>
                {/* test: update render */}
                {/* <h1>{(new Date()).getSeconds()}</h1> */}
                <SlideViewer slides={APISlideInfo} />
            </div>
        )
    }
}