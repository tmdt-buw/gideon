import {LocationHistory} from '../record/location-history';
import {MouseEventRecord, MouseEventType} from '../record/model/mouse-event-record';
import {Configuration} from './config/configuration';
import {ReplaySpeed} from './config/replay-speed';
import {Heatmap} from './widgets/heatmap';
import {Player} from './widgets/player';

export class Replay {

  private readonly element: any;
  private readonly history: LocationHistory;

  private replaySpeed = ReplaySpeed.NORMAL;

  private readonly player: Player;
  private heatmap: Heatmap;

  get events() {
    return this.history.mouseEvents;
  }

  constructor(element: any, history: LocationHistory) {
    this.element = element;
    this.history = history;
    this.player = new Player(this);
    document.body.appendChild(this.player);
  }

  async replayContainer(): Promise<void> {
    if (this.events.history.length > 0) {
      this.element.classList.add('hidden');
      const cursor = this.addCursor();

      await this.replayMouseEvent(cursor, this.history[0], this.events.initialized);
      for (let i = 1; i < this.events.history.length; i++) {
        // @ts-ignore
        await this.replayMouseEvent(cursor, this.history[i], this.history[i - 1].time);
      }

      this.element.classList.remove('hidden');
      this.removeCursor();
    }
  }

  toggleHeatmap(type: MouseEventType) {
    if (this.heatmap) {
      this.heatmap.remove();
    }
    this.heatmap = new Heatmap(this.element, this.history, type);
  }

  remove() {
    this.heatmap.remove();
  }

  private addCursor(): HTMLDivElement {
    let cursor = document.getElementById('gdCursor') as HTMLDivElement;
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.id = 'gdCursor';
      cursor.style.position = 'absolute';
      cursor.style.width = Configuration.MOUSE_SIZE;
      cursor.style.height = Configuration.MOUSE_SIZE;
      cursor.style.borderRadius = Configuration.MOUSE_SIZE;
      cursor.style.backgroundSize = Configuration.MOUSE_SIZE;
      cursor.style.backgroundImage = 'url(' + Configuration.CURSOR_ICON + ')';
      document.body.appendChild(cursor);
    }
    return cursor;
  }

  private removeCursor(): void {
    const cursor = document.getElementById('gdCursor');
    if (cursor) {
      cursor.remove();
    }
  }

  async replayMouseEvent(cursor: HTMLDivElement, record: MouseEventRecord, refTime: number): Promise<void> {
    switch (record.event.type) {
      case 'click': {
        this.replayMouseClick(record);
        break;
      }
      case 'mousemove': {
        this.replayMouseMove(cursor, record);
        break;
      }
      default: {
        // this.replayMouseDefault(record.event);
        break;
      }
    }
    await this.sleep(record.time - refTime);
  }

  private replayMouseClick(eventRecord: MouseEventRecord): void {
    const rect = this.element.getBoundingClientRect();
    const x = eventRecord.x * rect.right;
    const y = eventRecord.y * rect.bottom;
    const event = eventRecord.event;
    // create click effect
    const clickEffect = document.createElement('div');
    clickEffect.className = 'clickEffect';
    clickEffect.style.top = y + 'px';
    clickEffect.style.left = x + 'px';
    document.body.appendChild(clickEffect);
    clickEffect.addEventListener('animationend', () => clickEffect.parentElement.removeChild(clickEffect));
    // dispatch click event
    const evt = document.createEvent('MouseEvent');
    evt.initMouseEvent('click', true, true, window,
      0, 0, 0, x, y, false, false, false, false, 0, null);
    event.target.dispatchEvent(evt);
  }

  private replayMouseMove(cursor: HTMLDivElement, eventRecord: MouseEventRecord): void {
    const rect = this.element.getBoundingClientRect();
    const x = eventRecord.x * rect.right;
    const y = eventRecord.y * rect.bottom;
    const event = eventRecord.event;
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
    const evt = document.createEvent('MouseEvent');
    evt.initMouseEvent('mousemove', true, true, window,
      0, 0, 0, x, y, false, false, false, false, 0, null);
    event.target.dispatchEvent(evt);
  }

  private sleep(ms: number): Promise<any> {
    return new Promise(
      resolve => setTimeout(resolve, ms * this.replaySpeed)
    );
  }


}
