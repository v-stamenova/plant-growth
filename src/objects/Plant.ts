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

  private image: HTMLImageElement;

  private width: number;
  
  private loadedImages: HTMLImageElement[];

  public constructor(centerX: number, centerY: number, plotRadius: number, observations: Observation[]) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.plotRadius = plotRadius;
    this.observations = observations;

    this.radius = 0;
    this.index = 0;

    this.timeToNextSwitch = 2000;

    this.loadedImages = [];
    for(let i: number = 1; i < 11; i++) {
      this.loadedImages.push(CanvasRenderer.loadNewImage(`../../img/plant-${i}.png`));
    }

    if (this.observations[this.index] != null) {
      const imageIndex: number = this.ndviRange(this.observations[this.index]!.getNDVI());
      this.image = this.loadedImages[imageIndex] ?? CanvasRenderer.loadNewImage('../../img/plant-green.png'); 
    } else {
      this.image = CanvasRenderer.loadNewImage('../../img/plant-green.png');
    }

    this.width = 50;
  }

  private calculateRadius(observationPercentage: number): void {
    this.radius = (observationPercentage / 100) * this.plotRadius;
  }

  private updateImage(): void {
    const ndvi: number = this.observations[this.index]!.getNDVI();
    const imageNumber: number = this.ndviRange(ndvi);
    this.image = this.loadedImages[imageNumber - 1] ?? CanvasRenderer.loadNewImage('../../img/plant-green.png');
  }

  /**
   * Calculates the index of the plant image based on the ndvi
   * @param ndvi the NDVI index
   * @returns the index of the picture
   */
  private ndviRange(ndvi: number): number {
    if (ndvi <= 0.5) return 1;
    if (ndvi > 0.95) return 10;
    return Math.floor((ndvi - 0.7) / 0.05) + 2;
  }

  /**
   * Updates the plant
   * @param elapsed the time elapsed
   * @returns if it still updates
   */
  public update(elapsed: number): boolean {
    this.timeToNextSwitch -= elapsed;

    if (this.timeToNextSwitch <= 0) {
      this.index += 1;
      this.timeToNextSwitch = 2000;

      if (this.index < this.observations.length && this.observations[this.index]) {
        this.calculateRadius(this.observations[this.index]!.getCoverage());
        this.updateImage();
      }
    }

    if(this.index === this.observations.length - 1) {
      return false;
    }

    return true;
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
  }


  /**
   * Renders elements on the canvas
   *
   * @param canvas the selected canvas to render elements on
   */
  public render(canvas: HTMLCanvasElement): void {
    CanvasRenderer.drawImageDimensions(canvas, this.image, this.centerX - this.width * 0.5, this.centerY - this.width * 0.5, this.width, this.width);
  }

  public getDate(): string {
    return this.observations[this.index]?.getDate() ?? '';
  }
}
