export type SlideCellRelation = { cell_idx: number, dist: number }

export type SlideAPIInfo = {
    template: Array<SlideSection>,
    slidesContent: {[title: string]: {
        points: { [subtitle: string]: Array<string> },
        cells: { [subtitle: string]: Array<Array<SlideCellRelation>> },
        // images, from which cell output
        img: { [subtitle: string]: Array<number> },
        egprompt: Array<string>
    }}
    slidesOrder: Array<{
        title: string;
        subtitles: Array<string>;
        startSlide: boolean;
        endSlide: boolean;
    }>
    sectionWhy: {[subsection: string]: string}
    sectionHow: { [subsection: string]: {
        text: string,
        code: string
    } }
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
    sectionImages: { [title: string]: { [subtitle: string]: Array<number> } },
    exampleSubsections: Array<string>,
}

export type SlideReducerAction =
    | { type: "updateSlides", payload: SlideAPIInfo }

export type BindCodeCells = { [title: string]: { [subtitle: string]: Array<number> } }