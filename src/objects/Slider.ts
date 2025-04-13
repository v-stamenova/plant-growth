import MouseListener from '../MouseListener.js';
import CanvasRenderer from '../CanvasRenderer.js';

export default class Slider {
  private posX: number;

  private posY: number;

  private width: number;

  private minValue: number;

  private maxValue: number;

  private activeValue: number;

  private numDecimals: number;

  private leftLabel: string;

  private rightLabel: string;

  // why use this.holding? the reason is:
  // incase we have multiple sliders, we can use this.holding to make su
  // you can only move 1 slider at the same time
  public holding: boolean = false;

  public constructor(
    posX: number,
    posY: number,
    width: number,
    minValue: number = 0,
    maxValue: number = 0,
    activeValue: number = 0,
    decimals: number=0,
    leftLabel: string = '',
    rightLabel: string = ''
  ) {
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.activeValue = activeValue;
    this.numDecimals = decimals;
    this.leftLabel = leftLabel;
    this.rightLabel = rightLabel;
  }

  /**
   * makes sure the player can actually move the slider
   *
   * @param mouseListener is what listenes to the mouse inputs
   */
  public processInput(mouseListener: MouseListener): void {
    if (mouseListener.checkCollision(this.posX, this.posY, this.width + window.innerWidth * 0.05, window.innerHeight * 0.03)) {
      if (mouseListener.isButtonDown(0)) {
        this.holding = true;
      }
    }
    if (mouseListener.isButtonUp(0)) {
      this.holding = false;
    }
    if (this.holding) {
      this.activeValue = Math.min(1, Math.max(0, (mouseListener.getMousePosition().x - this.posX) / (this.width)))
      this.activeValue = Math.round((10 ** this.numDecimals) * (this.activeValue * (this.maxValue - this.minValue) + this.minValue)) / (10 ** this.numDecimals);
    }
  }

  /**
   * renders the slider on the canvas
   *
   * @param canvas is the selected canvas to render to
   */
  public render(canvas: HTMLCanvasElement): void {
    const sliderWidth: number = canvas.width * 0.05;
    CanvasRenderer.fillRectangle(canvas, this.posX - sliderWidth / 2, this.posY, this.width + sliderWidth, canvas.height * 0.03, 'grey');
    CanvasRenderer.drawRectangle(canvas, this.posX - sliderWidth / 2, this.posY, this.width + sliderWidth, canvas.height * 0.03, 'black');

    CanvasRenderer.fillRectangle(canvas, this.posX + ((this.activeValue - this.minValue) / (this.maxValue - this.minValue) * this.width) - sliderWidth / 2, this.posY, sliderWidth, canvas.height * 0.03, 'white');
    CanvasRenderer.drawRectangle(canvas, this.posX + ((this.activeValue - this.minValue) / (this.maxValue - this.minValue) * this.width) - sliderWidth / 2, this.posY, sliderWidth, canvas.height * 0.03, 'black');
  
    CanvasRenderer.writeText(canvas, this.leftLabel, canvas.width * 0.18, canvas.height * 0.05, 'left', 'system-ui', 20, 'blue');
    CanvasRenderer.writeText(canvas, this.rightLabel, canvas.width * 0.55, canvas.height * 0.05, 'left', 'system-ui', 20, 'blue');
  }

  /**
   * A getter for encapsulation the active value
   * @returns the active value
   */
  public getActiveValue(): number {
    return this.activeValue;
  }
}
