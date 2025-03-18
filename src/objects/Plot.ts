import Konva from 'konva';
import CanvasRenderer from '../CanvasRenderer.js';
import Observation from './Observation.js';
import Plant from './Plant.js';
import KonvaRenderer from '../helpers/KonvaRenderer.js';

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

  public update(elapsed: number): boolean {
    return this.plant.update(elapsed);
  }


  public render(stage: Konva.Stage): void {
    KonvaRenderer.drawCircle(stage, this.centerX, this.centerY, this.radius, '#421010', '#421010');
    this.plant.render(stage);
  }

  public getDate(): string {
    return this.plant.getDate();
  }
}