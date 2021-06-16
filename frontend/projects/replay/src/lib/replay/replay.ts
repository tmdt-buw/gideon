import ResizeObserver from 'resize-observer-polyfill';
import {BehaviorSubject} from 'rxjs';
import {Gideon} from '../gideon';
import {LocationHistory} from '../record/location-history';
import {EventRecord} from '../record/model/events-record';
import {KeyboardEventRecord} from '../record/model/keyboard-event-record';
import {MouseEventRecord, MouseEventType} from '../record/model/mouse-event-record';
import {Cursor} from './widgets/cursor';
import {Heatmap} from './widgets/heatmap';
import {Player} from './widgets/player';

export class Replay {

  private readonly gideon: Gideon;
  private readonly element: any;
  private readonly history: LocationHistory;
  private readonly historyByTimeFrame: EventRecord[][];
  private readonly timeFrame = 10;

  private readonly player: Player;
  private readonly cursor;
  private heatmap: Heatmap;

  timer: any;
  playTime = new BehaviorSubject(0);
  playing = new BehaviorSubject(false);
  complete = new BehaviorSubject(false);

  get events() {
    return this.history.events;
  }

  constructor(gideon: Gideon, element: any, history: LocationHistory) {
    this.gideon = gideon;
    this.element = element;
    this.history = history;
    this.historyByTimeFrame = this.history.events.historyByTimeframe(this.timeFrame);
    this.player = new Player(this);
    document.body.appendChild(this.player);
    this.cursor = new Cursor();
    document.body.appendChild(this.cursor);
    this.element.classList.add('gd-hidden');
    const observer = new ResizeObserver(entries => {
      this.onResize();
    });
    observer.observe(this.element);
  }

  toggleHeatmap(type?: MouseEventType): void {
    if (this.heatmap) {
      this.removeHeatmap();
    } else {
      this.showHeatmap(type);
    }
  }

  showHeatmap(type?: MouseEventType): void {
    this.heatmap?.remove();
    this.heatmap = new Heatmap(this.element, this.history, type);
  }

  removeHeatmap(): void {
    this.heatmap?.remove();
    this.heatmap = null;
  }

  remove() {
    this.pause();
    this.removeHeatmap();
    this.cursor?.remove();
    this.player?.remove();
    this.element.classList.remove('gd-hidden');
  }

  play() {
    this.playing.next(true);
    this.startTimer();
  }

  pause() {
    this.playing.next(false);
    clearInterval(this.timer);
  }

  reset() {
    this.playTime.next(0);
    this.complete.next(false);
    this.play();
  }

  stopReplay() {
    this.gideon.stopReplay();
  }

  private startTimer() {
    this.timer = setInterval(() => this.incrementTime(), this.timeFrame);
  }

  setPlayTime(time: number, restore?: boolean): void {
    const max = Math.ceil(this.events.playTime / 1000) * 1000;
    if (time < max) {
      if (this.complete.value) {
        this.complete.next(false);
      }
      const idx = time / this.timeFrame;
      this.playTime.next(time);
      const frame = this.historyByTimeFrame[idx];
      if (restore && frame.length < 1) {
        let restored = false;
        for (let i = idx; i > 0; i--) {
          const prev = this.historyByTimeFrame[i];
          if (prev.length > 0) {
            this.replayRecords(prev);
            restored = true;
            break;
          }
        }
        // there is no previous state (the cursor was not visible before)
        if (!restored) {
          this.hideCursor();
        }
      } else {
        this.replayRecords(frame);
      }
    }
    if (time >= max) {
      this.complete.next(true);
      this.playing.next(false);
      clearInterval(this.timer);
    }
  }

  private onResize() {
    if (this.heatmap) {
      this.showHeatmap(this.heatmap.type);
    }
    this.setPlayTime(this.playTime.value);
  }

  private incrementTime(): void {
    this.setPlayTime(this.playTime.value + this.timeFrame);
  }

  replayRecords(records: EventRecord[]): void {
    if (records) {
      records.forEach(record => {
        this.replayEvent(record);
      });
    }
  }

  private replayEvent(record: EventRecord): void {
    if (record instanceof KeyboardEventRecord) {
      this.replayKeyboardEvent(record);
    }
    if (record instanceof MouseEventRecord) {
      switch (record.type) {
        case 'click': {
          this.replayMouseClick(record);
          break;
        }
        case 'mouseleave': {
          this.replayMouseLeave(record);
          break;
        }
        default: {
          this.replayMouseDefault(record);
          break;
        }
      }
    }
  }

  private replayMouseClick(eventRecord: MouseEventRecord): void {
    const replay = this.replayMouseDefault(eventRecord);
    // create click effect
    const clickEffect = document.createElement('div');
    clickEffect.className = 'clickEffect';
    clickEffect.style.left = replay.x + 'px';
    clickEffect.style.top = replay.y + 'px';
    document.body.appendChild(clickEffect);
    clickEffect.addEventListener('animationend', () => clickEffect.parentElement.removeChild(clickEffect));
  }

  private replayMouseLeave(eventRecord: MouseEventRecord): void {
    this.replayMouseDefault(eventRecord);
    this.hideCursor();
  }

  private replayMouseDefault(eventRecord: MouseEventRecord): { x: number; y: number; } {
    const rect = this.element.getBoundingClientRect();
    const x = Math.round(eventRecord.x * rect.width + rect.left);
    const y = Math.round(eventRecord.y * rect.height + rect.top);
    this.cursor.top = y + 'px';
    this.cursor.left = x + 'px';
    const evt = new MouseEvent(eventRecord.type, {
      bubbles: true, cancelable: true, clientX: x, clientY: y, view: window
    });
    const element = document.querySelector(eventRecord.element);
    element.dispatchEvent(evt);
    return {x, y};
  }

  private hideCursor(): void {
    this.cursor.top = '100%';
    this.cursor.left = '100%';
  }

  private replayKeyboardEvent(eventRecord: KeyboardEventRecord): void {
    const evt = new KeyboardEvent(eventRecord.type, eventRecord.event);
    const element = document.querySelector(eventRecord.element);
    element.dispatchEvent(evt);
  }
}
