export type SlideCellRelation = { cell_idx: number, sim_ratio: number }

export type SlideAPIInfo = {
    [title: string]: {
        points: { [title: string]: Array<string> },
        cells: { [title: string]: Array<SlideCellRelation> },
    }
}

export type SlideReducerState = {
    templateSectionTitles: Array<string>
    sectionTitles: Array<string>,
    sectionPoints: { [title: string]: Array<string> },
    sectionCodeCells: { [title: string]: Array<SlideCellRelation> },
}

export type SlideReducerAction =
    | {type: "updateSlides", payload: SlideAPIInfo}