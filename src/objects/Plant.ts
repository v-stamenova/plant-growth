import CanvasRenderer from '../CanvasRenderer.js';
import Observation from './Observation.js';

export default class Plant {
  private centerX: number;

  private centerY: number;

  private plotRadius: number;

  public observations: Observation[];

  private index: number;

  private timeToNextSwitch: number;

  private image: HTMLImageElement;

  private width: number;

  private loadedImages: HTMLImageElement[];

  private rotation: number;

  private flower: HTMLImageElement;

  private isFlowerVisible: boolean;

  public constructor(
    centerX: number,
    centerY: number,
    plotRadius: number,
    observations: Observation[],
    flowerId: number
  ) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.plotRadius = plotRadius;
    this.observations = observations;

    this.isFlowerVisible = false;
    this.index = 0;
    this.rotation = Math.random();

    this.timeToNextSwitch = 2000;

    this.loadedImages = [];
    for(let i: number = 1; i < 11; i++) {
      this.loadedImages.push(CanvasRenderer.loadNewImage(`../../img/plant-${i}.png`));
    }

    if (this.observations[this.index] != null) {
      const imageIndex: number = this.ndviRange(this.observations[0]!.getNDVI());
      this.image = this.loadedImages[imageIndex] ?? CanvasRenderer.loadNewImage('../../img/plant-green.png');
      this.width = this.plotRadius * 5 * (this.observations[0]!.getCoverage() / 100);
    } else {
      this.image = CanvasRenderer.loadNewImage('../../img/plant-green.png');
      this.width = 50;
    }

    this.flower = CanvasRenderer.loadNewImage(`../../img/flower-${flowerId}.png`);
  }

  private updateImage(dateIndex: number): void {
    const ndvi: number = this.observations[dateIndex]!.getNDVI();
    const imageNumber: number = this.ndviRange(ndvi);
    this.image = this.loadedImages[imageNumber - 1] ?? CanvasRenderer.loadNewImage('../../img/plant-green.png');
  }

  /**
   * Calculates the index of the plant image based on the ndvi
   * @param ndvi the NDVI index
   * @returns the index of the picture
   */
  // eslint-disable-next-line class-methods-use-this
  private ndviRange(ndvi: number): number {
    if (ndvi <= 0.5) {
      return 1;
    }
    if (ndvi > 0.95) {
      return 10;
    }
    return Math.floor((ndvi - 0.5) / 0.05) + 2;
  }

  /**
   * Updates the plant
   * @param elapsed the time elapsed
   * @param dateIndex the current date
   * @returns if the plant still updates
   */
  public update(elapsed: number, dateIndex: number): boolean {
    if (dateIndex < this.observations.length && this.observations[dateIndex]) {
      this.width = this.plotRadius * 5 * (this.observations[dateIndex]!.getCoverage() / 100);
      this.updateImage(dateIndex);

      // originally this was days after planting
      // since this is the same for all tubers, they all got flowers at the same time
      // which didn't look too natural
      // by changing it to coverage and playing around with the values
      // i got something that looks a bit better
      this.isFlowerVisible = false;

      const coverage: number = this.observations[dateIndex]!.getCoverage();
      const ndvi: number = this.observations[dateIndex]!.getNDVI();
      const daysAfterPlanting: number = this.observations[dateIndex]!.getDAP(); // Assuming dateIndex represents days after planting

      // Flower becomes visible when coverage is high, NDVI is optimal, and enough days have passed
      if (
        coverage > 99 &&
        ndvi > 0.89 &&
        ndvi <= 0.98 &&
        daysAfterPlanting >= 60 // Assuming flowers appear after 30 days
      ) {
        this.isFlowerVisible = true;
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
   * Renders the element on the canvas
   * @param canvas the canvas
   * @param posX position X
   * @param posY position Y
   * @param scale the scale
   */
  public render(
    canvas: HTMLCanvasElement,
    posX: number = this.centerX,
    posY: number = this.centerY,
    scale: number = 1
  ): void {
    CanvasRenderer.drawImageDimensionsRotation(
      canvas,
      this.image,
      posX - (this.width * scale) * 0.5,
      posY - (this.width * scale) * 0.5,
      this.width * scale,
      this.width * scale,
      this.rotation
    );

    if (this.isFlowerVisible) {
      CanvasRenderer.drawImageDimensionsRotation(
        canvas,
        this.flower,
        posX - (this.width * scale) * 0.5,
        posY - (this.width * scale) * 0.5,
        this.width * scale,
        this.width * scale,
        this.rotation
      );
    }
  }

  public getDate(): string {
    return this.observations[this.index]?.getDate() ?? '';
  }
}
