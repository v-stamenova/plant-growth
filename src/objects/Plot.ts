import CanvasRenderer from '../CanvasRenderer.js';
import Observation from './Observation.js';
import Plant from './Plant.js';

export default class Plot {
  private centerX: number;

  private centerY: number;

  private radius: number;

  private plant: Plant;

  public constructor(centerX: number, centerY: number, radius: number, observations: Observation[]){
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
    this.plant = new Plant(this.centerX, this.centerY, this.radius, observations);
  }

  public update(elapsed: number, dateIndex: number): boolean {
    return this.plant.update(elapsed, dateIndex);
  }


  public render(canvas: HTMLCanvasElement): void {
    CanvasRenderer.drawCircle(canvas, this.centerX, this.centerY, this.radius, '#421010', '#421010');
    this.plant.render(canvas);
  }

  public getDate(): string {
    return this.plant.getDate();
  }
}
