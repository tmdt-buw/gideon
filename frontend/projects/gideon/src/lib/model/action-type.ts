export enum ActionType {
  navigation = 'navigate',
  layoutChange = 'layout',
  filterChange = 'filter',
  parameterChange = 'parameter',
  historyUndo = 'undo',
  historyRedo = 'redo',
  historyRevert = 'revert'
}

export type HistoryActionType = ActionType.historyUndo | ActionType.historyRedo | ActionType.historyRevert;

export class FilterChangeValue {
  added?: string[];
  removed?: string[];
  command?: string;
}

export function isHistoryActionType(type: string): boolean {
  return type === ActionType.historyUndo || type === ActionType.historyRedo || type === ActionType.historyRevert;
}

