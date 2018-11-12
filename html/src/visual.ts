import { IGrid, IPoint, ITimeSpan, IRide, IIntersection, IGridData, IVehicle } from "./sdc-types";
import * as d3 from "d3";

interface Iterator<IIntersection> {
    [Symbol.iterator](): IterableIterator<IIntersection>;
}

export class Board {
    options: IGrid;
    edgeLength: number;
    padding: number;
    gridElement: d3.Selection<d3.BaseType, {}, HTMLElement, any> = <any>{};
    data: IGridData[];
    intersectionCoordinates: IPoint[][];
    cars: IVehicle[];
    constructor(grid: IGrid, edgeLength: number, padding: number) {
        this.options = grid;
        this.edgeLength = edgeLength;
        this.padding = padding;
        this.intersectionCoordinates = Array.from({ length: grid.rows + 1 },
            (_, rowIndex) => Array.from({ length: grid.columns + 1 },
                (_, columnIndex) => <IPoint>{ x: columnIndex, y: rowIndex + 1 }));
        this.cars = [];
        this.data = this.refreshData(grid);
    }

    public refreshData(options: IGrid) {
        const padding = this.padding;
        const edgeLength = this.edgeLength;
        const paddedLength = 2 * padding + edgeLength;
        return Array.from({ length: (options.rows + 1) * (options.columns + 1) }, (_, index) => {
            const value: IGridData = { intersection: { row: 0, col: 0 }, point: { x: 0, y: 0 }, index: index }
            value.intersection.row = Math.floor(index / (options.columns + 1));
            value.intersection.col = index % (options.columns + 1);
            value.point.x = value.intersection.col * paddedLength;
            value.point.y = value.intersection.row * paddedLength;
            value.index = index;

            if (value.intersection.row === 0) value.text = value.intersection.col.toString();
            if (value.intersection.col === 0) value.text = value.intersection.row.toString();

            this.intersectionCoordinates[value.intersection.row][value.intersection.col] =
                {
                    x: value.point.x + paddedLength + padding / 2,
                    y: value.point.y + paddedLength + padding / 2
                };

            return value;
        });
    }

    public drawBoard(gridSelector: string) {
        const options = this.options;
        const padding = this.padding;
        const edgeLength = this.edgeLength;
        const paddedLength = 2 * padding + edgeLength;
        const columns_ = this.options.columns + 1;
        const rows_ = this.options.rows + 1;

        const gridContainer = d3
            .select(gridSelector)
            .append("svg")
            .attr("width", paddedLength * columns_ + paddedLength / 2 + "px")
            .attr("height", paddedLength * rows_ + paddedLength / 2 + "px")
            .append("g");

        gridContainer
            .selectAll(".cell")
            .data(this.data)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("x", d => d.point.x + padding)
            .attr("y", d => d.point.y + padding)
            .attr("width", d => edgeLength)
            .attr("height", d => edgeLength)
            .attr("rx", 3)
            .attr("ry", 3)
            .style("fill", d => {
                if (d.intersection.row == d.intersection.col && d.intersection.row == 1)
                    return "azure";
                else return "#fff"
            })
            .style("stroke", d => {
                if (d.intersection.row === 0 || d.intersection.col === 0 ||
                    d.intersection.row === rows_ || d.intersection.col === columns_)
                    return "";
                else return "#222";
            });

        gridContainer
            .selectAll(".column-label")
            .data(this.data.filter((value, index) => value.intersection.row === 0))// || value.intersection.row === rows_))
            .enter()
            .append("text")
            .attr("class", "column-label")
            .text(d => d.text || "")
            .attr("width", paddedLength - 10)
            .attr("text-anchor", "middle")
            .attr("x", d => d.point.x + paddedLength)
            .attr("y", d => d.point.y + paddedLength - 10)

        gridContainer
            .selectAll(".row-label")
            .data(this.data.filter((value, index) => value.intersection.col === 0))// || value.intersection.col === columns_))
            .enter()
            .append("text")
            .attr("class", "row-label")
            .text(d => d.text || "")
            //.attr("width", paddedLength - 10)
            .attr("text-anchor", "end")
            .attr("x", d => d.point.x + paddedLength - 10)
            .attr("y", d => d.point.y + paddedLength + 3)

        gridContainer
            .selectAll(".xing")
            .data(Array.from({ length: rows_ * columns_ }, (_, index) => index))
            .enter()
            .append("circle")
            .attr("class", "xing")
            .attr("cx", index => this.intersectionCoordinates[Math.floor(index / columns_)][index % columns_].x - 1.5)
            .attr("cy", index => this.intersectionCoordinates[Math.floor(index / columns_)][index % columns_].y - 1.5)
            .attr("r", 3)
            .attr("fill", "#00f")
            .attr("opacity", .05)

        this.gridElement = gridContainer;
    }

