import { Component } from '@angular/core';
import { Shape, RectangleShape, StarShape, BaseShape } from '../../shared/models/base-shape.model';
import { ShapeService } from '../../core/services/shape.service';

@Component({
  selector: 'app-canvas',
  imports: [],
   standalone: true,
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent {

  shapes: Shape[] = [];

  constructor(private shapeService: ShapeService) {}

    isRectangle(shape: Shape): shape is RectangleShape {
    return shape.type === 'rectangle';
  }

  // Type guard para Star
  isStar(shape: Shape): shape is StarShape {
    return shape.type === 'star';
  }

  ngOnInit(): void {
this.shapeService.shapes$.subscribe(shapes => {
      this.shapes = shapes;
    });
  }

  onShapeClick(shape: Shape) {
    this.shapeService.selectShape(shape);
  }

  generateStarPath(cx: number, cy: number, outerR: number, innerR: number, numPoints: number): string {
    const step = Math.PI / numPoints;
    let path = '';

    for (let i = 0; i < 2 * numPoints; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const x = cx + r * Math.cos(i * step);
      const y = cy + r * Math.sin(i * step);
      path += i === 0 ? `M ${x},${y}` : ` L ${x},${y}`;
    }

    return path + ' Z';
  }

}
