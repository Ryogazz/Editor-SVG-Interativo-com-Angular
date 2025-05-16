import { BaseShape } from './base-shape.model';

export interface RectangleShape extends BaseShape {
  width: number;
  height: number;
  rx: number; 
}
