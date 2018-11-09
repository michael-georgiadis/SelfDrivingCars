export interface IGrid {
    rows: number,
    columns: number,
    bonus: number
    total_steps: number,
    current_step: number
}
export interface IPoint { x: number, y: number }
export interface IIntersection { row: number, col: number }
export interface ITimeSpan { start: number, stop: number }
export interface IRide {
    index: number,
    start: IIntersection,
    stop: IIntersection,
    available: ITimeSpan
}
export interface IGridData {
    intersection: IIntersection,
    point: IPoint,
    index: number,
    text?: string;
}
export interface IVehicle {
    position: IIntersection,
    destination: IIntersection,
    ride?: IRide,
    bonus: number;
}