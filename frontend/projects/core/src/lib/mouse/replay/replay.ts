import {BehaviorSubject} from 'rxjs';
import {LocationHistory} from '../record/location-history';
import {MouseEventRecord, MouseEventType} from '../record/model/mouse-event-record';
import {ReplaySpeed} from './config/replay-speed';
import {Cursor} from './widgets/cursor';
import {Heatmap} from './widgets/heatmap';
import {Player} from './widgets/player';

export class Replay {

  private readonly element: any;
  private readonly history: LocationHistory;
  private readonly historyByTimeFrame: MouseEventRecord[][];

  private readonly timeFrame = 5;
  private replaySpeed = ReplaySpeed.NORMAL;

  private readonly player: Player;
  private readonly cursor;
  private heatmap: Heatmap;

  timer: any;
  playTime = new BehaviorSubject(0);
  playing = new BehaviorSubject(false);
  complete = new BehaviorSubject(false);

  get events() {
    return this.history.mouseEvents;
  }

  onResize() {
    if (this.heatmap) {
      this.showHeatmap(this.heatmap.type);
    }
  }

  constructor(element: any, history: LocationHistory) {
    this.element = element;
    this.history = history;
    this.historyByTimeFrame = this.history.mouseEvents.historyByTimeframe(this.timeFrame);
    this.player = new Player(this);
    document.body.appendChild(this.player);
    this.cursor = new Cursor();
    document.body.appendChild(this.cursor);
    this.element.classList.add('gd-hidden');
    window.addEventListener('resize', () => this.onResize());
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

  private startTimer() {
    this.timer = setInterval(() => this.incrementTime(), this.timeFrame);
  }

  private setPlayTime(time: number, restore?: boolean): void {
    const max = Math.ceil(this.events.playTime / 1000) * 1000;
    if (time < max) {
      if (this.complete.value) {
        this.complete.next(false);
      }
      const idx = time / this.timeFrame;
      this.playTime.next(time);
      const frame = this.historyByTimeFrame[idx];
      if (restore && frame.length < 1) {
        for (let i = idx; i > 0; i--) {
          const prev = this.historyByTimeFrame[i];
          if (prev.length > 0) {
            this.replayRecords(prev);
            break;
          }
        }
        this.hideCursor();
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

  private incrementTime(): void {
    this.setPlayTime(this.playTime.value + this.timeFrame);
  }

  replayRecords(records: MouseEventRecord[]): void {
    if (records) {
      records.forEach(record => {
        this.replayMouseEvent(record);
      });
    }
  }

  private replayMouseEvent(record: MouseEventRecord): void {
    switch (record.event.type) {
      case 'click': {
        this.replayMouseClick(record);
        break;
      }
      case 'mouseleave': {
        this.replayMouseLeave(record);
        break;
      }
      default: {
        this.replayDefault(record);
        break;
      }
    }
  }

  private replayMouseClick(eventRecord: MouseEventRecord): void {
    const replay = this.replayDefault(eventRecord);
    // create click effect
    const clickEffect = document.createElement('div');
    clickEffect.className = 'clickEffect';
    clickEffect.style.top = replay.y + 'px';
    clickEffect.style.left = replay.x + 'px';
    document.body.appendChild(clickEffect);
    clickEffect.addEventListener('animationend', () => clickEffect.parentElement.removeChild(clickEffect));
  }

  private replayMouseLeave(eventRecord: MouseEventRecord): void {
    this.replayDefault(eventRecord);
    this.hideCursor();
  }

  private replayDefault(eventRecord: MouseEventRecord): { x: number; y: number; } {
    const rect = this.element.getBoundingClientRect();
    const x = eventRecord.x * rect.right;
    const y = eventRecord.y * rect.bottom;
    this.cursor.top = y + 'px';
    this.cursor.left = x + 'px';
    const evt = document.createEvent('MouseEvent');
    evt.initMouseEvent(eventRecord.event.type, true, true, window,
      0, 0, 0, x, y, false, false, false, false, 0, null);
    eventRecord.event.target.dispatchEvent(evt);
    return {x, y};
  }

  private hideCursor(): void {
    this.cursor.top = '100%';
    this.cursor.left = '100%';
  }

}
