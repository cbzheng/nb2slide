import {SlideAPIInfo, SlideReducerAction, SlideReducerState} from "../types/slideTypes";

export const slideReducerInitialState: SlideReducerState = {
    templateSectionTitles: [
        "Introduction",
        "EDA",
        "Feature Engineering",
        "Model Details",
        "Model Performance"
    ],
    sectionTitles: [],
    sectionPoints: {},
    sectionCodeCells: {},
}

function slideReducer(state: SlideReducerState, action: SlideReducerAction): SlideReducerState {
    switch (action.type) {
        case "updateSlides":
            updateSlides(state, action.payload)
             return state
    }
}

function updateSlides(state: SlideReducerState, payload: SlideAPIInfo) {
    state.sectionTitles = []
    state.templateSectionTitles.forEach((title: string) => {
        if (title in payload) {
            state.sectionTitles.push(title)
            const points = payload[title].points
            const cells = payload[title].cells
            // @ts-ignore
            state.sectionPoints[title] = points
            // @ts-ignore
            state.sectionCodeCells[title] = cells
        }
    })
}

export default slideReducer;