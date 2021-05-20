import {MouseEventsRecord} from './model/mouse-events-record';

export class LocationHistory {

  location: Location;
  mouseEvents: MouseEventsRecord;

  constructor(location: Location, element: any) {
    this.location = location;
    this.mouseEvents = new MouseEventsRecord(element);
  }

  get label(): string {
    return this.location.pathname;
  }
}


