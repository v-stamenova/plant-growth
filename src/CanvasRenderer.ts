/**
 * Helper utlity class for working with the HTML Canvas Element.
 *
 * @version 1.2.0
 * @author Frans Blauw
 */

export default class CanvasRenderer {
  /**
   * Retrieving the canvas context
   * @param canvas the canvas on which will be drawn
   * @returns the 2D rendering context of the canvas
   */
  private static getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (ctx === null) {
      throw new Error('Canvas Rendering Context is null');
    }
    return ctx;
  }

  /**
   * Fill the canvas with a colour
   *
   * @param canvas canvas that requires filling
   * @param colour the colour that the canvas will be filled with
   */
  public static fillCanvas(canvas: HTMLCanvasElement, colour: string = '#FF10F0'): void {
    const ctx: CanvasRenderingContext2D = CanvasRenderer.getCanvasContext(canvas);
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colour;
    ctx.fill();
  }

  /**
   * Loads a new image into an HTMLImageElement
   * WARNING: This happens async. Therefor the result might not immediately be visible
   *
   * @param source the path of the image to be loaded
   * @returns the image
   */
  public static loadNewImage(source: string): HTMLImageElement {
    const img: HTMLImageElement = new Image();
    img.src = source;
    return img;
  }

  /**
   * Drawing the image on the canvas
   * @param canvas that canvas that it should be drawn on
   * @param image the image to be drawn
   * @param dx x-coordinate
   * @param dy y-coordinate
   */
  public static drawImage(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    dx: number,
    dy: number
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasRenderer.getCanvasContext(canvas);
    ctx.drawImage(image, dx, dy);
  }

  /**
   * Drawing an image with dimensions
   * @param canvas - The canvas element.
   * @param image - The image element to draw.
   * @param dx - The x-coordinate of where the image is drawn.
   * @param dy - The y-coordinate of where the image is drawn.
   * @param dw - The width of the drawn image.
   * @param dh - The height of the drawn image.
   */
  public static drawImageDimensions(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasRenderer.getCanvasContext(canvas);
    ctx.drawImage(image, dx, dy, dw, dh);
  }

  /**
   * Drawing an image with dimensions and rotation around its center
   * @param canvas - The canvas element.
   * @param image - The image element to draw.
   * @param dx - The x-coordinate of where the image is drawn.
   * @param dy - The y-coordinate of where the image is drawn.
   * @param dw - The width of the drawn image.
   * @param dh - The height of the drawn image.
   * @param radD - A multiplier for π to determine the rotation in radians.
   */
  public static drawImageDimensionsRotation(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
    radD: number,
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasRenderer.getCanvasContext(canvas);
    ctx.save();
    ctx.translate(dx + dw / 2, dy + dh / 2);
    ctx.rotate(Math.PI * radD);
    ctx.drawImage(image, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  }


  /**
   * Clear the canvas, preparing for drawing
   *
   * @param canvas canvas to be cleared
   */
  public static clearCanvas(canvas: HTMLCanvasElement): void {
    const ctx: CanvasRenderingContext2D = CanvasRenderer.getCanvasContext(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * Writing text on the canvas
   * @param canvas Canvas to write to
   * @param text Text to write
   * @param xCoordinate x-coordinate of the text
   * @param yCoordinate y-coordinate of the text
   * @param alignment align of the text
   * @param fontFamily font family to use when writing text
   * @param fontSize font size in pixels
   * @param color colour of text to write
   */
  public static writeText(
    canvas: HTMLCanvasElement,
    text: string,
    xCoordinate: number,
    yCoordinate: number,
    alignment: CanvasTextAlign = 'center',
    fontFamily: string = 'sans-serif',
    fontSize: number = 20,
    color: string = 'red',
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasRenderer.getCanvasContext(canvas);
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = alignment;
    ctx.fillText(text, xCoordinate, yCoordinate);
  }

  /**
   * Draw a circle outline on the canvas
   *
   * @param canvas the canvas to draw to
   * @param centerX the x-coordinate of the center of the circle
   * @param centerY the y-coordinate of the center of the circle
   * @param radius the radius of the circle
   * @param color the color of the circle outline
   * @param fillColor the color the fill
   */
  public static drawCircle(
    canvas: HTMLCanvasElement,
    centerX: number,
    centerY: number,
    radius: number,
    color: string = 'red',
    fillColor?: string
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasRenderer.getCanvasContext(canvas);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);

    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    ctx.stroke();
  }

  /**
   * Draw a rectangle outline to the canvas
   *
   * @param canvas the canvas to draw to
   * @param dx the x-coordinate of the rectangle's left left corner
   * @param dy the y-coordinate of the rectangle's left left corner
   * @param width the width of the rectangle from x to the right
   * @param height the height of the rectrangle from y downwards
   * @param color the color of the rectangle outline
   * @param fillColor the color the fill
   */
  public static drawRectangle(
    canvas: HTMLCanvasElement,
    dx: number,
    dy: number,
    width: number,
    height: number,
    color: string = 'red',
    fillColor?: string,
    opacity: number = 1,
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasRenderer.getCanvasContext(canvas);
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.rect(dx, dy, width, height);

    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    ctx.stroke();
    ctx.restore();
  }

  /**
   * Draw a filled rectangle with a gradient to the canvas.
   * example of usecase is in Field.renderInfoPanel()
   *
   * @param canvas the canvas to draw to
   * @param dx the x-coordinate of the rectangle's left left corner
   * @param dy the y-coordinate of the rectangle's left left corner
   * @param width the width of the rectangle from x to the right
   * @param height the height of the rectrangle from y downwards
   * @param colors an array of color stops for the gradient,
   * each color is an object with properties `color` and `stop`
   * @param angle the angle of the gradient in degrees (not radians)
   * @param borderRadius the border radius of the rectangle
   */
  public static fillRectangleWithGradient(
    canvas: HTMLCanvasElement,
    dx: number,
    dy: number,
    width: number,
    height: number,
    colors: {
      red: number;
      green: number;
      blue: number;
      opacity: number;
      stop: number;
    }[],
    angle: number = 0,
    borderRadius: number = 0
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasRenderer.getCanvasContext(canvas);
    ctx.beginPath();

    ctx.moveTo(dx + borderRadius, dy);
    ctx.lineTo(dx + width - borderRadius, dy);
    ctx.arcTo(dx + width, dy, dx + width, dy + borderRadius, borderRadius);
    ctx.lineTo(dx + width, dy + height - borderRadius);
    ctx.arcTo(dx + width, dy + height, dx + width - borderRadius, dy + height, borderRadius);
    ctx.lineTo(dx + borderRadius, dy + height);
    ctx.arcTo(dx, dy + height, dx, dy + height - borderRadius, borderRadius);
    ctx.lineTo(dx, dy + borderRadius);
    ctx.arcTo(dx, dy, dx + borderRadius, dy, borderRadius);
    ctx.closePath();

    // Calculate gradient start and end points based on angle
    const radians: number = angle * (Math.PI / 180);
    const x0: number = dx + width / 2 + (width / 2) * Math.cos(radians);
    const y0: number = dy + height / 2 - (height / 2) * Math.sin(radians);
    const x1: number = dx + width / 2 - (width / 2) * Math.cos(radians);
    const y1: number = dy + height / 2 + (height / 2) * Math.sin(radians);

    const gradient: CanvasGradient = ctx.createLinearGradient(x0, y0, x1, y1);

    colors.forEach(({
      red, green, blue, opacity, stop,
    }: { red: number; green: number; blue: number; opacity: number; stop: number }) => {
      const color: string = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
      gradient.addColorStop(stop, color);
    });

    ctx.fillStyle = gradient;
    ctx.fill();
  }

  /**
   * Draw line to the canvas
   *
   * @param canvas selected canvas
   * @param x1 x position of the starting point of drawn line
   * @param y1 y position of the starting point of drawn line
   * @param x2 x position of the ending point of drawn line
   * @param y2 y position of the ennding point of drawn line
   * @param color the color of the line
   * @param opacity the opacity of the line
   * @param lineWidth the width of the line
   */
  public static drawLine(canvas: HTMLCanvasElement, x1: number, y1: number, x2: number, y2: number, color: string='black', opacity: number = 1): void {
    const ctx: CanvasRenderingContext2D = CanvasRenderer.getCanvasContext(canvas);
    ctx.beginPath();

    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.stroke();
  }

  /**
   * Draw a filled circle on the canvas
   *
   * @param canvas the canvas to draw to
   * @param centerX the x-coordinate of the center of the circle
   * @param centerY the y-coordinate of the center of the circle
   * @param radius the radius of the circle
   * @param color the color of the circle
   */
  public static fillCircle(
    canvas: HTMLCanvasElement,
    centerX: number,
    centerY: number,
    radius: number,
    color: string = 'red',
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasRenderer.getCanvasContext(canvas);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  /**
   * Draw a filled rectangle to the canvas
   *
   * @param canvas the canvas to draw to
   * @param dx the x-coordinate of the rectangle's left left corner
   * @param dy the y-coordinate of the rectangle's left left corner
   * @param width the width of the rectangle from x to the right
   * @param height the height of the rectrangle from y downwards
   * @param color the color of the rectangle
   */
  public static fillRectangle(
    canvas: HTMLCanvasElement,
    dx: number,
    dy: number,
    width: number,
    height: number,
    color: string = 'red',
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasRenderer.getCanvasContext(canvas);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(dx, dy, width, height);
    ctx.fill();
  }
}
