import CanvasRenderer from '../CanvasRenderer.js';
import MouseListener from '../MouseListener.js';
import Observation from './Observation.js';
import Plot from './Plot.js';

export default class Field {
  private posX: number;

  private posY: number;

  private column: number;

  private row: number;

  private width: number;

  private height: number;

  private plantMaxRadius: number;

  private plots: Plot[];

  private name: string;

  private dates: string[];

  private hover: boolean = false;

  public openInfoPanel: boolean = false;

  public constructor(
    name: string,
    posX: number,
    posY: number,
    plantMaxRadius: number,
    observations: Observation[]
  ) {
    this.column = observations[0]?.getColumn() ?? 0;
    this.row = observations[0]?.getRow() ?? 0;
    // this.width = plantMaxRadius * 2 * 4 + (plantMaxRadius * 0.9);
    this.width = plantMaxRadius * 2 * 2 + (plantMaxRadius * 0.5);
    this.height = plantMaxRadius * 2 * 4 + (plantMaxRadius * 0.9);
    this.posX = this.column * (this.width * 2.3) + this.width * 0.5;
    this.posY = this.row * (this.height + window.innerHeight * 0.01) + window.innerHeight * 0.2;
    this.plantMaxRadius = plantMaxRadius;
    this.plots = [];
    this.name = name;
    this.dates = observations.map((observation: Observation) => observation.getDate());
    if (observations[0]?.getCoverage() ?? 0 > 0) {
      this.fillPlots(observations);
    }
  }

  /**
   * Fills the plots with plants
   * @param observations the observations per plot
   */
  public fillPlots(observations: Observation[]): void {
    let index: number = 0;
    let centerX: number = this.posX + this.plantMaxRadius * 1.3;
    let centerY: number = this.posY + this.plantMaxRadius * 1.2;
    const flowerId: number = Math.round(Math.random());

    while (index < 8) {
      this.plots.push(new Plot(centerX, centerY, this.plantMaxRadius, observations, flowerId));
      centerY += this.plantMaxRadius * 2.1;

      if (index == 3) {
        centerY = this.posY + this.plantMaxRadius * 1.2;
        centerX += this.plantMaxRadius * 2.1;
      }

      index += 1;
    }
  }

  /**
   * Checks if it's being hovered
   * @param mouseListener the mouse listener
   * @returns if it's bein hovered over
   */
  public isHover(mouseListener: MouseListener): boolean {
    if (mouseListener.checkCollision(this.posX, this.posY, this.width, this.height)) {
      this.hover = true;
    } else {
      this.hover = false;
    }
    return this.hover;
  }

  /**
   * Updates the field
   * @param elapsed the time elapsed
   * @param dateIndex the current date index
   * @returns if it should keep updating
   */
  public update(elapsed: number, dateIndex: number): boolean {
    this.plots.forEach((plot: Plot) => plot.update(elapsed, dateIndex));

    return true;
  }

  /**
  * Moves the plant by the specified horizontal and vertical distances.
  *
  * @param deltaX is the horizontal distance the plant should move
  * @param deltaY is the vertical distance the plant should move
  */
  public move(deltaX: number, deltaY: number): void {
    this.posX += deltaX;
    this.posY += deltaY;
    this.plots.forEach((plot: Plot) => {
      plot.move(deltaX, deltaY);
    });
  }

