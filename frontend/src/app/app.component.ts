import {Component} from '@angular/core';
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
  isReplaying = false;

  trackedComponent;

  constructor() {
  }

  onActivate(componentRef: any) {
    this.trackedComponent = componentRef.elementRef.nativeElement;
  }

  replay(): void {
    if (this.isReplaying) {
      this.gideon.stopReplay();
      this.isReplaying = false;
    } else {
      this.gideon.replayLatest(this.trackedComponent);
      this.isReplaying = true;
    }
  }

  toggleHeatmap(): void {
    this.gideon.toggleHeatmap();
  }

}
