import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarComponent } from './toolbar.component';
import { ShapeService } from '../../core/services/shape.service';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let shapeService: jasmine.SpyObj<ShapeService>;

  beforeEach(async () => {
    const shapeServiceSpy = jasmine.createSpyObj('ShapeService', [
      'addRectangle',
      'addStar',
      'clearAll'
    ]);

    await TestBed.configureTestingModule({
      imports: [ToolbarComponent],
      providers: [
        { provide: ShapeService, useValue: shapeServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    shapeService = TestBed.inject(ShapeService) as jasmine.SpyObj<ShapeService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addRectangle', () => {
    it('should call shapeService.addRectangle with correct parameters', () => {
      component.addRectangle();
      
      expect(shapeService.addRectangle).toHaveBeenCalledWith({
        x: 100,
        y: 100,
        width: 100,
        height: 80,
        rx: 10,
        fill: '#3498db',
        stroke: '#2c3e50',
        strokeWidth: 2
      });
    });
  });

  describe('addStar', () => {
    it('should call shapeService.addStar with correct parameters', () => {
      component.addStar();
      
      expect(shapeService.addStar).toHaveBeenCalledWith({
        x: 300,
        y: 200,
        outerRadius: 50,
        innerRadius: 25,
        points: 5,
        fill: '#f1c40f',
        stroke: '#d35400',
        strokeWidth: 2
      });
    });
  });

  describe('clearCanvas', () => {
    it('should call shapeService.clearAll when confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.clearCanvas();
      expect(shapeService.clearAll).toHaveBeenCalled();
    });

    it('should not call shapeService.clearAll when not confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      component.clearCanvas();
      expect(shapeService.clearAll).not.toHaveBeenCalled();
    });
  });
});