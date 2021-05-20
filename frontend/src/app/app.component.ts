import {Component, ViewChildren} from '@angular/core';
import {TrackedComponent} from '../../projects/core/src/examples/angular/tracked.component';
import {Gideon} from '../../projects/core/src/lib/gideon';
import {appRoutingNames} from './app-routing.names';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  readonly routes = appRoutingNames;

  isCollapsed = true;
  gideon = Gideon.getInstance();

  trackedComponent;

  constructor() {
  }

  onActivate(componentRef: any) {
    this.trackedComponent = componentRef.elementRef.nativeElement;
  }

  replay(): void {
    this.gideon.replayLatest(this.trackedComponent);
  }

  toggleHeatmap(): void {
    this.gideon.toggleHeatmap();
  }

}