  /**
   * Renders the info panel
   * @param canvas the canvas
   * @param dateIndex the current date index
   */
  public renderInfoPanel(canvas: HTMLCanvasElement, dateIndex: number): void {
    if (this.plots[0] && this.plots[0]?.plant.observations[0] != undefined) {
      CanvasRenderer.fillRectangle(canvas, this.posX, this.posY, this.width, this.height, 'red', 0.3, 10);

      CanvasRenderer.drawRectangle(canvas, canvas.width * 0.75, 0, canvas.width * 0.3, canvas.height, '#525252', '#000000', 0.9);
      CanvasRenderer.fillRectangleWithGradient(
        canvas, canvas.width * 0.73, 0, canvas.width * 0.02, canvas.height,
        [
          {red: 0, green: 0, blue: 0, opacity: 0.9, stop: 1, },
          { red: 0, green: 0, blue: 0, opacity: 0, stop: 0, },
        ],
        180,
      );

      const radius: number = Math.min(canvas.width, canvas.height) * 0.08;
      CanvasRenderer.drawCircle(canvas, canvas.width * 0.875, canvas.height * 0.2, radius, '#421010', '#421010');
      const scaleFactor: number = radius / (this.plantMaxRadius);
      this.plots[0].plant.render(canvas, canvas.width * 0.875, canvas.height * 0.2, scaleFactor);

      CanvasRenderer.writeText(canvas, `Variety: ${this.plots[0]?.plant?.observations[dateIndex]?.getVariety() ?? 0}`, canvas.width * 0.875, canvas.height * 0.35, 'center', 'system-ui', 25, 'white', true, 1000);
      CanvasRenderer.writeText(canvas, `Plotnum: ${this.name}`, canvas.width * 0.875, canvas.height * 0.38, 'center', 'system-ui', 18, 'lightgrey', true, 1000);
      CanvasRenderer.drawLine(canvas, canvas.width * 0.775, canvas.height * 0.4, canvas.width * 0.975, canvas.height * 0.4, 'white', 0.8, 1);

      // the actual 'stats' of the plant.
      // since there are 8 plants on a plot, stats from the first is taken
      // (yes, they are the same anyways)
      CanvasRenderer.writeText(canvas, 'NDVI:', canvas.width * 0.8, canvas.height * 0.5, 'left', 'system-ui', 20, 'lightgrey', true, 1000);
      CanvasRenderer.writeText(canvas, `${((this.plots[0]?.plant?.observations[dateIndex]?.getNDVI() ?? 0).toFixed(3))}`, canvas.width * 0.95, canvas.height * 0.5, 'right', 'system-ui', 20, 'lightgrey', true, 1000);
      CanvasRenderer.writeText(canvas, 'Cover%:', canvas.width * 0.8, canvas.height * 0.55, 'left', 'system-ui', 20, 'lightgrey', true, 1000);
      CanvasRenderer.writeText(canvas, `${((this.plots[0]?.plant?.observations[dateIndex]?.getCoverage() ?? 0).toFixed(3))}%`, canvas.width * 0.95, canvas.height * 0.55, 'right', 'system-ui', 20, 'lightgrey', true, 1000);
      CanvasRenderer.writeText(canvas, 'Plant height:', canvas.width * 0.8, canvas.height * 0.6, 'left', 'system-ui', 20, 'lightgrey', true, 1000);
      CanvasRenderer.writeText(canvas, `${((this.plots[0]?.plant?.observations[dateIndex]?.getHeight() ?? 0).toFixed(2))}`, canvas.width * 0.95, canvas.height * 0.6, 'right', 'system-ui', 20, 'lightgrey', true, 1000);
      CanvasRenderer.writeText(canvas, 'More info to come', canvas.width * 0.875, canvas.height * 0.65, 'center', 'system-ui', 18, 'lightgrey', true, 1000);
    }
  }

  /**
   * Renders the field
   * @param canvas the canvas
  */
  public render(canvas: HTMLCanvasElement, dateIndex: number): void {
    CanvasRenderer.drawRectangle(canvas, this.posX, this.posY, this.width, this.height, 'rgba(128, 99, 56, 0.77)', 'rgba(109, 81, 40, 0.36)');
    this.plots.forEach((plot: Plot) => plot.render(canvas));
    CanvasRenderer.writeText(canvas, this.name, (this.width / 2) + this.posX, this.height + this.posY - 40, 'center', 'system-ui', 15, 'lightgrey');
    CanvasRenderer.writeText(canvas, this.plots[0]?.plant?.observations[dateIndex]?.getVariety() ?? '', (this.width / 2) + this.posX, this.height + this.posY - 10, 'center', 'system-ui', 15, 'white');
    if (this.hover) {
      CanvasRenderer.fillRectangle(canvas, this.posX, this.posY, this.width, this.height, '#240404', 0.6, 0);
    }

    // renders the shadow from the tubers based on plant height
    const shadowAngle: number = Math.atan2(30, 20);
    const plantHeight: number = this.plots[0]?.plant?.observations[dateIndex]?.getHeight() ?? 0;
    const shadowLength: number = parseFloat(plantHeight.toFixed(2)) * 120;
    const shadowOffsetX: number = Math.cos(shadowAngle) * shadowLength;
    const shadowOffsetY: number = Math.sin(shadowAngle) * shadowLength;

    const shadowPoints: {x: number, y: number }[] = [
      { x: this.posX + this.width, y: this.posY },
      { x: this.posX + this.width, y: this.posY + this.height },
      { x: this.posX + this.width + Math.min(shadowOffsetX, 29), y: this.posY + this.height + Math.min(shadowOffsetY, 44) },
      { x: this.posX + this.width + Math.min(shadowOffsetX, 29), y: this.posY + Math.min(shadowOffsetY, 44) }
    ];

    // if the length of the shadow is longer than the ridge,
    // it follows the shape of the ground and starts moving horizontally
    // since after the ridge, the ground is flat
    if (shadowLength > 50) {
      shadowPoints.splice(3, 0,
        { x: this.posX + this.width + shadowOffsetX, y: this.posY + this.height + 44 },
        { x: this.posX + this.width + shadowOffsetX, y: this.posY + 44 },
      );
    }

    CanvasRenderer.fillPolygon(canvas, shadowPoints, 'rgba(0, 0, 0, 0.1)');
  }

  public getColumn(): number {
    return this.column;
  }

  public getRow(): number {
    return this.row;
  }

  public getDate(): string {
    return this.plots[0]?.getDate() ?? '';
  }

  public getDates(): string[] {
    return this.dates;
  }

  public getPosition(): number[] {
    return [this.posX, this.posY];
  }

  public getPlots(): Plot[] {
    return this.plots;
  }

  public getDimensions(): number[] {
    return [this.width, this.height];
  }

  public getFieldNumber(): string {
    return this.name;
  }
}
