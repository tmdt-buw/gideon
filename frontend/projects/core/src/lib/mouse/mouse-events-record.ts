import {Configuration} from '../browser-events/configuration';
import {ReplaySpeed} from '../browser-events/replay-speed';
import {MouseEventRecord} from './mouse-event-record';

export class MouseEventsRecord {

  private constructor() {
  }

  private static instance: MouseEventsRecord;

  history: MouseEventRecord[] = [];
  replaying = false;
  replaySpeed = ReplaySpeed.NORMAL;
  initialized: number;

  private element: any;

  public static getInstance(): MouseEventsRecord {
    if (!MouseEventsRecord.instance) {
      MouseEventsRecord.instance = new MouseEventsRecord();
    }
    return MouseEventsRecord.instance;
  }

  registerContainer(element): void {
    this.element = element;
    this.initialized = Date.now();

    this.element.addEventListener('click', (event) => {
      this.recordMouseEvent(event);
    });

    this.element.addEventListener('mousemove', (event) => {
      this.recordMouseEvent(event);
    });
  }

  recordMouseEvent(event: MouseEvent): void {
    if (!this.replaying) {
      const record = new MouseEventRecord();
      record.time = Date.now();
      record.event = event;
      this.history.push(record);
    }
  }

  async replayContainer(element): Promise<void> {
    this.replaying = true;
    element.classList.add('hidden');
    const cursor = this.addCursor();

    await this.replayMouseEvent(cursor, this.history[0], this.initialized);
    for (let i = 1; i < this.history.length; i++) {
      // @ts-ignore
      await this.replayMouseEvent(cursor, this.history[i], this.history[i - 1].time);
    }

    element.classList.remove('hidden');
    // this.removeCursor();
    this.replaying = false;
  }

  addCursor(): HTMLDivElement {
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

  removeCursor(): void {
    const cursor = document.getElementById('gdCursor');
    if (cursor) {
      cursor.remove();
    }
  }

  async replayMouseEvent(cursor: HTMLDivElement, record: MouseEventRecord, refTime: number): Promise<void> {
    switch (record.event.type) {
      case 'click': {
        this.replayMouseClick(record.event);
        break;
      }
      case 'mousemove': {
        this.replayMouseMove(cursor, record.event);
        break;
      }
      default: {
        // this.replayMouseDefault(record.event);
        break;
      }
    }
    await this.sleep(record.time - refTime);
  }

  replayMouseClick(event: MouseEvent): void {
    // create click effect
    const clickEffect = document.createElement('div');
    clickEffect.className = 'clickEffect';
    clickEffect.style.top = event.y + 'px';
    clickEffect.style.left = event.x + 'px';
    document.body.appendChild(clickEffect);
    clickEffect.addEventListener('animationend', () => clickEffect.parentElement.removeChild(clickEffect));
    // dispatch click event
    const evt = document.createEvent('MouseEvent');
    evt.initMouseEvent('click', true, true, window,
      0, 0, 0, event.x, event.y, false, false, false, false, 0, null);
    event.target.dispatchEvent(evt);
  }

  replayMouseMove(cursor: HTMLDivElement, event: MouseEvent): void {
    cursor.style.left = event.x - 5 + 'px';
    cursor.style.top = event.y - 5 + 'px';
    const evt = document.createEvent('MouseEvent');
    evt.initMouseEvent('mousemove', true, true, window,
      0, 0, 0, event.x, event.y, false, false, false, false, 0, null);
    event.target.dispatchEvent(evt);
  }

  sleep(ms): Promise<any> {
    return new Promise(
      resolve => setTimeout(resolve, ms * this.replaySpeed)
    );
  }

}
