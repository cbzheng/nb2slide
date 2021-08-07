import {SlideAPIInfo, SlideReducerAction, SlideReducerState, SlideSection} from "../types/slideTypes";

export const slideReducerInitialState: SlideReducerState = {
    templateSectionTitles: [
        { title: "Introduction", subtitles: ["Background", "Problem", "Workflow"]},
        { title: "EDA", subtitles: ["Data Source", "Preview the raw data values", "Data cleaning", "Exploratory data analysis", "Exploratory data analysis: Example"]},
        { title: "Feature Engineering", subtitles: ["Feature Engineering Summarization", "Feature Engineering Example"]},
        { title: "Model Details", subtitles: ['Model Input', 'Model Output', 'Optimization', 'Model Alternatives', "Model Details"]},
        { title: "Model Performance", subtitles: ['Metrics', 'Performance']},
        { title: "Conclusion", subtitles: ['Suggestions', 'Ethical & Legal consideration', "Limitation & Risks"]}
    ],
    sectionSubtitles: {},
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
    console.log("Update slides")
    state.sectionTitles = []
    state.templateSectionTitles = payload.template
    state.templateSectionTitles.forEach((section: SlideSection) => {
        if (section.title in payload) {
            state.sectionTitles.push(section.title)
            const points = payload.slides[section.title].points
            const cells = payload.slides[section.title].cells
            // @ts-ignore
            state.sectionPoints[title] = points
            // @ts-ignore
            state.sectionCodeCells[title] = cells
        }
    })

    console.log("state", state)
}

export default slideReducer;