    public *inclusiveIntersectionPath(a: IIntersection, b: IIntersection): Iterator<IIntersection> {
        const stepX = Math.sign(b.col - a.col);
        const stepY = Math.sign(b.row - a.row);

        yield a; //this.intersectionCoordinates[a.row][a.col];

        let current = a;
        let updateRow = true;
        while (current.col != b.col || current.row != b.row) {
            const next: IIntersection = {
                row: current.row !== b.row && updateRow ? current.row + stepY : current.row,
                col: current.col !== b.col && !updateRow ? current.col + stepX : current.col
            }
            yield next;//this.intersectionCoordinates[next.row][next.col];

            updateRow = !updateRow;
            current = next;
        }
    }

    public *inclusivePointPath(a: IIntersection, b: IIntersection): Iterator<IPoint> {
        const iter = this.inclusiveIntersectionPath(a, b);
        for (let xion of iter) {
            yield this.intersectionCoordinates[xion.row][xion.col];
        }
    }

    // public d3Line(a: IIntersection, b: IIntersection) {
    //     const data = [...this.inclusivePointPath(a, b)].map(point => [point.x, point.y]);
    //     return d3.line()(data)
    // }

    public getPath(a: IIntersection, b: IIntersection) {

        //var line = d3.line().curve(d3.curveMonotoneX);
        //.x(function(d, i) { return xScale(i); }) // set the x values for the line generator
        //.y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
        console.log(a, "->", b);
        const stepX = Math.sign(b.col - a.col);
        const stepY = Math.sign(b.row - a.row);
        const startingPoint = this.intersectionCoordinates[a.row][a.col];
        const path = [`M${startingPoint.x} ${startingPoint.y}`];

        let current = a;
        let updateRow = true;
        while (current.col != b.col || current.row != b.row) {
            const next: IIntersection = {
                row: current.row !== b.row && updateRow ? current.row + stepY : current.row,
                col: current.col !== b.col && !updateRow ? current.col + stepX : current.col
            }
            const nextPoint = this.intersectionCoordinates[next.row][next.col];
            path.push(`L${nextPoint.x} ${nextPoint.y}`);
            updateRow = !updateRow;
            current = next;
        }

        console.log(path);

        return path.join(" ");
    }

    //public refreshRides() { };
    public addCars(cars: IVehicle[]) {
        this.gridElement
            .selectAll(".vehicle")
            .data(cars)
            .enter()
            .append("circle")
            .attr("class", "vehicle")
            .attr("cx", v =>
                this.intersectionCoordinates[v.position.row][v.position.col].x.toString())
            .attr("cy", v =>
                this.intersectionCoordinates[v.position.row][v.position.col].y.toString())
            .attr("r", 5)
            .style("stroke", "#222")
            .style("fill", v => {
                if (v.ride == null) return "green";
                else return "blue";
            });

        this.gridElement
            .selectAll(".vehicle-path")
            .data(cars)
            .enter()
            .append("path")
            .attr("d", d => this.getPath(d.position, d.destination))
            .style("fill", "transparent")
            .style("stroke", "#f00")
            .style("stroke-width", 4);

        this.cars = cars;
    };

    public updateCars(cars: IVehicle[]) {
        this.gridElement
            .selectAll(".vehicle")
            .data(cars)
            .transition()
            .attr("cx", v =>
                this.intersectionCoordinates[v.position.row][v.position.col].x.toString())
            .attr("cy", v =>
                this.intersectionCoordinates[v.position.row][v.position.col].y.toString());

        this.gridElement
            .selectAll(".vehicle-path")
            .data(cars)
            .transition()
            .attr("d", d => this.getPath(d.position, d.destination));
    }
}