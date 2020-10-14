import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { DataService } from '../data.service';
import * as d3 from 'd3';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {
  private data = [];

  private svg;
  private margin = 50;
  private width = 350;
  private height = 350;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors;

  public dataSource = {
    datasets : [
      {
       data: [],
       backgroundColor: [
       'rgba(255, 99, 132, 0.5)',
       'rgba(54, 162, 0, 0.8)',
       'rgba(0, 255, 230, 0.2)',
       'rgba(22, 256, 192, 0.7)',
       'rgba(153, 102, 255, 0.5)',
       'rgba(0, 159, 64, 0.2)',
       'rgba(33, 159, 64, 0.3)',
       'rgba(55, 99, 255, 0.2)',
       'rgba(244, 244, 0, 0.7)',
       ],
      },
  ],
  labels: [],
  options: { events: [] }
  };

  constructor(private http: HttpClient, public dataService: DataService) { }

  ngAfterViewInit(): void {
    this.dataService.getData()
    .subscribe((res: any) => {
      this.data = res.myBudget;
      for (let i = 0; i < res.myBudget.length; i++) {
       this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
       this.dataSource.labels[i] = res.myBudget[i].title;
      }
      this.createChart();
      this.createSvg();
      this.createColors();
      this.drawChart();
    });
}

  // tslint:disable-next-line: typedef
  createChart() {

    let ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');

    const myPieChart = new Chart(ctx, {
      type: 'pie',
        data: this.dataSource
    });
}

private createSvg(): void {
  this.svg = d3.select('#pie')
  .append('svg')
  .attr('width', this.width)
  .attr('height', this.height)
  .append('g')
  .attr(
    'transform',
    'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
  );
}

private createColors(): void {
this.colors = d3.scaleOrdinal()
.domain(this.data.map(d => d.budget.toString()))
.range([ 'rgba(255, 99, 132, 0.5)',
'rgba(54, 162, 0, 0.8)',
'rgba(0, 255, 230, 0.2)',
'rgba(22, 256, 192, 0.7)',
'rgba(153, 102, 255, 0.5)',
'rgba(0, 159, 64, 0.2)',
'rgba(33, 159, 64, 0.3)',
'rgba(55, 99, 255, 0.2)',
'rgba(244, 244, 0, 0.7)']);
}

private drawChart(): void {
// Compute the position of each group on the pie:
const pie = d3.pie<any>().value((d: any) => Number(d.budget));

// Build the pie chart
this.svg
.selectAll('pieces')
.data(pie(this.data))
.enter()
.append('path')
.attr('d', d3.arc()
  .innerRadius(0)
  .outerRadius(this.radius)
)
.attr('fill', (d, i) => (this.colors(i)))
.attr('stroke', '#121926')
.style('stroke-width', '1px');

// Add labels
const labelLocation = d3.arc()
.innerRadius(100)
.outerRadius(this.radius);

this.svg
.selectAll('pieces')
.data(pie(this.data))
.enter()
.append('text')
.text(d => d.data.title)
.attr('transform', d => 'translate(' + labelLocation.centroid(d) + ')')
.style('text-anchor', 'middle')
.style('font-size', 15);
}


}
