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
  public processInput(mouseListener: MouseListener, infoPanelOpened: boolean = false): void {
    if (mouseListener.checkCollision(
      this.posX * window.innerWidth + (window.innerWidth * 0.115 * (infoPanelOpened ? 0 : 1)),
      this.posY * window.innerHeight,
      (this.width * window.innerWidth) + window.innerWidth * 0.05,
      window.innerHeight * 0.03))
    {
      if (mouseListener.isButtonDown(0)) {
        this.holding = true;
      }
    }
    if (mouseListener.isButtonUp(0)) {
      this.holding = false;
    }
    if (this.holding) {
      this.activeValue = Math.min(
        1,
        Math.max(0, (mouseListener.getMousePosition().x - (window.innerWidth * 0.115 * (infoPanelOpened ? 0 : 1)) - (this.posX * window.innerWidth)) / (this.width * window.innerWidth))
      );
      this.activeValue = Math.round(
        (10 ** this.numDecimals) * (
          this.activeValue * (this.maxValue - this.minValue) + this.minValue
        )
      ) / (10 ** this.numDecimals);
    }
  }

  /**
   * renders the slider on the canvas
   *
   * @param canvas is the selected canvas to render to
   */
  public render(canvas: HTMLCanvasElement, isInfoOpen: boolean = false): void {
    const sliderWidth: number = canvas.width * 0.046;

    CanvasRenderer.fillRectangleWithGradient(
      canvas,
      ((this.posX * canvas.width) - sliderWidth / 2) + (canvas.width * 0.115 * (isInfoOpen ? 0 : 1)),
      30,
      (this.width * canvas.width) + sliderWidth,
      30,
      [
        { red: 0, green: 122, blue: 255, opacity: 1, stop: 0 },
        { red: 50, green: 102, blue: 204, opacity: 1, stop: 1 }
      ],
      0,
      10
    );

    CanvasRenderer.fillRectangle(canvas, 10 + (this.posX * canvas.width) + ((this.activeValue - this.minValue) / (this.maxValue - this.minValue) * (this.width * canvas.width)) - sliderWidth / 2 + (canvas.width * 0.115 * (isInfoOpen ? 0 : 1)), 34, sliderWidth - 20, 22, 'black', 1, 10);

    for (let i: number = 0; i < this.maxValue - this.minValue; i++) {
      CanvasRenderer.drawLine(
        canvas,
        (this.posX * canvas.width) + ((i - this.minValue) / (this.maxValue - this.minValue) * (this.width * canvas.width)) + sliderWidth / 2 + (canvas.width * 0.115 * (isInfoOpen ? 0 : 1)),
        this.posY + 30,
        (this.posX * canvas.width) + ((i - this.minValue) / (this.maxValue - this.minValue) * (this.width * canvas.width)) + sliderWidth / 2 + (canvas.width * 0.115 * (isInfoOpen ? 0 : 1)),
        this.posY + 60,
        'darkgray',
        1,
        2
      );
    }
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
