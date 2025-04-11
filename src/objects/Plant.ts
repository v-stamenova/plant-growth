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

  private color: number|string;

  private asc: boolean;

  public constructor(centerX: number, centerY: number, plotRadius: number, observations: Observation[]) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.plotRadius = plotRadius;
    this.observations = observations;

    this.color = this.getGreenHue(0);
    this.radius = 0;
    this.index = 0;
    this.asc = false;

    this.timeToNextSwitch = 2000;

    if (this.index < this.observations.length && this.observations[this.index]) {
      this.calculateRadius(this.observations[this.index]!.getCoverage());
      this.color = this.getGreenHue(this.observations[this.index]!.getHeight());
      this.asc = true;
    }
  }

  private getGreenHue(value: number): string {
    // Ensure the value stays within the 0 to 1 range.
    value = Math.max(0, Math.min(1, value));

    // Define lightness: 90% for 0 (lighter green) and 30% for 1 (darker green).
    const lightness = 90 - 60 * value;

    // Return an HSL color. Green hue is 120 degrees.
    return `hsl(120, 100%, ${lightness}%)`;
  }

  private getGreenYellowHue(value: number): string {
    // Clamp the value between 0 and 1.
    value = Math.max(0, Math.min(1, value));

    const hue = 60 + 60 * value * 0.8;

    // Use fixed saturation and lightness for a vivid color.
    return `hsl(${hue}, 100%, 50%)`;
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

  public update(elapsed: number, dateIndex: number): boolean {
    if (dateIndex < this.observations.length && this.observations[dateIndex]) {
      this.calculateRadius(this.observations[dateIndex]!.getCoverage());
      if (dateIndex > 0 && this.observations[dateIndex - 1] && this.observations[dateIndex]) {
        if (this.observations[dateIndex - 1]!.getCoverage() < this.observations[dateIndex]!.getCoverage()) {
          this.color = this.getGreenHue(this.observations[dateIndex]!.getHeight());
        } else {
          this.color = this.getGreenYellowHue(this.observations[dateIndex]!.getHeight());
        }
      }
    }

    if(this.index === this.observations.length - 1) {
      return false;
    }

    return true;
  }


  public render(canvas: HTMLCanvasElement): void {
    //CanvasRenderer.drawCircle(canvas, this.centerX, this.centerY, this.radius, this.color, this.asc);
    if (Number(this.color))
    {
      CanvasRenderer.drawIrregularPlantishShape(canvas, this.centerX, this.centerY, this.radius, Number(this.color), this.asc);
    } else if (this.color) {
      CanvasRenderer.drawCircle(canvas, this.centerX, this.centerY, this.radius, this.color.toString(), this.color.toString());
    }
  }

  public getDate(): string {
    return this.observations[this.index]?.getDate() ?? '';
  }
}
