import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Gideon} from '../../projects/core/src/lib/gideon';
import {LocationHistory} from '../../projects/core/src/lib/mouse/record/location-history';
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

  constructor(private router: Router) {
  }

  onActivate(componentRef: any) {
    this.trackedComponent = componentRef;
  }

  replay(history: LocationHistory) {
    this.router.navigate([history.location.pathname]).then(() => {
        this.gideon.stopReplay();
        this.gideon.replay(this.trackedComponent.container.nativeElement, history);
    });
  }
}
