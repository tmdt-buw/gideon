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
    return this._history;
  }

  registerElement(element: any): void {
    this._history.push(new LocationHistory(Object.assign({}, window.location), element));
  }

  replayLatest(element: any): void {
    const r = this._history[this._history.length - 1];
    this.replay(element, r);
  }

  replay(element: any, history: LocationHistory) {
    this._replay = new Replay(element, history);
  }

  toggleHeatmap(): void {
    this._replay.toggleHeatmap('mousemove');
  }

}

