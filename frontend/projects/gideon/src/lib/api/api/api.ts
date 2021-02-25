export * from './historyController.service';
import {HistoryControllerService} from './historyController.service';
import {SessionControllerService} from './sessionController.service';

export * from './sessionController.service';
export const APIS = [HistoryControllerService, SessionControllerService];
