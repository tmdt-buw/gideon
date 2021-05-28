import {MouseEventRecord} from './mouse-event-record';

export class MouseEventsRecord {

  constructor(element: any) {
    this.registerContainer(element);
  }

  public disabled = false;

  private _history: MouseEventRecord[] = [];
  private _initialized: number;
  private element: any;

  get history() {
    return this._history;
  }

  get initialized(): number {
    return this._initialized;
  }

  get playTime(): number {
    const last = this._history.length - 1;
    return this._history[last].time - this._initialized;
  }

  historyByTimeframe(ms: number): MouseEventRecord[][] {
    const res = [];
    for (let time = 0; time < Math.ceil(this.playTime / ms) + 1; time++) {
      res.push([]);
    }
    this.history.forEach(el => {
      const index = Math.floor((el.time - this.initialized) / ms);
      res[index].push(el);
    });
    return res;
  }

  /**
   * Register mouse events
   * @param element
   * @private
   */
  private registerContainer(element: any): void {
    this.element = element;
    this._initialized = Date.now();
    ['click', 'mousemove', 'mouseenter', 'mouseleave'].forEach(eventType => {
      this.element.addEventListener(eventType, (event) => {
        if (this.disabled) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          this.recordMouseEvent(event);
        }
      });
    });
  }

  /**
   * Record a mouse event
   * @param event
   * @private
   */
  private recordMouseEvent(event: MouseEvent): void {
    if (!this.disabled) {
      const record = new MouseEventRecord();
      record.time = Date.now();
      const rect = this.element.getBoundingClientRect();
      record.x = event.x / rect.right;
      record.y = event.y / rect.bottom;
      record.event = event;
      this._history.push(record);
    }
  }
}
