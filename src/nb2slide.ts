import { JupyterFrontEnd } from "@jupyterlab/application";
import {
    INotebookTools,
    INotebookTracker,
    NotebookPanel
    // NotebookActions, Notebook, NotebookPanel, INotebookModel
} from '@jupyterlab/notebook';
import { SlideViewWidget } from './slideviewWidget';
// import { requestAPI } from './handler';
import { MainAreaWidget } from '@jupyterlab/apputils';
import { IMainMenu } from '@jupyterlab/mainmenu';
import { Menu } from '@lumino/widgets';
import { bundleStaticNotebookCells, computeCurCellsIdx } from "./notebookUtils";
import { Cell } from '@jupyterlab/cells';

export class NB2Slide {
    app: JupyterFrontEnd;
    tracker: INotebookTracker;
    menu: IMainMenu;
    notebookTools: INotebookTools;
    widgetContent: SlideViewWidget;
    widget: MainAreaWidget;
    command: string;
    notebookPanel: NotebookPanel;
    cellsIndex: {[idx: number]: Cell}

    constructor(
        app: JupyterFrontEnd,
        mainmenu: IMainMenu,
        notebook: INotebookTools | null,
        notebook_tracker: INotebookTracker
    ) {
        this.app = app;
        this.tracker = notebook_tracker;
        this.menu = mainmenu;
        this.notebookTools = notebook
        this.command = ""

        // set up widget
        this.widgetContent = new SlideViewWidget();
        this.widgetContent.addClass('nb2slide-Widget');
        this.widget = new MainAreaWidget<SlideViewWidget>({
            content: this.widgetContent
        });
        this.widget.id = 'nb2slide-jupyterlab';
        this.widget.title.label = 'Slide Decks';
        this.widget.title.closable = true;

        // activate
        this.addTrigger()
        this.addToMenu()
        // this.tracker.activeCellChanged.connect(this.onActiveCellChanged, this);
    }

    addTrigger(): void {
        const { commands } = this.app;
        this.command = 'jlab-examples:command-palette';

        // Add a command
        commands.addCommand(this.command, {
            label: 'Generate slides',
            caption: 'Generate slides',
            execute: async (args: any) => {
                //@ts-ignore
                const cells: Array<Cell> = this.notebookTools.activeNotebookPanel.content.widgets
                this.notebookPanel = this.notebookTools.activeNotebookPanel
                this.cellsIndex = computeCurCellsIdx(cells)
                // upload the notebook to the back-end
                await this.widgetContent.updateNotebookInfo(bundleStaticNotebookCells(cells))

                // ref: https://github.com/jupyterlab/jupyterlab-toc/blob/9951a4d8caa8fe6c42c86836afc9c0ecf5e3d41d/src/generators/notebook/index.ts
                const navNBCallback = (cellIdx: number) => {
                    this.notebookPanel.content.activeCellIndex = cellIdx
                    this.cellsIndex[cellIdx].node.scrollIntoView();
                }

                const getNBCell = (cellIdx: number) => {
                    return this.cellsIndex[cellIdx]
                }

                this.widgetContent.setNavNBCb(navNBCallback)
                this.widgetContent.setGetNBCell(getNBCell)

                // Update the React widget
                this.widgetContent.update()
                this.widget.update()
                if (!this.widget.isAttached) {
                    // Attach the widget to the main work area if it's not there
                    this.app.shell.add(this.widget, 'right');
                }
                // Activate the widget
                this.app.shell.activateById(this.widget.id);
            }
        });
    }

    addToMenu(): void {
        const slideMenu: Menu = new Menu({ commands: this.app.commands })
        slideMenu.title.label = "Notebook2slides"
        this.menu.addMenu(slideMenu, { rank: 80 })
        slideMenu.addItem({
            command: this.command,
            args: {
                origin: "generate"
            }
        })
    }
}