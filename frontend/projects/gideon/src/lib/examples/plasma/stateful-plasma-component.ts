import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StatefulComponent} from '../../model/stateful.component';
import {HistoryService} from '../../service/history.service';

@Component({
  selector: 'gd-stateful-sdm-component',
  template: ''
})
export abstract class StatefulPlasmaComponent extends StatefulComponent {

  protected constructor(router: Router, route: ActivatedRoute, protected history: HistoryService) {
    super(router, route, history);
  }

}
