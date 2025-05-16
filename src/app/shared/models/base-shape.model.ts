import { ShapeType } from './shape-type.enum';

export interface BaseShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}
