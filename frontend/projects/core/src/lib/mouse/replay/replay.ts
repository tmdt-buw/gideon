import {LocationHistory} from '../record/location-history';
import {MouseEventRecord, MouseEventType} from '../record/model/mouse-event-record';
import {ReplaySpeed} from './config/replay-speed';
import {Cursor} from './widgets/cursor';
import {Heatmap} from './widgets/heatmap';
import {Player} from './widgets/player';

export class Replay {

  private readonly element: any;
  private readonly history: LocationHistory;

  private replaySpeed = ReplaySpeed.NORMAL;

  private readonly player: Player;
  private readonly cursor;
  private heatmap: Heatmap;

  get events() {
    return this.history.mouseEvents;
  }

  constructor(element: any, history: LocationHistory) {
    this.element = element;
    this.history = history;
    this.player = new Player(this);
    document.body.appendChild(this.player);
    this.cursor = new Cursor();
    document.body.appendChild(this.cursor);
    this.element.classList.add('gd-hidden');
  }

  toggleHeatmap(type: MouseEventType) {
    this.heatmap?.remove();
    this.heatmap = new Heatmap(this.element, this.history, type);
  }

  remove() {
    this.heatmap?.remove();
    this.cursor?.remove();
    this.player?.remove();
    this.element.classList.remove('gd-hidden');
  }

  async start(time?: number): Promise<void> {
    if (this.events.history.length > 0) {
      const history = this.events.history;
      const max = history.length;
      let next = 1;
      if (time) {
        const init = this.events.initialized;
        let last;
        for (let i = 0; i < history.length; i++) {
          last = this.history.mouseEvents[i];
          next = i + 1;
          const startTime = history[next].time - init;
          if (next < max && startTime > time ) {
            await this.replayMouseEvent(last, startTime - time);
          }
        }
      } else {
        await this.replayMouseEvent(this.history[0], this.events.initialized);
      }
      if (next < max) {
        for (let i = next; i < this.events.history.length; i++) {
          // @ts-ignore
          await this.replayMouseEvent(cursor, this.history[i], this.history[i - 1].time);
        }
      }
    }
  }

  stop(): void {

  }

  private async replayMouseEvent(record: MouseEventRecord, refTime: number): Promise<void> {
    switch (record.event.type) {
      case 'click': {
        this.replayMouseClick(record);
        break;
      }
      case 'mousemove': {
        this.replayMouseMove(record);
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

  private replayMouseMove(eventRecord: MouseEventRecord): void {
    const rect = this.element.getBoundingClientRect();
    const x = eventRecord.x * rect.right;
    const y = eventRecord.y * rect.bottom;
    const event = eventRecord.event;
    this.cursor.style.left = x + 'px';
    this.cursor.style.top = y + 'px';
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
