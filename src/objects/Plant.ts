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

  private color: string;

  public constructor(centerX: number, centerY: number, plotRadius: number) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.plotRadius = plotRadius;

    this.color = this.getGreenShade(0);
    this.radius = 0;
    this.index = 0;

    this.timeToNextSwitch = 2000;

    this.observations = [new Observation('17.03.2025', 30, 0.2), new Observation('18.03.2025', 50, 0.4), new Observation('19.03.2025', 80, 0.9), new Observation('21.03.2025', 60, 0.6)];
    if (this.index < this.observations.length && this.observations[this.index]) {
      this.calculateRadius(this.observations[this.index]!.getCoverage());
      this.color = this.getGreenShade(this.observations[this.index]!.getHeight());
    }
  }

  private getGreenShade(height: number): string {
    height = Math.max(0, Math.min(1, height));
    const lightness: number = 90 - 60 * height;
    return `hsl(120, 100%, ${lightness}%)`;
  }

  private getYellowShade(height: number): string {
    height = Math.max(0, Math.min(1, height));
    const hue: number = 60 + 60 * (height * 0.8);
    return `hsl(${hue}, 100%, 50%)`;
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
    CanvasRenderer.drawCircle(canvas, this.centerX, this.centerY, this.radius, this.color, this.color);
  }
}