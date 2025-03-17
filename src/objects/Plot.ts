import CanvasRenderer from '../CanvasRenderer.js';
import Plant from './Plant.js';

export default class Plot {
  private centerX: number;

  private centerY: number;

  private radius: number;

  private plant: Plant;

  public constructor(centerX: number, centerY: number, radius: number){
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
    this.plant = new Plant(this.centerX, this.centerY, this.radius);
  }

  public update(elapsed: number): boolean {
    return this.plant.update(elapsed);
  }


  public render(canvas: HTMLCanvasElement): void {
    CanvasRenderer.drawCircle(canvas, this.centerX, this.centerY, this.radius, '#421010', '#421010');
    this.plant.render(canvas);
  }
}