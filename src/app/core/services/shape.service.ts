import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RectangleShape, Shape, StarShape } from '../../shared/models/base-shape.model';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  private readonly STORAGE_KEY = 'canvas_shapes_data';
  private shapesSubject = new BehaviorSubject<Shape[]>(this.loadInitialData());
  shapes$ = this.shapesSubject.asObservable();

  private selectedShapeSubject = new BehaviorSubject<Shape | null>(null);
  selectedShape$ = this.selectedShapeSubject.asObservable();

  constructor() {
    this.shapes$.subscribe(shapes => {
      this.saveToLocalStorage(shapes);
    });
  }

  private loadInitialData(): Shape[] {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
      console.error('Error loading shapes from localStorage', error);
      return [];
    }
  }

  private saveToLocalStorage(shapes: Shape[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(shapes));
  }

  addShape(shape: Shape): void {
    const shapes = [...this.shapesSubject.value, shape];
    this.shapesSubject.next(shapes);
  }

  updateShape(updated: Shape): void {
    const updatedList = this.shapesSubject.value.map(s =>
      s.id === updated.id ? updated : s
    );
    this.shapesSubject.next(updatedList);
  }

  selectShape(shape: Shape | null): void {
    this.selectedShapeSubject.next(shape);
  }

  getShapesSnapshot(): Shape[] {
    return this.shapesSubject.value;
  }

  addRectangle(shape: Omit<RectangleShape, 'id' | 'type'>): void {
    const newShape: RectangleShape = {
      ...shape,
      id: this.generateId(),
      type: 'rectangle'
    };
    this.addShape(newShape);
  }

  addStar(shape: Omit<StarShape, 'id' | 'type'>): void {
    const newShape: StarShape = {
      ...shape,
      id: this.generateId(),
      type: 'star'
    };
    this.addShape(newShape);
  }

  removeShape(shapeId: string): void {
    const updatedShapes = this.shapesSubject.value.filter(shape => shape.id !== shapeId);
    this.shapesSubject.next(updatedShapes);
    if (this.selectedShapeSubject.value?.id === shapeId) {
      this.selectedShapeSubject.next(null);
    }
  }

  clearAll(): void {
    this.shapesSubject.next([]);
    this.selectedShapeSubject.next(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}