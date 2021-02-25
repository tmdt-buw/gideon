import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HistoryService} from '../service/history.service';
import {Encoder} from './encoder';
import {HistoryNavigateEvent} from './history-navigate-event';
import {HISTORY_NAV_TYPE} from './state-history';


@Component({
  selector: 'gd-session',
  template: ''
})
export abstract class SessionComponent implements OnInit {

  protected constructor(protected router: Router, protected route: ActivatedRoute, private history: HistoryService) {
  }

  abstract get project(): string;

  abstract get user(): string;

  ngOnInit(): void {
    this.history.initSession(this.project, this.user);
  }

  onNavigate(event: HistoryNavigateEvent): void {
    const state = event.applicationState;
    const queryParams = Encoder.encodeValues(state.parameters);
    this.router.navigate([state.component], {
      relativeTo: this.route,
      queryParams,
      state: {
        type: HISTORY_NAV_TYPE
      }
    });
  }

}
