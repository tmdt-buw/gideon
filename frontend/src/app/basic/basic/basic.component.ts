import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {connect, getInstanceByDom} from 'echarts';
import {TrackedComponent} from '../../../../projects/core/src/examples/angular/tracked.component';
import {Gideon} from '../../../../projects/core/src/lib/gideon';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.less']
})
export class BasicComponent extends TrackedComponent implements AfterViewInit {

  constructor(elementRef: ElementRef) {
    super(Gideon.getInstance(), elementRef);
  }

  options1 = {
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Counters',
        type: 'bar',
        barWidth: '60%',
        data: [10, 52, 200, 334, 390, 330, 220]
      }
    ]
  };

  options2 = {
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Counters',
        type: 'bar',
        barWidth: '60%',
        data: [23, 34, 175, 275, 355, 300, 215]
      }
    ]
  };

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    setTimeout(() => {
      const chartElement1 = document.getElementById('chart1');
      const chartElement2 = document.getElementById('chart2');
      const chart1 = getInstanceByDom(chartElement1);
      const chart2 = getInstanceByDom(chartElement2);
      connect([chart1, chart2]);
      chart1.on('click', (params) => {
        const data = [10, 52, 200, 334, 390, 330, 220].map((value, index) => {
          if (params.dataIndex === index) {
            return {
              value,
              itemStyle: {
                color: '#a90000'
              }
            };
          } else {
            return value;
          }
        });
        chart1.setOption({
          series: [
            {
              name: 'Counters',
              type: 'bar',
              barWidth: '60%',
              data
            }
          ]
        });
      });
    });
  }


}
