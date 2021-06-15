import {LocationHistory} from './mouse/record/location-history';
import {Replay} from './mouse/replay/replay';

export class Gideon {

  private constructor() {
  }

  private static instance: Gideon;

  private _history: LocationHistory[] = [];
  private _replay: Replay;

  public static getInstance(): Gideon {
    if (!Gideon.instance) {
      Gideon.instance = new Gideon();
    }
    return Gideon.instance;
  }

  getHistoryRecords(): LocationHistory[] {
    return this._history.filter(history => history.events.history.length > 0);
  }

  registerElement(element: any): void {
    this._history.push(new LocationHistory(Object.assign({}, window.location), element));
  }

  replay(element: any, history: LocationHistory) {
    this._replay = new Replay(this, element, history);
    this.setRecording(false);
  }

  stopReplay() {
    this._replay?.remove();
    this.setRecording(true);
  }

  private setRecording(isRecording: boolean) {
    const latest = this.getLatestHistoryElement();
    if (latest) {
      this.getLatestHistoryElement().events.disabled = !isRecording;
    }
  }

  private getLatestHistoryElement() {
    const len = this._history.length;
    if (len > 0) {
      return this._history[len - 1];
    }
    return null;
  }
}

