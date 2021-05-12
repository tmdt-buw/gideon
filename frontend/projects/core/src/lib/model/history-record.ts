import {MouseEventsRecord} from '../mouse/mouse-events-record';

export class HistoryRecord {

  location: Location;
  mouseEvents: MouseEventsRecord;

  constructor(location: Location, element: any) {
    this.location = location;
    this.mouseEvents = new MouseEventsRecord(element);
  }
}


