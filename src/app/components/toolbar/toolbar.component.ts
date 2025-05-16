import { Component } from '@angular/core';
import { ShapeService } from '../../core/services/shape.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  constructor(private shapeService: ShapeService) {}

  addRectangle() {
    this.shapeService.addRectangle({
      x: 100,
      y: 100,
      width: 100,
      height: 80,
      rx: 10,
      fill: '#3498db',
      stroke: '#2c3e50',
      strokeWidth: 2
    });
  }

  addStar() {
    this.shapeService.addStar({
      x: 300,
      y: 200,
      outerRadius: 50,
      innerRadius: 25,
      points: 5,
      fill: '#f1c40f',
      stroke: '#d35400',
      strokeWidth: 2
    });
  }
}