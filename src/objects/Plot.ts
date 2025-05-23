import CanvasRenderer from '../CanvasRenderer.js';
import Observation from './Observation.js';
import Plant from './Plant.js';

export default class Plot {
  private centerX: number;

  private centerY: number;

  private radius: number;

  public plant: Plant;

  public constructor(
    centerX: number,
    centerY: number,
    radius: number,
    observations: Observation[],
    flowerId: number
  ){
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
    this.plant = new Plant(this.centerX, this.centerY, this.radius, observations, flowerId);
  }

  /**
   * Updates the plots
   * @param elapsed the elapsed time
   * @param dateIndex the current date index
   * @returns if the plots continues to update
   */
  public update(elapsed: number, dateIndex: number): boolean {
    return this.plant.update(elapsed, dateIndex);
  }

  /**
   * Renders the plot
   * @param canvas the canvas
   */
  public render(canvas: HTMLCanvasElement): void {
    CanvasRenderer.drawCircle(canvas, this.centerX, this.centerY, this.radius, 'rgb(66, 16, 16)', 'rgb(71, 46, 26)');
    this.plant.render(canvas);
  }

  public getDate(): string {
    return this.plant.getDate();
  }

  /**
   * Moves the plant by the specified horizontal and vertical distances.
   *
   * @param deltaX is the horizontal distance the plant should move
   * @param deltaY is the vertical distance the plant should move
   */
  public move(deltaX: number, deltaY: number): void {
    this.centerX += deltaX;
    this.centerY += deltaY;
    this.plant.move(deltaX, deltaY);
  }
}
