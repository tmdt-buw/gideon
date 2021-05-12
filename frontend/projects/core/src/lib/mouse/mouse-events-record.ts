import {Configuration} from './config/configuration';
import {ReplaySpeed} from './config/replay-speed';
import {MouseEventRecord} from './mouse-event-record';
import * as h337 from 'heatmap.js';

export class MouseEventsRecord {

  constructor(element: any) {
    this.registerContainer(element);
  }

  private history: MouseEventRecord[] = [];
  private replaying = false;
  private replaySpeed = ReplaySpeed.NORMAL;
  private initialized: number;

  private element: any;

  private heatmap: any;

  private registerContainer(element: any): void {
    this.element = element;
    this.initialized = Date.now();

    this.element.addEventListener('click', (event) => {
      this.recordMouseEvent(event);
    });

    this.element.addEventListener('mousemove', (event) => {
      this.recordMouseEvent(event);
    });
  }

  private recordMouseEvent(event: MouseEvent): void {
    if (!this.replaying) {
      const record = new MouseEventRecord();
      record.time = Date.now();
      const rect = this.element.getBoundingClientRect();
      record.x = event.x / rect.width;
      record.y = event.y / rect.height;
      record.event = event;
      this.history.push(record);
    }
  }

  async replayContainer(): Promise<void> {
    this.replaying = true;
    this.element.classList.add('hidden');
    const cursor = this.addCursor();

    await this.replayMouseEvent(cursor, this.history[0], this.initialized);
    for (let i = 1; i < this.history.length; i++) {
      // @ts-ignore
      await this.replayMouseEvent(cursor, this.history[i], this.history[i - 1].time);
    }

    this.element.classList.remove('hidden');
    this.removeCursor();
    this.replaying = false;
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
    const x = eventRecord.x * rect.width;
    const y = eventRecord.y * rect.height;
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
    const x = eventRecord.x * rect.width;
    const y = eventRecord.y * rect.height;
    const event = eventRecord.event;
    cursor.style.left = x - 5 + 'px';
    cursor.style.top = y - 5 + 'px';
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

  createMouseMoveHeatmap(): void {
    this.createHeatmap(this.history.filter(record => record.event.type === 'mousemove'));
  }

  private createHeatmap(events: MouseEventRecord[]): void {
    this.heatmap = h337.create({
      container: this.element
    });
    const data = events.map(event => {
      const rect = this.element.getBoundingClientRect();
      return {
        x: Math.floor(event.x * rect.width),
        y: Math.floor(event.y * rect.height),
        value: 1
      };
    });
    this.heatmap.setData({
      max: 1,
      data
    });
  }

  removeHeatmap(): void {
    this.heatmap._renderer.canvas.remove();
  }
}
