import {ApplicationState} from '../api';
import {HistoryActionType} from './action-type';

export class HistoryNavigateEvent {
  type: HistoryActionType;
  applicationState: ApplicationState;
}
