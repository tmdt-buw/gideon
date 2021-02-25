import {Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ECharts, EChartsOption} from 'echarts';
import {ActionType, FilterChangeValue} from '../../model/action-type';
import {Encoder} from '../../model/encoder';
import {Parameter} from '../../model/parameter';
import {StatefulComponent} from '../../model/stateful.component';
import {HistoryService} from '../../service/history.service';
import {SelectionType} from './selection-type';


@Component({
  selector: 'gd-stateful-echarts-component',
  template: ''
})
export abstract class StatefulEchartsComponent extends StatefulComponent implements OnInit {

  @Input() excludedQueryParams = [];
  chartInstance: ECharts;
  config: EChartsOption;

  // variables for chart controls
  readonly xAxisZoomName = 'xAxisZoom';
  xAxisZoom = false;
  readonly yAxisZoomName = 'yAxisZoom';
  yAxisZoom = false;
  readonly selectionName = 'filter';
  allSelectionValues: string[] = [];
  selection = [false, false, false];

  @ViewChild('chartContainer') chartContainer;

  protected constructor(router: Router, route: ActivatedRoute, protected ngZone: NgZone, protected history: HistoryService) {
    super(router, route, history);
  }

  abstract get text(): string;

  get subtext(): string {
    const parameters = Object.keys(this.parameters).filter(key => this.parameters[key].type === ActionType.parameterChange && this.parameters[key].change.value);
    return parameters.length > 0 ? parameters.map(key => `${key}: ${this.getParameter(key)}`).join(' | ') : '';
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  setChart(chart): void {
    this.chartInstance = chart;
    // callbacks run outside angular zone => use ngzone manually to prevent errors while navigating with router
    this.chartInstance.on('finished', (event) => this.ngZone.run(() => this.$stateTransitionComplete.next()));
    this.chartInstance.on('legendselectall', (event) => this.ngZone.run(() => this.onLegendSelectionChange(event)));
    this.chartInstance.on('legendinverseselect', (event) => this.ngZone.run(() => this.onLegendSelectionChange(event)));
  }

  getPreview(): string {
    return this.chartInstance.getConnectedDataURL({
      backgroundColor: getComputedStyle(this.chartContainer.nativeElement).backgroundColor,
      type: 'png',
      pixelRatio: 0.33
    });
  }

  getBaseConfig(): EChartsOption {
    const config = {
      animation: false,
      title: {
        text: this.text,
        subtext: this.subtext,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'value',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      toolbox: {
        left: 0,
        feature: {
          saveAsImage: {
            title: 'Save as Image',
          }
        }
      },
      dataZoom: undefined,
      legend: undefined
    };
    if (this.xAxisZoom || this.yAxisZoom) {
      config.dataZoom = [];
      if (this.xAxisZoom) {
        config.dataZoom.push({
          id: 'x-slider',
          type: 'slider',
          start: this.getXAxisZoom()[0],
          end: this.getXAxisZoom()[1],
          xAxisIndex: 0
        });
      }
      if (this.yAxisZoom) {
        config.dataZoom.push({
          id: 'y-slider',
          type: 'slider',
          start: this.getYAxisZoom()[0],
          end: this.getYAxisZoom()[1],
          yAxisIndex: 0
        });
      }
    }
    if (this.selection[0]) {
      config.legend = {
        type: 'scroll',
        orient: 'vertical',
        right: 0,
        selectorLabel: {
          borderColor: 'transparent'
        },
        data: this.allSelectionValues,
        selector: []
      };
      if (this.selection[1]) {
        config.legend.selector.push({
          type: 'all',
          title: 'All'
        });
      }
      if (this.selection[2]) {
        config.legend.selector.push({
          type: 'inverse',
          title: 'Inverse'
        });
      }
    }
    // @ts-ignore echarts object not updated
    return config;
  }

  onChartClick(event): void {
    this.onLineClicked(event, this.chartInstance);
  }

  onLineClicked(event, chartInstance): void {
    /* const seriesName = event.seriesName;
     const selected = {};
     this.currentTimeseries.forEach((serie, i) => {
       const name = (i + 1).toString();
       selected[name] = name === seriesName;
     });
     chartInstance.setOption({legend: {selected}}); */
  }

  getXAxisZoom(): [number, number] {
    return this.getParameter(this.xAxisZoomName);
  }

  registerXAxisDataZoom(): void {
    this.registerParameter<[number, number]>(this.xAxisZoomName, [0, 100], ActionType.layoutChange);
    this.xAxisZoom = true;
  }

  getYAxisZoom(): [number, number] {
    return this.getParameter(this.yAxisZoomName);
  }

  registerYAxisDataZoom(): void {
    this.registerParameter<[number, number]>(this.yAxisZoomName, [0, 100], ActionType.layoutChange);
    this.yAxisZoom = true;
  }

  onDataZoom(event): void {
    const start = event.start;
    const end = event.end;
    const id: 'x-slider' | 'y-slider' = event.dataZoomId;
    if (id === 'x-slider') {
      const current: [number, number] = this.getXAxisZoom();
      if (start !== current[0] || end !== current[1]) {
        this.setParameter(this.xAxisZoomName, [start, end]);
      }
    }
    if (id === 'y-slider') {
      const current: [number, number] = this.getYAxisZoom();
      if (start !== current[0] || end !== current[1]) {
        this.setParameter(this.yAxisZoomName, [start, end]);
      }
    }
  }

  getSelection(): string[] {
    return this.getParameter(this.selectionName);
  }

  registerLegend(allValues: string[], all: boolean, inverse: boolean): void {
    this.allSelectionValues = allValues;
    let value = Encoder.decode(this.route.snapshot.queryParamMap.get(this.selectionName));
    if (!value || value.length < 1) {
      this.setQueryParam(this.selectionName, []);
      value = [];
    }
    this.parameters[this.selectionName] = new Parameter(this.selectionName, new FormControl(value), ActionType.filterChange);
    this.selection = [true, all, inverse];
  }

  onLegendSelectionChange(event): void {
    if (this.selection[0]) {
      let parameters: FilterChangeValue;
      const selection = event.selected;
      switch (event.type) {
        case 'legendselectchanged': {
          const value = event.name;
          if (selection[value]) {
            parameters = {
              removed: [value]
            };
          } else {
            parameters = {
              added: [value]
            };
          }
          break;
        }
        case 'legendselectall': {
          parameters = {
            // select all = remove all filters
            command: SelectionType.clear
          };
          break;
        }
        case 'legendinverseselect': {
          parameters = {
            command: SelectionType.inverse
          };
        }
      }
      const filter = Object.keys(selection).filter(key => !selection[key]);
      this.parameters[this.selectionName].change.setValue(filter);
      this.setQueryParam(this.selectionName, filter);
      this.performRecordAction({
        id: undefined,
        time: new Date().toISOString(),
        type: ActionType.filterChange,
        parameters
      });
      this.onQueryParametersChange([this.selectionName]);
      this.$stateTransitionComplete.next();
    }
  }

  onParameterChange(name: string): void {
    switch (name) {
      case this.yAxisZoomName:
      case this.xAxisZoomName: {
        // change to chart happens on interaction
        this.$stateTransitionComplete.next();
        break;
      }
    }
  }

  onQueryParametersChange(name: string[]): void {
    const config: EChartsOption = {};
    if (this.xAxisZoom && name.includes(this.xAxisZoomName) || this.yAxisZoom && name.includes(this.yAxisZoomName)) {
      config.dataZoom = [];
      if (this.xAxisZoom && name.includes(this.xAxisZoomName)) {
        config.dataZoom.push({
          id: 'x-slider',
          start: this.getXAxisZoom()[0],
          end: this.getXAxisZoom()[1],
        });
      }
      if (this.yAxisZoom && name.includes(this.yAxisZoomName)) {
        config.dataZoom.push({
          id: 'y-slider',
          start: this.getYAxisZoom()[0],
          end: this.getYAxisZoom()[1],
        });
      }
    }
    if (this.selection[0] && name.includes(this.selectionName)) {
      const selected = {};
      this.allSelectionValues.forEach(value => {
        selected[value] = !this.getSelection().includes(value);
      });
      config.legend = {
        selected
      };
    }
    this.chartInstance.setOption(config);
  }

  containsParameters(names: string[]): boolean {
    return names.some(name => Object.keys(this.parameters).filter(key => this.parameters[key].type === ActionType.parameterChange).map(key => this.parameters[key].name).includes(name));
  }
}
