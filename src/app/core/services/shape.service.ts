import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RectangleShape, Shape, StarShape } from '../../shared/models/base-shape.model';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  private shapesSubject = new BehaviorSubject<Shape[]>([]);
  shapes$ = this.shapesSubject.asObservable();

  private selectedShapeSubject = new BehaviorSubject<Shape | null>(null);
  selectedShape$ = this.selectedShapeSubject.asObservable();

  addShape(shape: Shape) {
    const shapes = this.shapesSubject.value;
    this.shapesSubject.next([...shapes, shape]);
  }

  updateShape(updated: Shape) {
    const updatedList = this.shapesSubject.value.map(s =>
      s.id === updated.id ? updated : s
    );
    this.shapesSubject.next(updatedList);
  }

  selectShape(shape: Shape | null) {
    this.selectedShapeSubject.next(shape);
  }

  getShapesSnapshot(): Shape[] {
    return this.shapesSubject.value;
  }

  addRectangle(shape: Omit<RectangleShape, 'id' | 'type'>) {
    const newShape: RectangleShape = {
      ...shape,
      id: this.generateId(),
      type: 'rectangle'
    };
    this.addShape(newShape);
  }

  addStar(shape: Omit<StarShape, 'id' | 'type'>) {
    const newShape: StarShape = {
      ...shape,
      id: this.generateId(),
      type: 'star'
    };
    this.addShape(newShape);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }


removeShape(shapeId: string): void {
  const updatedShapes = this.shapesSubject.value.filter(shape => shape.id !== shapeId);
  this.shapesSubject.next(updatedShapes);
  this.selectedShapeSubject.next(null); 
}



}