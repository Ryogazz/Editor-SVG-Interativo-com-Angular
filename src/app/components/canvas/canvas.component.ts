import { Component, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Shape, RectangleShape, StarShape } from '../../shared/models/base-shape.model';
import { ShapeService } from '../../core/services/shape.service';

@Component({
  selector: 'app-canvas',
  standalone: true,
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvasSvg') canvasSvg!: ElementRef<SVGSVGElement>;
  
  shapes: Shape[] = [];
  isDragging = false;
  selectedShape: Shape | null = null;
  dragOffset = { x: 0, y: 0 };
  svgRect: DOMRect | null = null;

    isResizing = false;
  activeHandle: string | null = null;
  startDimensions: { width: number; height: number; x: number; y: number } = { width: 0, height: 0, x: 0, y: 0 };
  startMousePos = { x: 0, y: 0 };
  maintainAspectRatio = false;

  constructor(private shapeService: ShapeService) {}

  ngAfterViewInit(): void {
    this.updateSvgDimensions();
  }

  private updateSvgDimensions(): void {
    this.svgRect = this.canvasSvg.nativeElement.getBoundingClientRect();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateSvgDimensions();
  }

  ngOnInit(): void {
    this.shapeService.shapes$.subscribe(shapes => {
      this.shapes = shapes;
    });

    this.shapeService.selectedShape$.subscribe(shape => {
      this.selectedShape = shape;
    });
  }

  isRectangle(shape: Shape): shape is RectangleShape {
    return shape.type === 'rectangle';
  }

  isStar(shape: Shape): shape is StarShape {
    return shape.type === 'star';
  }

  startDrag(shape: Shape, event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    this.isDragging = true;
    
    this.updateSvgDimensions();
    
    if (shape !== this.selectedShape) {
      this.shapeService.selectShape(shape);
    }
    
    const clientX = this.getClientX(event);
    const clientY = this.getClientY(event);
    
    this.dragOffset = {
      x: clientX - shape.x,
      y: clientY - shape.y
    };

    document.body.classList.add('grabbing-cursor');
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging || !this.selectedShape || !this.svgRect) return;

    const clientX = this.getClientX(event);
    const clientY = this.getClientY(event);
    
    let newX = clientX - this.dragOffset.x;
    let newY = clientY - this.dragOffset.y;

    if (this.isRectangle(this.selectedShape)) {
      newX = Math.max(0, Math.min(newX, this.svgRect.width - this.selectedShape.width));
      newY = Math.max(0, Math.min(newY, this.svgRect.height - this.selectedShape.height));
    }
    else if (this.isStar(this.selectedShape)) {
      const padding = this.selectedShape.outerRadius * 2;
      newX = Math.max(padding - this.selectedShape.outerRadius, 
                     Math.min(newX, this.svgRect.width - this.selectedShape.outerRadius));
      newY = Math.max(padding - this.selectedShape.outerRadius, 
                     Math.min(newY, this.svgRect.height - this.selectedShape.outerRadius));
    }

    const updatedShape = {
      ...this.selectedShape,
      x: newX,
      y: newY
    };

    this.shapeService.updateShape(updatedShape);
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  stopDrag(): void {
    if (this.isDragging) {
      this.isDragging = false;
      document.body.classList.remove('grabbing-cursor');
    }
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  }

  private getClientY(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
  }

  onShapeClick(shape: Shape, event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) {
      this.shapeService.selectShape(shape);
      event.stopPropagation();
    }
  }

  clearSelection(): void {
    this.shapeService.selectShape(null);
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

   getRectangleHandles(shape: RectangleShape) {
    const handles = [
      { position: 'nw', x: shape.x, y: shape.y },
      { position: 'ne', x: shape.x + shape.width, y: shape.y },
      { position: 'sw', x: shape.x, y: shape.y + shape.height },
      { position: 'se', x: shape.x + shape.width, y: shape.y + shape.height }
    ];
    return handles;
  }

  getStarHandles(shape: StarShape) {
    const handles = [
      { position: 'nw', x: shape.x - shape.outerRadius, y: shape.y - shape.outerRadius },
      { position: 'se', x: shape.x + shape.outerRadius, y: shape.y + shape.outerRadius }
    ];
    return handles;
  }

  startResize(shape: Shape, handlePosition: string, event: MouseEvent | TouchEvent) {
    event.stopPropagation();
    this.isResizing = true;
    this.activeHandle = handlePosition;
    this.maintainAspectRatio = event.shiftKey; 

  
    const clientX = this.getClientX(event);
    const clientY = this.getClientY(event);
    this.startMousePos = { x: clientX, y: clientY };

    
    if (this.isRectangle(shape)) {
      this.startDimensions = {
        width: shape.width,
        height: shape.height,
        x: shape.x,
        y: shape.y
      };
    } else if (this.isStar(shape)) {
      this.startDimensions = {
        width: shape.outerRadius * 2,
        height: shape.outerRadius * 2,
        x: shape.x,
        y: shape.y
      };
    }
  }

  handleResize(event: MouseEvent | TouchEvent) {
    if (!this.isResizing || !this.selectedShape || !this.svgRect) return;

    const clientX = this.getClientX(event);
    const clientY = this.getClientY(event);
    const deltaX = clientX - this.startMousePos.x;
    const deltaY = clientY - this.startMousePos.y;

    if (this.isRectangle(this.selectedShape)) {
      this.resizeRectangle(deltaX, deltaY);
    } else if (this.isStar(this.selectedShape)) {
      this.resizeStar(deltaX, deltaY);
    }
  }

  private resizeRectangle(deltaX: number, deltaY: number) {
    const shape = this.selectedShape as RectangleShape;
    const minWidth = shape.minWidth || 20;
    const minHeight = shape.minHeight || 20;
    
    let { width, height, x, y } = this.startDimensions;

    switch (this.activeHandle) {
      case 'nw':
        width = Math.max(minWidth, width - deltaX);
        height = this.maintainAspectRatio ? width * (this.startDimensions.height / this.startDimensions.width) : 
                 Math.max(minHeight, height - deltaY);
        x = this.startDimensions.x + (this.startDimensions.width - width);
        y = this.startDimensions.y + (this.startDimensions.height - height);
        break;
      case 'ne':
        width = Math.max(minWidth, width + deltaX);
        height = this.maintainAspectRatio ? width * (this.startDimensions.height / this.startDimensions.width) : 
                 Math.max(minHeight, height - deltaY);
        y = this.startDimensions.y + (this.startDimensions.height - height);
        break;
      case 'sw':
        width = Math.max(minWidth, width - deltaX);
        height = this.maintainAspectRatio ? width * (this.startDimensions.height / this.startDimensions.width) : 
                 Math.max(minHeight, height + deltaY);
        x = this.startDimensions.x + (this.startDimensions.width - width);
        break;
      case 'se':
        width = Math.max(minWidth, width + deltaX);
        height = this.maintainAspectRatio ? width * (this.startDimensions.height / this.startDimensions.width) : 
                 Math.max(minHeight, height + deltaY);
        break;
    }


    const updatedShape: RectangleShape = {
      ...shape,
      x,
      y,
      width,
      height
    };

    this.shapeService.updateShape(updatedShape);
  }

  private resizeStar(deltaX: number, deltaY: number) {
    const shape = this.selectedShape as StarShape;
    const minSize = shape.minWidth || shape.outerRadius * 0.5;
    
    let newOuterRadius = this.startDimensions.width / 2;

    switch (this.activeHandle) {
      case 'nw':
        newOuterRadius = Math.max(minSize, (this.startDimensions.width - deltaX - deltaY) / 2);
        break;
      case 'se':
        newOuterRadius = Math.max(minSize, (this.startDimensions.width + deltaX + deltaY) / 2);
        break;
    }


    const ratio = shape.innerRadius / shape.outerRadius;
    const newInnerRadius = newOuterRadius * ratio;

    const updatedShape: StarShape = {
      ...shape,
      outerRadius: newOuterRadius,
      innerRadius: newInnerRadius
    };

    this.shapeService.updateShape(updatedShape);
  }

  endResize() {
    this.isResizing = false;
    this.activeHandle = null;
  }

}