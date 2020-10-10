import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Chart } from 'chart.js';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  public data = []

  private svg;
  private margin = 30;
  private width = 350;
  private height = 350;
    // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors;

  public dataSource = {
    datasets: [
        {
            data: [],
            backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
                '#800080',
                '#000080',
                '#00FFFF',
                '#008000'
            ],
        }
    ],
    labels: []
};


  // tslint:disable-next-line: variable-name
  constructor(private http: HttpClient, public _dataService: DataService) { }

  ngOnInit(): void {
    if (this._dataService.dataSource.length > 0){
      this.data = this._dataService.dataSource;

      for (let i = 0; i < this._dataService.dataSource.length; i++) {
        this.dataSource.datasets[0].data[i] = this._dataService.dataSource[i].budget;
        this.dataSource.labels[i] = this._dataService.dataSource[i].title;

      }
      this.createChart();
      this.createSvg();
      this.createColors();
      this.drawChart();
    } else {
    this._dataService.getTestData().subscribe((data: any) => {
      this.data = data;
      for (let i = 0; i < data.length; i++) {
        this.dataSource.datasets[0].data[i] = data[i].budget;
        this.dataSource.labels[i] = data[i].title;

      }
      this.createChart();
      this.createSvg();
      this.createColors();
      this.drawChart();

    });
  }

}
  createChart() {
    var ctx : any = document.getElementById("myChart")
    var myPieChart = new Chart(ctx,{
        type: 'pie',
        data : this.dataSource
    });
  }



private createSvg(): void {
  this.svg = d3.select("#pie")
  .append("svg")
  .attr("width", this.width)
  .attr("height", this.height)
  .append("g")
  .attr(
    "transform",
    "translate(" + this.width / 2 + "," + this.height / 2 + ")"
  );
}
private createColors(): void {
  this.colors = d3.scaleOrdinal()
  .domain(this.data.map(d => d.budget.toString()))
  .range(["#ffcd56", "#ff6384","#36a2eb", "#fd6b19","#fdfd19", "#189c40", "#04350c", "#652e7a"]);
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
    .innerRadius(60)
    .outerRadius(this.radius)
  )
  .attr('fill', (d, i) => (this.colors(i)))
  .attr("stroke", "#121926")
  .style("stroke-width", "1px");

  // Add labels
  const labelLocation = d3.arc()
  .innerRadius(30)
  .outerRadius(this.radius);

  this.svg
  .selectAll('pieces')
  .data(pie(this.data))
  .enter()
  .append('text')
  .text(d => d.data.title)
  .attr("transform", d => "translate(" + labelLocation.centroid(d) + ")")
  .style("text-anchor", "middle")
  .style("font-size", 15);
}

}
