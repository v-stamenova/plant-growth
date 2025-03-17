import CanvasRenderer from '../CanvasRenderer.js';
import Observation from './Observation.js';

export default class Plant {
  private centerX: number;

  private centerY: number;

  private plotRadius: number;

  private radius: number;

  private observations: Observation[];

  private index: number;

  private timeToNextSwitch: number;

  private color: number;

  private asc: boolean;

  public constructor(centerX: number, centerY: number, plotRadius: number, observations: Observation[]) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.plotRadius = plotRadius;
    this.observations = observations;

    this.color = this.getGreenShade(0);
    this.radius = 0;
    this.index = 0;
    this.asc = false;

    this.timeToNextSwitch = 2000;

    if (this.index < this.observations.length && this.observations[this.index]) {
      this.calculateRadius(this.observations[this.index]!.getCoverage());
      this.color = this.getGreenShade(this.observations[this.index]!.getHeight());
      this.asc = true;
    }
  }

  private getGreenShade(height: number): number {
    this.asc = true;
    height = Math.max(0, Math.min(1, height));
    return 90 - 60 * height;
  }

  private getYellowShade(height: number): number {
    this.asc = false;
    height = Math.max(0, Math.min(1, height));
    return 60 + 60 * (height * 0.8);
  }

  private calculateRadius(observationPercentage: number): void {
    this.radius = (observationPercentage / 100) * this.plotRadius;
  }

  public update(elapsed: number): boolean {
    this.timeToNextSwitch -= elapsed;

    if (this.timeToNextSwitch <= 0) {
      this.index++;
      this.timeToNextSwitch = 2000;
      if (this.index < this.observations.length && this.observations[this.index]) {
        this.calculateRadius(this.observations[this.index]!.getCoverage());
        if(this.index > 0 && this.observations[this.index - 1] && this.observations[this.index]) {
          if(this.observations[this.index - 1]!.getCoverage() < this.observations[this.index]!.getCoverage()) {
            this.color = this.getGreenShade(this.observations[this.index]!.getHeight());
          } else {
            this.color = this.getYellowShade(this.observations[this.index]!.getHeight());
          }
        }
        console.log(this.color);
      }
    }

    if(this.index === this.observations.length - 1) {
      return false;
    }

    return true;
  }


  public render(canvas: HTMLCanvasElement): void {
    CanvasRenderer.drawIrregularPlantishShape(canvas, this.centerX, this.centerY, this.radius, this.color, this.asc);
  }
}