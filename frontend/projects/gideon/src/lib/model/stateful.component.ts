import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {isEqual} from 'lodash';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {v4 as uuid} from 'uuid';
import {ApplicationAction, ApplicationState} from '../api';
import {HistoryService} from '../service/history.service';
import {ActionType} from './action-type';
import {Encoder} from './encoder';

import {Parameter} from './parameter';
import {HISTORY_NAV_TYPE} from './state-history';

@Component({
  selector: 'gd-stateful',
  template: ''
})
export abstract class StatefulComponent implements OnInit {

  abstract readonly view: string;
  abstract readonly excludedQueryParams: string[];
  $stateTransitionComplete: Subject<any> = new Subject<any>();
  parameters: { [key: string]: Parameter } = {};
  navigationQueue: [string, string][] = [];

  protected constructor(protected router: Router, protected route: ActivatedRoute, protected history: HistoryService) {
  }

  abstract getPreview(): string;

  abstract onParameterChange(name: string): void;

  abstract onQueryParametersChange(changes: string[]): void;

  ngOnInit(): void {
    this.recordNavigation(this.filteredQueryParams(this.route.snapshot.queryParams));
    this.route.queryParams.subscribe(params => {
      const type = window.history.state.type;
      if (type === HISTORY_NAV_TYPE) {
        this.updateQueryParameters(this.filteredQueryParams(params));
      }
    });
  }

  getParameter(name: string): any {
    return this.parameters[name].change.value;
  }

  setParameter(name: string, value: any, options?: { onlySelf?: boolean; emitEvent?: boolean; emitModelToViewChange?: boolean; emitViewToModelChange?: boolean; }): void {
    this.parameters[name].change.setValue(value, options);
    if (options && Object.keys(options).includes('emitEvent') && !options.emitEvent) {
      this.setQueryParam(name, value);
    }
  }

  registerParameter<T>(name: string, defaultValue: T, type: string, debounce?: number): void {
    let value = Encoder.decode(this.route.snapshot.queryParamMap.get(name)) as T;
    if (!value || value instanceof Array && value.length < 1) {
      this.setQueryParam(name, defaultValue);
      value = defaultValue;
    }
    this.parameters[name] = new Parameter(name, new FormControl(value), type);
    this.subscribeToParameter(this.parameters[name], debounce);
  }

  subscribeToParameter(parameter: Parameter, debounce?: number): void {
    parameter.change.valueChanges.pipe(
        distinctUntilChanged(isEqual),
        debounceTime(debounce || 1000)
    ).subscribe(value => {
      this.setQueryParam(parameter.name, value);
      this.performRecordAction({
        id: undefined,
        time: new Date().toISOString(),
        type: parameter.type,
        parameters: {
          [parameter.name]: value,
        }
      });
      this.onParameterChange(parameter.name);
    });
  }

  recordNavigation(queryParams: Params): void {
    this.recordAction(queryParams, ActionType.navigation);
  }

  recordRevert(queryParams: Params): void {
    this.recordAction(queryParams, ActionType.historyRevert);
  }

  private recordAction(queryParams: Params, actionType: ActionType): void {
    const navigation: ApplicationAction = {
      id: undefined,
      time: new Date().toISOString(),
      type: actionType,
      parameters: {
        route: this.view,
        queryParameters: queryParams
      }
    };
    this.performRecordAction(navigation);
  }

  performRecordAction(action: ApplicationAction): void {
    console.log('ACTION start');
    const subscription = this.$stateTransitionComplete.subscribe(() => {
      subscription.unsubscribe();
      console.log('STATE finish');
      action.target = uuid();
      this.history.recordAction(action, this.getCurrentState(action.target));
    });
  }

  private updateQueryParameters(queryParams: Params): void {
    console.log('update query parameters');
    const changes: any[] = [];
    Object.keys(this.parameters).forEach(key => {
      const value = Encoder.decode(queryParams[key]);
      if (value !== this.getParameter(key)) {
        this.setParameter(key, value, {emitEvent: false});
        changes.push(key);
      }
    });
    if (changes.length > 0) {
      this.recordRevert(queryParams);
      this.onQueryParametersChange(changes);
    }
  }

  protected setQueryParam(key: string, value: any): void {
    this.navigationQueue.push([key, Encoder.encode(value)]);
    if (this.navigationQueue.length === 1) {
      this.setNextQueryParam();
    }
  }

  private setNextQueryParam(): void {
    const val = this.navigationQueue[0];
    this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: {[val[0]]: val[1]},
          queryParamsHandling: 'merge',
        }).then(() => {
      this.navigationQueue.shift();
      if (this.navigationQueue.length > 0) {
        this.setNextQueryParam();
      }
    });
  }

  private getCurrentState(stateId: string): ApplicationState {
    return {
      id: stateId,
      component: this.view,
      preview: this.getPreview(),
      parameters: this.getParameterValues()
    };
  }

  private filteredQueryParams(queryParams: { [key: string]: string }): { [key: string]: string } {
    const filtered = {};
    Object.keys(queryParams).filter(key => !this.excludedQueryParams.includes(key)).forEach(key => {
      filtered[key] = queryParams[key];
    });
    return filtered;
  }

  private getParameterValues(): any {
    const state = {};
    Object.keys(this.parameters).forEach(key => {
      state[key] = this.parameters[key].change.value;
    });
    return state;
  }

}
