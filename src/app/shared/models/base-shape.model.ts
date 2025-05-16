export interface BaseShape {
  id: string;
  type: string;
  x: number;
  y: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  minWidth?: number;
  minHeight?: number;
}

export interface RectangleShape extends BaseShape {
  type: 'rectangle';
  width: number;
  height: number;
  rx?: number;
  minWidth?: number;
  minHeight?: number;
}

export interface StarShape extends BaseShape {
  type: 'star';
  outerRadius: number;
  innerRadius: number;
  points: number;
  minWidth?: number;
  minHeight?: number;
}

export type Shape = RectangleShape | StarShape;

export function isRectangle(shape: Shape): shape is RectangleShape {
  return shape.type === 'rectangle';
}

export function isStar(shape: Shape): shape is StarShape {
  return shape.type === 'star';
}