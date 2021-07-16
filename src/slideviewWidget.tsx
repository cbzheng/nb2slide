import { ReactWidget } from "@jupyterlab/apputils";
import React from "react";
import SlideViewer from "./components/slideView"
import { APISlideInfo } from "./mockdata"
import "../style/slidewidget.css"
import { StaticNotebookCell } from "./notebookUtils";
import { requestAPI } from "./handler";

export class SlideViewWidget extends ReactWidget {
    constructor() {
        super();
    }

    async updateNotebookInfo(cells: Array<StaticNotebookCell>) {
        // await uploadNotebook(cells)
        console.log("upload the notebook")
        const data  =JSON.stringify({"notebook": cells})
        requestAPI<any>('get_slides', {
            body: data,
            method: "POST"
          })
            .then(data => {
              console.log(data);
            })
            .catch(reason => {
              console.error(
                `The nb2slide server extension appears to be missing.\n${reason}`
              );
            });
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