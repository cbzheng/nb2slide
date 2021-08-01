export type SlideCellRelation = { cell_idx: number, dist: number }

export type SlideAPIInfo = {
    [title: string]: {
        points: { [subtitle: string]: Array<string> },
        cells: { [subtitle: string]: Array<Array<SlideCellRelation>> },
    }
}

export type SlideSection = {
    title: string,
    subtitles: Array<string>
}

export type SlideReducerState = {
    templateSectionTitles: Array<SlideSection>
    sectionTitles: Array<string>,
    sectionSubtitles: {
        [title: string]: Array<string>
    }
    sectionPoints: { [title: string]: { [subtitle: string]: Array<string> } },
    sectionCodeCells: { [title: string]: { [subtitle: string]: Array<Array<SlideCellRelation>> } },
}

export type SlideReducerAction =
    | { type: "updateSlides", payload: SlideAPIInfo }