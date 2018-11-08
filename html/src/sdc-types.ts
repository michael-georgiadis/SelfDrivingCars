export interface IGrid {
    rows: number,
    columns: number,
    bonus: number
    total_steps: number,
    current_step: number
}
export interface IPoint { x: number, y: number }
export interface ITimeSpan { start: number, stop: number }
export interface IRide {
    index: number,
    start: IPoint,
    stop: IPoint,
    available: ITimeSpan
}