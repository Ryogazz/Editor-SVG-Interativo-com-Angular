import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CanvasComponent } from './canvas.component';
import { ShapeService } from '../../core/services/shape.service';
import { RectangleShape, StarShape } from '../../shared/models/base-shape.model';
import { of } from 'rxjs';

describe('CanvasComponent', () => {
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;
  let shapeService: jasmine.SpyObj<ShapeService>;

  const mockRectangle: RectangleShape = {
    id: 'rect1',
    type: 'rectangle',
    x: 100,
    y: 100,
    width: 200,
    height: 150,
    rx: 5,
    fill: '#ff0000',
    stroke: '#000000',
    strokeWidth: 1,
    minWidth: 20,
    minHeight: 20
  };

  const mockStar: StarShape = {
    id: 'star1',
    type: 'star',
    x: 300,
    y: 300,
    outerRadius: 50,
    innerRadius: 25,
    points: 5,
    fill: '#00ff00',
    stroke: '#000000',
    strokeWidth: 1,
    minWidth: 10,
    minHeight: 10
  };

  beforeEach(async () => {
    const shapeServiceSpy = jasmine.createSpyObj('ShapeService', [
      'selectShape',
      'updateShape'
    ], {
      shapes$: of([mockRectangle, mockStar]),
      selectedShape$: of(null)
    });

    await TestBed.configureTestingModule({
      imports: [CanvasComponent], 
      providers: [
        { provide: ShapeService, useValue: shapeServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasComponent);
    component = fixture.componentInstance;
    shapeService = TestBed.inject(ShapeService) as jasmine.SpyObj<ShapeService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with shapes from service', () => {
    expect(component.shapes.length).toBe(2);
    expect(component.isRectangle(component.shapes[0])).toBeTrue();
    expect(component.isStar(component.shapes[1])).toBeTrue();
  });

  describe('SVG Dimensions', () => {
    it('should update SVG dimensions on init', () => {
      expect(component.svgRect).toBeTruthy();
    });

    it('should update dimensions on window resize', () => {
      const initialRect = component.svgRect;
      window.dispatchEvent(new Event('resize'));
      expect(component.svgRect).not.toBe(initialRect);
    });
  });

  describe('Shape Interaction', () => {
    it('should select shape on click', () => {
      const event = new MouseEvent('click');
      component.onShapeClick(mockRectangle, event);
      expect(shapeService.selectShape).toHaveBeenCalledWith(mockRectangle);
    });

    it('should clear selection', () => {
      component.clearSelection();
      expect(shapeService.selectShape).toHaveBeenCalledWith(null);
    });
  });

  describe('Drag Functionality', () => {
    it('should start drag operation', () => {
      const event = new MouseEvent('mousedown');
      component.startDrag(mockRectangle, event);
      
      expect(component.isDragging).toBeTrue();
      expect(component.dragOffset).toEqual({
        x: jasmine.any(Number),
        y: jasmine.any(Number)
      });
    });

    it('should move shape during drag', () => {
      component.selectedShape = mockRectangle;
      component.isDragging = true;
      component.dragOffset = { x: 10, y: 10 };
      
      const moveEvent = new MouseEvent('mousemove', { clientX: 150, clientY: 150 });
      component.onMove(moveEvent);
      
      expect(shapeService.updateShape).toHaveBeenCalled();
      const updatedShape = shapeService.updateShape.calls.mostRecent().args[0];
      expect(updatedShape.x).toBe(140); 
      expect(updatedShape.y).toBe(140);
    });

    it('should stop drag operation', () => {
      component.isDragging = true;
      component.stopDrag();
      expect(component.isDragging).toBeFalse();
    });
  });

  describe('Resize Functionality', () => {
    it('should start resize operation', () => {
      const event = new MouseEvent('mousedown', { shiftKey: true });
      component.startResize(mockRectangle, 'se', event);
      
      expect(component.isResizing).toBeTrue();
      expect(component.activeHandle).toBe('se');
      expect(component.maintainAspectRatio).toBeTrue();
      expect(component.startDimensions).toEqual({
        width: mockRectangle.width,
        height: mockRectangle.height,
        x: mockRectangle.x,
        y: mockRectangle.y
      });
    });

    it('should resize rectangle from SE handle', () => {
      component.selectedShape = mockRectangle;
      component.startResize(mockRectangle, 'se', new MouseEvent('mousedown'));
      
      const resizeEvent = new MouseEvent('mousemove', { clientX: 350, clientY: 350 });
      component.handleResize(resizeEvent);
      
      expect(shapeService.updateShape).toHaveBeenCalled();
      const updatedShape = shapeService.updateShape.calls.mostRecent().args[0] as RectangleShape;
      expect(updatedShape.width).toBeGreaterThan(mockRectangle.width);
      expect(updatedShape.height).toBeGreaterThan(mockRectangle.height);
    });

    it('should resize star proportionally', () => {
      component.selectedShape = mockStar;
      component.startResize(mockStar, 'se', new MouseEvent('mousedown', { shiftKey: true }));
      
      const resizeEvent = new MouseEvent('mousemove', { clientX: 400, clientY: 400 });
      component.handleResize(resizeEvent);
      
      const updatedShape = shapeService.updateShape.calls.mostRecent().args[0] as StarShape;
      const originalRatio = mockStar.innerRadius / mockStar.outerRadius;
      const newRatio = updatedShape.innerRadius / updatedShape.outerRadius;
      expect(newRatio).toBeCloseTo(originalRatio);
    });

    it('should end resize operation', () => {
      component.isResizing = true;
      component.endResize();
      expect(component.isResizing).toBeFalse();
      expect(component.activeHandle).toBeNull();
    });
  });

  describe('Helper Methods', () => {
    it('should generate star path correctly', () => {
      const path = component.generateStarPath(100, 100, 50, 25, 5);
      expect(path).toContain('M 150,100'); 
      expect(path).toContain('Z');
    });

    it('should get rectangle handles', () => {
      const handles = component.getRectangleHandles(mockRectangle);
      expect(handles.length).toBe(4);
      expect(handles).toContain(jasmine.objectContaining({
        position: 'se',
        x: mockRectangle.x + mockRectangle.width,
        y: mockRectangle.y + mockRectangle.height
      }));
    });

    it('should get star handles', () => {
      const handles = component.getStarHandles(mockStar);
      expect(handles.length).toBe(2);
      expect(handles[0].position).toBe('nw');
    });
  });

  describe('Touch Support', () => {
    it('should handle touch events for drag', () => {
      const touchEvent = new TouchEvent('touchstart', {
        touches: [new Touch({ identifier: 1, target: document.createElement('div'), clientX: 100, clientY: 100 })]
      });
      
      component.startDrag(mockRectangle, touchEvent);
      expect(component.isDragging).toBeTrue();
    });
  });
});