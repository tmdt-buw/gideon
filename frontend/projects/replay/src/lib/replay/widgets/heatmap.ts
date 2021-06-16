import * as h337 from 'heatmap.js';
import {LocationHistory} from '../../record/location-history';
import {MouseEventRecord, MouseEventType} from '../../record/model/mouse-event-record';


export class Heatmap {

  readonly type: MouseEventType;

  private element: any;
  private heatmap: any;

  constructor(element: any, historyRecord: LocationHistory, type?: MouseEventType) {
    this.element = element;
    this.type = type;
    this.createMouseMoveHeatmap(historyRecord.events.mouseEvents, type);
  }

  private createMouseMoveHeatmap(events: MouseEventRecord[], type: MouseEventType): void {
    const filteredEvents = type ? events.filter(record => record.type === type) : events;
    this.create(filteredEvents);
  }

  private create(events: MouseEventRecord[]): void {
    const position = this.element.style.position;
    if (!position) {
      this.element.style.position = 'relative';
    }
    const heatmap = document.createElement('div');
    const rect = this.element.getBoundingClientRect();
    heatmap.style.left = '0';
    heatmap.style.top = '0';
    heatmap.style.width = `${rect.width}px`;
    heatmap.style.height = `${rect.height}px`;
    this.element.appendChild(heatmap);
    this.heatmap = {
      container: heatmap,
      heatmap: h337.create({
        container: heatmap,
        radius: 5
      })
    };
    heatmap.style.position = 'absolute';
    const data = events.map(event => {
      return {
        x: Math.round(event.x * rect.width),
        y: Math.round(event.y * rect.height)
      };
    });
    this.heatmap.heatmap.setData({
      data
    });
  }

  remove(): void {
    this.heatmap.heatmap._renderer.canvas.remove();
    this.heatmap.container.remove();
  }

}






