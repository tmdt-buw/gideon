import {HistoryRecord} from './model/history-record';

export class Gideon {

  private constructor() {
  }

  private static instance: Gideon;

  private history: HistoryRecord[] = [];

  public static getInstance(): Gideon {
    if (!Gideon.instance) {
      Gideon.instance = new Gideon();
    }
    return Gideon.instance;
  }

  registerElement(element: any): void {
    this.history.push(new HistoryRecord(Object.assign({}, window.location), element));
  }

  getHistoryRecords(): { label: string, record: HistoryRecord }[] {
    return this.history.map(record => {
      return { label: record.location.pathname, record};
    });
  }

  replayLatest(): void {
    this.history[this.history.length - 1].mouseEvents.replayContainer();
  }

  showHeatmapForLatest(): void {
    this.history[this.history.length - 1].mouseEvents.createMouseMoveHeatmap();
  }

  hideHeatmap(): void {
    this.history[this.history.length - 1].mouseEvents.removeHeatmap();
  }

}

