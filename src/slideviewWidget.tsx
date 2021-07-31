import { ReactWidget } from "@jupyterlab/apputils";
import React from "react";
import SlideViewer from "./components/slideView"
import { APISlideInfo } from "./mockdata"
import "../style/slidewidget.css"
import { StaticNotebookCell } from "./notebookUtils";
import { requestAPI } from "./handler";
import { SlideAPIInfo } from "./types/slideTypes";

export class SlideViewWidget extends ReactWidget {
    slides: SlideAPIInfo
    notebookCells: Array<StaticNotebookCell>

    constructor() {
        super();
        this.slides = APISlideInfo 
        this.notebookCells = [] 
    }

    async updateNotebookInfo(cells: Array<StaticNotebookCell>) {
      this.notebookCells = cells
        const data  =JSON.stringify({"notebook": cells})
        await requestAPI<any>('get_slides', {
            body: data,
            method: "POST"
          })
            .then(data => {
              this.slides = JSON.parse(data)
            })
            .catch(reason => {
              console.error(
                `The nb2slide server extension appears to be missing.\n${reason}`
              );
            });
    }

    render(): JSX.Element {
        return (
            <div id={'slides-deck-widget'}>
                <SlideViewer slides={this.slides} cells={this.notebookCells} />
            </div>
        )
    }
}