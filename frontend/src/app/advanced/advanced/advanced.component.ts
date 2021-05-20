import {Component, ElementRef, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as util from 'zrender/lib/core/util';
import {TrackedComponent} from '../../../../projects/core/src/examples/angular/tracked.component';
import {Gideon} from '../../../../projects/core/src/lib/gideon';

const SymbolSize = 20;
const Data = [
  [15, 0],
  [-50, 10],
  [-56.5, 20],
  [-46.5, 30],
  [-22.1, 40]
];

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.less']
})
export class AdvancedComponent extends TrackedComponent implements OnDestroy {

  updatePosition: () => void;
  options = {
    title: {
      left: 'center',
      text: 'Advanced Example',
      subtext: 'Hover and drag data'
    },
    tooltip: {
      triggerOn: 'none',
      formatter: (params) =>
        'X: ' + params.data[0].toFixed(2) + '<br>Y: ' + params.data[1].toFixed(2)
    },
    xAxis: {
      min: -100,
      max: 80,
      type: 'value',
      axisLine: {onZero: false}
    },
    yAxis: {
      min: -30,
      max: 60,
      type: 'value',
      axisLine: {onZero: false}
    },
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'empty'
      },
      {
        type: 'slider',
        yAxisIndex: 0,
        filterMode: 'empty'
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      },
      {
        type: 'inside',
        yAxisIndex: 0,
        filterMode: 'empty'
      }
    ],
    series: [
      {
        id: 'a',
        type: 'line',
        smooth: true,
        symbolSize: SymbolSize,
        data: Data
      }
    ]
  };

  constructor(elementRef: ElementRef, route: ActivatedRoute) {
    super(Gideon.getInstance(), elementRef, route);
  }

  ngOnDestroy(): void {
    if (this.updatePosition) {
      window.removeEventListener('resize', this.updatePosition);
    }
  }

  onChartReady(myChart: any): void {
    const onPointDragging = function(dataIndex) {
      Data[dataIndex] = myChart.convertFromPixel({ gridIndex: 0 }, this.position) as number[];

      // Update data
      myChart.setOption({
        series: [
          {
            id: 'a',
            data: Data
          }
        ]
      });
    };

    const showTooltip = (dataIndex) => {
      myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex
      });
    };

    const hideTooltip = () => {
      myChart.dispatchAction({
        type: 'hideTip'
      });
    };

    const updatePosition = () => {
      myChart.setOption({
        graphic: util.map(Data, (item) => ({
          position: myChart.convertToPixel({gridIndex: 0}, item)
        }))
      });
    };

    window.addEventListener('resize', updatePosition);
    myChart.on('dataZoom', updatePosition);

    // save handler and remove it on destroy
    this.updatePosition = updatePosition;

    setTimeout(() => {
      myChart.setOption({
        graphic: util.map(Data, (item, dataIndex) => {
          return {
            type: 'circle',
            position: myChart.convertToPixel({ gridIndex: 0 }, item),
            shape: {
              cx: 0,
              cy: 0,
              r: SymbolSize / 2
            },
            invisible: true,
            draggable: true,
            ondrag: util.curry<(dataIndex: any) => void, number>(onPointDragging, dataIndex),
            onmousemove: util.curry<(dataIndex: any) => void, number>(showTooltip, dataIndex),
            onmouseout: util.curry<(dataIndex: any) => void, number>(hideTooltip, dataIndex),
            z: 100
          };
        })
      });
    }, 0);
  }

}
