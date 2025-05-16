// base-shape.model.ts
export interface BaseShape {
  id: string;
  type: string;
  x: number;
  y: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface RectangleShape extends BaseShape {
  type: 'rectangle';
  width: number;
  height: number;
  rx?: number; // radius opcional
}

export interface StarShape extends BaseShape {
  type: 'star';
  outerRadius: number;
  innerRadius: number;
  points: number;
}

export type Shape = RectangleShape | StarShape;