import { TestBed } from '@angular/core/testing';
import { ShapeService } from './shape.service';
import { RectangleShape, Shape, StarShape } from '../../shared/models/base-shape.model';

describe('ShapeService', () => {
  let service: ShapeService;
  
  const mockRectangle: RectangleShape = {
    id: 'rect-1',
    type: 'rectangle',
    x: 10,
    y: 10,
    width: 100,
    height: 50,
    rx: 5,
    fill: '#ff0000',
    stroke: '#000000',
    strokeWidth: 2,
    minWidth: 20,
    minHeight: 20
  };

  const mockStar: StarShape = {
    id: 'star-1',
    type: 'star',
    x: 50,
    y: 50,
    outerRadius: 30,
    innerRadius: 15,
    points: 5,
    fill: '#00ff00',
    stroke: '#000000',
    strokeWidth: 1,
    minWidth: 10,
    minHeight: 10
  };

  function isRectangle(shape: Shape): shape is RectangleShape {
    return shape.type === 'rectangle';
  }

  function isStar(shape: Shape): shape is StarShape {
    return shape.type === 'star';
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShapeService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Shape Management', () => {
    it('should add and retrieve rectangle shape with correct properties', () => {
      service.addShape(mockRectangle);
      const shapes = service.getShapesSnapshot();
      
      expect(shapes.length).toBe(1);
      expect(shapes[0].type).toBe('rectangle');
      
      if (isRectangle(shapes[0])) {
        expect(shapes[0].width).toBe(100);
        expect(shapes[0].height).toBe(50);
        expect(shapes[0].rx).toBe(5);
      } else {
        fail('Expected a RectangleShape');
      }
    });

    it('should add and retrieve star shape with correct properties', () => {
      service.addShape(mockStar);
      const shapes = service.getShapesSnapshot();
      
      expect(shapes.length).toBe(1);
      expect(shapes[0].type).toBe('star');
      
      if (isStar(shapes[0])) {
        expect(shapes[0].outerRadius).toBe(30);
        expect(shapes[0].innerRadius).toBe(15);
        expect(shapes[0].points).toBe(5);
      } else {
        fail('Expected a StarShape');
      }
    });

    it('should update rectangle dimensions correctly', () => {
      service.addShape(mockRectangle);
      const updatedRect: RectangleShape = {
        ...mockRectangle,
        width: 150,
        height: 75
      };
      
      service.updateShape(updatedRect);
      const shapes = service.getShapesSnapshot();
      
      expect(shapes.length).toBe(1);
      const shape = shapes[0];
      
      if (!isRectangle(shape)) {
        throw new Error('Expected a RectangleShape');
      }
      
      expect(shape.width).toBe(150);
      expect(shape.height).toBe(75);
      expect('outerRadius' in shape).toBe(false); 
    });

    it('should update star properties correctly', () => {
      service.addShape(mockStar);
      const updatedStar: StarShape = {
        ...mockStar,
        outerRadius: 40,
        innerRadius: 20
      };
      
      service.updateShape(updatedStar);
      const shapes = service.getShapesSnapshot();
      
      expect(shapes.length).toBe(1);
      const shape = shapes[0];
      
      if (!isStar(shape)) {
        throw new Error('Expected a StarShape');
      }
      
      expect(shape.outerRadius).toBe(40);
      expect(shape.innerRadius).toBe(20);
      expect('width' in shape).toBe(false); 
    });
  });

  describe('Persistence', () => {
    it('should persist rectangle to localStorage', () => {
      service.addShape(mockRectangle);
      const savedData = localStorage.getItem('canvas_shapes_data');
      const parsed = JSON.parse(savedData || '[]');
      
      expect(parsed.length).toBe(1);
      expect(parsed[0].type).toBe('rectangle');
      
      if (isRectangle(parsed[0])) {
        expect(parsed[0].width).toBe(100);
      } else {
        fail('Expected a RectangleShape');
      }
    });

it('should load rectangle from localStorage', () => {
  const rectangleToSave = { 
    ...mockRectangle,
    id: 'test-rectangle-' + Date.now() 
  };

  localStorage.setItem('canvas_shapes_data', JSON.stringify([rectangleToSave]));
  
  const newService = new ShapeService();
  
  const shapes = newService.getShapesSnapshot();
  
  expect(shapes.length).withContext('Deveria carregar 1 forma').toBe(1);
  
  const loadedShape = shapes[0];
  expect(loadedShape.type).withContext('Tipo deveria ser rectangle').toBe('rectangle');
  
  if (isRectangle(loadedShape)) {
    expect(loadedShape.width).withContext('Largura incorreta').toBe(mockRectangle.width);
    expect(loadedShape.height).withContext('Altura incorreta').toBe(mockRectangle.height);
  } else {
    fail('Forma carregada não é um RectangleShape');
  }
});
  });

  describe('Edge Cases', () => {
    it('should handle updating non-existent shape', () => {
      const fakeShape: RectangleShape = {
        ...mockRectangle,
        id: 'non-existent'
      };
      
      service.updateShape(fakeShape);
      expect(service.getShapesSnapshot().length).toBe(0);
    });

    it('should maintain type when updating shape', () => {
      service.addShape(mockRectangle);
      const updated = {
        ...mockRectangle,
        width: 200
      };
      
      service.updateShape(updated);
      const shapes = service.getShapesSnapshot();
      
      if (!isRectangle(shapes[0])) {
        throw new Error('Type changed unexpectedly');
      }
      
      expect(shapes[0].width).toBe(200);
    });
  });
});