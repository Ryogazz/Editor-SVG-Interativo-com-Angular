import { BaseShape } from './base-shape.model';

export interface StarShape extends BaseShape {
  points: number;       
  outerRadius: number;   
  innerRadius: number;   
}
