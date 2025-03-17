/**
 * Helper utlity class for working with the HTML Canvas Element.
 *
 * @version 1.2.0
 * @author Frans Blauw
 */

export default class CanvasRenderer {
  /**
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
   *
   * @param canvas that canvas that it should be drawn on
   * @param image the image to be drawn
   * @param dx x-coordinate
   * @param dy y-coordinate
   */
  public static drawImage(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    dx: number,
    dy: number,
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasRenderer.getCanvasContext(canvas);
    ctx.drawImage(image, dx, dy);
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
   *
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

  public static drawIrregularPlantishShape(
    canvas: HTMLCanvasElement,
    centerX: number,
    centerY: number,
    radius: number,
    hue: number, // e.g., 120 for a greenish tone,
    asc: boolean
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasRenderer.getCanvasContext(canvas);
    ctx.beginPath();
    
    const numPoints = 30;                // More points yield a smoother but irregular shape
    const variation = 0.15 * radius;       // Adjust the variation factor for more/less irregularity
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      // Randomize the radius for each point around the circle
      const randomRadius = radius + (Math.random() - 0.5) * variation * 2;
      const x = centerX + randomRadius * Math.cos(angle);
      const y = centerY + randomRadius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    
    // Create a radial gradient using HSL colors based on the given hue.
    // Here, the saturation is fixed at 70%, while lightness varies to create depth.
    const gradient = ctx.createRadialGradient(
      centerX, centerY, radius * 0.1,
      centerX, centerY, radius
    );
    
    // Inner color is lighter, mid is base, outer is darker.

    if (asc) {
      gradient.addColorStop(0, `hsl(120, 70%, ${hue}%)`);
      gradient.addColorStop(0.5, `hsl(120, 70%, ${hue}%)`);
      gradient.addColorStop(1, `hsl(120, 70%, ${hue}%)`);
    } else {
      gradient.addColorStop(0, `hsl(${hue}, 70%, 50%)`);
      gradient.addColorStop(0.5, `hsl(${hue}, 70%, 50%)`);
      gradient.addColorStop(1, `hsl(${hue}, 70%, 50%)`);
    }
    
    ctx.fillStyle = gradient;
    // Use a slightly darker outline to maintain consistency.
    ctx.strokeStyle = `hsl(${hue}, 70%, 35%)`;
    ctx.fill();
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
  ): void {
    const ctx: CanvasRenderingContext2D = CanvasRenderer.getCanvasContext(canvas);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.rect(dx, dy, width, height);
    
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

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
