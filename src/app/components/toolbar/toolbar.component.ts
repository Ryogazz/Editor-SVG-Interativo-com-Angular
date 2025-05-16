import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ShapeService } from '../../core/services/shape.service';
import { ShapeType } from '../../shared/models/shape-type.enum';
import { RectangleShape } from '../../shared/models/rectangle-shape.model';
import { StarShape } from '../../shared/models/star-shape.model';

@Component({
  selector: 'app-toolbar',
  imports: [],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
constructor(private shapeService: ShapeService) {}

  addRectangle() {
    const rect: RectangleShape = {
      id: uuidv4(),
      type: ShapeType.Rectangle,
      x: 100,
      y: 100,
      width: 100,
      height: 80,
      rx: 10,
      fill: '#3498db',
      stroke: '#2c3e50',
      strokeWidth: 2
    };
    this.shapeService.addShape(rect);
  }

   addStar() {
    const star: StarShape = {
      id: uuidv4(),
      type: ShapeType.Star,
      x: 300,
      y: 200,
      points: 5,
      outerRadius: 50,
      innerRadius: 25,
      fill: '#f1c40f',
      stroke: '#d35400',
      strokeWidth: 2
    };
    this.shapeService.addShape(star);
  }

}
