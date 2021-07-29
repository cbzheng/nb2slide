import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import 'bootstrap/dist/css/bootstrap.min.css';

import {
  INotebookTools,
  INotebookTracker,
  // NotebookActions, Notebook, NotebookPanel, INotebookModel
} from '@jupyterlab/notebook';

import { IMainMenu } from '@jupyterlab/mainmenu';

import { NB2Slide } from './nb2slide';

const activateReacttWidgetasync = async (
  app: JupyterFrontEnd,
  mainmenu: IMainMenu,
  notebook: INotebookTools | null,
  tracker: INotebookTracker
) => {
  console.log('JupyterLab extension nb2slide is activated!！');

  const nb2slide = new NB2Slide(
    app,
    mainmenu,
    notebook,
    tracker
  )

  console.log("NB2Slide loaded", nb2slide)
}


/**
 * Initialization data for the nb2slide extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'nb2slide:plugin',
  autoStart: true,
  requires: [IMainMenu, INotebookTools, INotebookTracker],
  activate: activateReacttWidgetasync
};

export default plugin;
