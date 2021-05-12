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
  heatmap = false;
  gideon = Gideon.getInstance();

  constructor() {
  }

  replay(): void {
    this.gideon.replayLatest();
  }

  toggleHeatmap(): void {
    if (this.heatmap) {
      this.gideon.hideHeatmap();
    } else {
      this.gideon.showHeatmapForLatest();
    }
    this.heatmap = !this.heatmap;
  }

}
