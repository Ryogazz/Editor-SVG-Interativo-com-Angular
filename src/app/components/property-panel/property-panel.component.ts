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

     getInputValue(event: Event): number {
  return (event.target as HTMLInputElement).valueAsNumber;
}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }


}
