/**
 * Helper class for managing the mouse
 *
 * @author Frans Blauw
 */

export interface MouseCoordinates {
  x: number;
  y: number;
}

export default class MouseListener {
  public static readonly BUTTON_LEFT: number = 0;

  public static readonly BUTTON_MIDDLE: number = 1;

  public static readonly BUTTON_RIGHT: number = 2;

  private mouseCoordinates: MouseCoordinates = { x: 0, y: 0 };

  private buttonDown: Record<number, boolean> = {};

  private buttonQueried: Record<number, boolean> = {};

  private buttonUp: Record<number, boolean> = {};

  /**
   *
   * @param canvas the canvas element to which the relative coordinates should given
   * @param disableContextMenu true to disable the context (right click) menu. Default: false
   */
  public constructor(canvas: HTMLCanvasElement, disableContextMenu: boolean = false) {
    canvas.addEventListener('mousemove', (ev: MouseEvent) => {
      this.mouseCoordinates = {
        x: ev.offsetX,
        y: ev.offsetY,
      };
    });
    canvas.addEventListener('mousedown', (ev: MouseEvent) => {
      this.buttonDown[ev.button] = true;
      this.buttonUp[ev.button] = false;
    });
    canvas.addEventListener('mouseup', (ev: MouseEvent) => {
      this.buttonDown[ev.button] = false;
      this.buttonQueried[ev.button] = false;
      this.buttonUp[ev.button] = true;
    });
    if (disableContextMenu) {
      canvas.addEventListener('contextmenu', (ev: MouseEvent) => {
        ev.preventDefault();
      });
    }
  }

  /**
   * Checks whether a mouse button is currently down.
   *
   * @param buttonCode the mouse button to check
   * @returns `true` when the specified button is currently down
   */
  public isButtonDown(buttonCode: number = 0): boolean {
    if (this.buttonDown[buttonCode]) {
      return true;
    }
    return false;
  }

  /**
   * Checks whether a mouse button is up.
   *
   * @param buttonCode the mouse button to check
   * @returns `true` when the specified button is currently down
   */
  public isButtonUp(buttonCode: number = 0): boolean {
    return this.buttonUp[buttonCode] ?? false;
  }

  /**
   * Returns the difference in mouse position since the last call to this method.
   * The delta is (current - previous).
   *
   * @returns MouseCoordinates object with delta x and y
   */
  private lastMouseCoordinates: MouseCoordinates = { x: 0, y: 0 };

  public getMouseDelta(): MouseCoordinates {
    const delta: { x: number, y: number } = {
      x: this.mouseCoordinates.x - this.lastMouseCoordinates.x,
      y: this.mouseCoordinates.y - this.lastMouseCoordinates.y,
    };
    this.lastMouseCoordinates = { ...this.mouseCoordinates };
    return delta;
  }

  public resetMouseDelta(): void {
    this.lastMouseCoordinates = { ...this.mouseCoordinates };
  }

  /**
   *
   * @param buttonCode the mouse button to check
   * @returns `true` when the specified button was pressed
   */
  public buttonPressed(buttonCode: number = 0): boolean {
    if (this.buttonQueried[buttonCode] === true) {
      return false;
    }
    if (this.buttonDown[buttonCode] === true) {
      this.buttonQueried[buttonCode] = true;
      return true;
    }
    return false;
  }

  /**
   * Returns the current mouse coordinates in an object
   *
   * @returns MouseCoordinates object with current position of mouse
   */
  public getMousePosition(): MouseCoordinates {
    return this.mouseCoordinates;
  }

  /**
   * checks collision with cursor and square shape
   *
   * @returns true or false depending on if mouse if hovering over section
   */
  public checkCollision(posX: number, posY: number, width: number, height: number): boolean {
    if (
      this.mouseCoordinates.x > posX &&
      this.mouseCoordinates.x < posX + width &&
      this.mouseCoordinates.y > posY &&
      this.mouseCoordinates.y < posY + height
    ) {
      return true;
    }
    return false;
  }
}
