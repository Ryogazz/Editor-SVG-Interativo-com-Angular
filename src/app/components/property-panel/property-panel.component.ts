import { Component } from '@angular/core';
import { RectangleShape } from '../../shared/models/base-shape.model';
import { Subscription } from 'rxjs';
import { ShapeService } from '../../core/services/shape.service';

@Component({
  selector: 'app-property-panel',
  templateUrl: './property-panel.component.html',
  styleUrl: './property-panel.component.scss'
})
export class PropertyPanelComponent {
  selectedRect: RectangleShape | null = null;
  private sub: Subscription | null = null;

 constructor(private shapeService: ShapeService) {}

  ngOnInit(): void {
    this.sub = this.shapeService.selectedShape$.subscribe(shape => {
      this.selectedRect = shape?.type === 'rectangle' ? shape as RectangleShape : null;
    });
  }

  onRxChange(value: number) {
    if (!this.selectedRect) return;
    const updated: RectangleShape = {
      ...this.selectedRect,
      rx: value
    };
    this.shapeService.updateShape(updated);
    this.shapeService.selectShape(updated); 
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  getInputValue(event: Event): number {
  return (event.target as HTMLInputElement).valueAsNumber;
}
}
