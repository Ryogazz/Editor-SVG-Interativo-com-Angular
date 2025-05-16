import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseShape } from '../../shared/models/base-shape.model';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  private shapesSubject = new BehaviorSubject<BaseShape[]>([]);
  shapes$ = this.shapesSubject.asObservable();

  private selectedShapeSubject = new BehaviorSubject<BaseShape | null>(null);
  selectedShape$ = this.selectedShapeSubject.asObservable();

  addShape(shape: BaseShape) {
    const shapes = this.shapesSubject.value;
    this.shapesSubject.next([...shapes, shape]);
  }

  updateShape(updated: BaseShape) {
    const updatedList = this.shapesSubject.value.map(s =>
      s.id === updated.id ? updated : s
    );
    this.shapesSubject.next(updatedList);
  }

  selectShape(shape: BaseShape | null) {
    this.selectedShapeSubject.next(shape);
  }

  getShapesSnapshot(): BaseShape[] {
    return this.shapesSubject.value;
  }
}
