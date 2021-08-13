import { ReactWidget } from "@jupyterlab/apputils";
import React from "react";
import { APISlideInfo } from "./mockdata"
import "../style/slidewidget.css"
import { StaticNotebookCell } from "./notebookUtils";
import { SlideAPIInfo } from "./types/slideTypes";
import NB2Slide from "./components/nb2slide";

export class SlideViewWidget extends ReactWidget {
  slides: SlideAPIInfo
  notebookCells: Array<StaticNotebookCell>
  navNBCb: Function
  getNBCell: Function
  clipboard: string

  constructor() {
    super();
    this.slides = APISlideInfo
    this.notebookCells = []
    this.clipboard = ''
  }

  setNavNBCb(cb: Function) {
    this.navNBCb = cb;
  }

  setGetNBCell(cb: Function) {
    this.getNBCell = cb;
  }

  setNotebookCells(cells: Array<StaticNotebookCell>) {
    this.notebookCells = cells;
  }

  setClipboard(imgSrc: string) {
    this.clipboard = imgSrc
    console.log(this.clipboard)
  }

  render(): JSX.Element {
    return (
      <NB2Slide
        navNBCb={this.navNBCb}
        getNBCell={this.getNBCell}
        notebookCells={this.notebookCells}
        clipboard={this.clipboard}
      ></NB2Slide>
    )
  }
}