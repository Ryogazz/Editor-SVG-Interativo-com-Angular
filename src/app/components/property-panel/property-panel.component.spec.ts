import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PropertyPanelComponent } from './property-panel.component';
import { ShapeService } from '../../core/services/shape.service';
import { RectangleShape, StarShape } from '../../shared/models/base-shape.model';
import { BehaviorSubject } from 'rxjs';

describe('PropertyPanelComponent', () => {
  let component: PropertyPanelComponent;
  let fixture: ComponentFixture<PropertyPanelComponent>;
  let shapeService: jasmine.SpyObj<ShapeService>;
  let selectedShapeSubject: BehaviorSubject<any>;

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
    strokeWidth: 2,
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
    selectedShapeSubject = new BehaviorSubject(null);

    const shapeServiceSpy = jasmine.createSpyObj('ShapeService', [
      'selectShape',
      'updateShape',
      'removeShape'
    ]);

    Object.defineProperty(shapeServiceSpy, 'selectedShape$', {
      get: () => selectedShapeSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [PropertyPanelComponent],
      providers: [
        { provide: ShapeService, useValue: shapeServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyPanelComponent);
    component = fixture.componentInstance;
    shapeService = TestBed.inject(ShapeService) as jasmine.SpyObj<ShapeService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should subscribe to selectedShape$ on init', () => {
      expect(component['sub']).toBeDefined();
      expect(component.selectedRect).toBeNull();
      expect(component.selectedStar).toBeNull();
    });

    it('should handle rectangle selection', fakeAsync(() => {
      selectedShapeSubject.next(mockRectangle);
      tick();
      expect(component.selectedRect).toEqual(mockRectangle);
      expect(component.selectedStar).toBeNull();
    }));

    it('should handle star selection', fakeAsync(() => {
      selectedShapeSubject.next(mockStar);
      tick();
      expect(component.selectedStar).toEqual(mockStar);
      expect(component.selectedRect).toBeNull();
    }));
  });

  describe('Shape Updates', () => {
    beforeEach(() => {
      component['selectedRect'] = mockRectangle;
      component['selectedStar'] = mockStar;
    });

    it('should update rectangle properties', () => {
      const update = { width: 250, height: 175 };
      component.updateRectangle(update);
      expect(shapeService.updateShape).toHaveBeenCalledWith({
        ...mockRectangle,
        ...update
      });
      expect(shapeService.selectShape).toHaveBeenCalled();
    });

    it('should update star properties', () => {
      const update = { outerRadius: 60, points: 6 };
      component.updateStar(update);
      expect(shapeService.updateShape).toHaveBeenCalledWith({
        ...mockStar,
        ...update
      });
      expect(shapeService.selectShape).toHaveBeenCalled();
    });

    it('should not update when no shape is selected', () => {
      component['selectedRect'] = null;
      component['selectedStar'] = null;
      component.updateRectangle({ width: 300 });
      component.updateStar({ outerRadius: 70 });
      expect(shapeService.updateShape).not.toHaveBeenCalled();
    });
  });

  describe('Visual Properties', () => {
    beforeEach(() => {
      component['selectedRect'] = mockRectangle;
      component['selectedStar'] = mockStar;
    });

    it('should update stroke color for star', () => {
      component['selectedRect'] = null;
      component.updateVisualProp('stroke', '#ff0000');
      expect(shapeService.updateShape).toHaveBeenCalledWith({
        ...mockStar,
        stroke: '#ff0000'
      });
    });

    it('should update stroke color for rectangle', () => {
      component['selectedStar'] = null;
      component.updateVisualProp('stroke', '#0000ff');
      expect(shapeService.updateShape).toHaveBeenCalledWith({
        ...mockRectangle,
        stroke: '#0000ff'
      });
    });
  });

  describe('Input Handling', () => {
    it('should get string value from input', () => {
      const event = {
        target: {
          value: 'test value'
        }
      } as unknown as Event;
      const result = component.getInputValue(event);
      expect(result).toBe('test value');
    });

    it('should get numeric value from input', () => {
      const event = {
        target: {
          valueAsNumber: 42
        }
      } as unknown as Event;
      const result = component.getInputValue(event, true);
      expect(result).toBe(42);
    });
  });

  describe('Shape Removal', () => {
    it('should remove selected rectangle', () => {
      component['selectedRect'] = mockRectangle;
      component.removeSelectedShape();
      expect(shapeService.removeShape).toHaveBeenCalledWith(mockRectangle.id);
      expect(component['selectedRect']).toBeNull();
    });

    it('should remove selected star', () => {
      component['selectedStar'] = mockStar;
      component.removeSelectedShape();
      expect(shapeService.removeShape).toHaveBeenCalledWith(mockStar.id);
      expect(component['selectedStar']).toBeNull();
    });

    it('should not remove when no shape is selected', () => {
      component['selectedRect'] = null;
      component['selectedStar'] = null;
      component.removeSelectedShape();
      expect(shapeService.removeShape).not.toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('should unsubscribe on destroy', () => {
      const subSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      component['sub'] = subSpy;
      component.ngOnDestroy();
      expect(subSpy.unsubscribe).toHaveBeenCalled();
    });

    it('should handle destroy without subscription', () => {
      component['sub'] = null;
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });
});