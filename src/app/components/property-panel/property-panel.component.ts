import { Component } from '@angular/core';
import { RectangleShape, StarShape } from '../../shared/models/base-shape.model';
import { Subscription } from 'rxjs';
import { ShapeService } from '../../core/services/shape.service';

@Component({
  selector: 'app-property-panel',
  templateUrl: './property-panel.component.html',
  styleUrl: './property-panel.component.scss'
})
export class PropertyPanelComponent {
  selectedRect: RectangleShape | null = null;
  selectedStar: StarShape | null = null;
  private sub: Subscription | null = null;

 constructor(private shapeService: ShapeService) {}

  ngOnInit(): void {
    this.sub = this.shapeService.selectedShape$.subscribe(shape => {
      this.selectedRect = shape?.type === 'rectangle' ? shape as RectangleShape : null;
      this.selectedStar = shape?.type === 'star' ? shape as StarShape : null;
    });
  }

    updateRectangle(update: Partial<RectangleShape>): void {
    if (!this.selectedRect) return;
    const updated = { ...this.selectedRect, ...update };
    this.shapeService.updateShape(updated);
    this.shapeService.selectShape(updated);
  }

    updateStar(update: Partial<StarShape>): void {
    if (!this.selectedStar) return;
    const updated = { ...this.selectedStar, ...update };
    this.shapeService.updateShape(updated);
    this.shapeService.selectShape(updated);
  }

getInputValue(event: Event): string;
getInputValue(event: Event, asNumber: true): number;
getInputValue(event: Event, asNumber = false): string | number {
  const target = event.target as HTMLInputElement;
  return asNumber ? target.valueAsNumber : target.value;
}


updateVisualProp(prop: 'fill' | 'stroke', value: string): void;
updateVisualProp(prop: 'strokeWidth', value: number): void;
updateVisualProp(prop: 'fill' | 'stroke' | 'strokeWidth', value: string | number): void {
  const current = this.selectedRect ?? this.selectedStar;
  if (!current) return;

  const updated = { ...current, [prop]: value };
  this.shapeService.updateShape(updated);
  this.shapeService.selectShape(updated);
}

removeSelectedShape(): void {
  const shapeToRemove = this.selectedRect || this.selectedStar;
  if (!shapeToRemove) return;

  this.shapeService.removeShape(shapeToRemove.id);
  this.selectedRect = null;
  this.selectedStar = null;
}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }


}
