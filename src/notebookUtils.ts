import { Cell } from '@jupyterlab/cells';

export type StaticNotebookCell = {
    index: number,
    outputElements: Object,
    source: string,
    cell_type: string
}

export const bundleStaticNotebookCells = (cellWidgets: {[idx: number]: Cell}): Array<StaticNotebookCell> => {
    return Object.entries(cellWidgets).map(([i, widget]) => {
        return {
            index: parseInt(i),
            outputElements: getOutputAreaElements(widget.node),
            source: widget.model.value.text,
            cell_type: widget.model.type,
        }
    })
}

export function computeCurCellsIdx (cells: Array<Cell>) {
    let index : {[idx: number]: Cell} = {}
    cells.forEach((cell, idx) => {
        index[idx] = cell
    })
    return index
}

// ref: https://github.com/tho121/toon_note 
export function getOutputAreaElements(node: HTMLElement) {

    var arr = [node.getElementsByClassName('jp-Cell-inputWrapper')];
    var output_arr = [node.getElementsByClassName('jp-Cell-outputWrapper')];
    // var frame = output_arr[0].item(0).getElementsByClassName('jp-OutputArea-child').item(0) as HTMLElement;
    var codecell = arr[0].item(0);

    return { arr: arr, output_arr: output_arr, codecell: codecell };
};