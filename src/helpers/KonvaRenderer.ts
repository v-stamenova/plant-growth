import Konva from 'konva';

export default class KonvaRenderer {
  /**
   * Helper to get the first layer from the stage or create one if none exists.
   *
   * @param stage the Konva stage to operate on
   * @returns a Konva.Layer instance
   */
  private static getLayer(stage: Konva.Stage): Konva.Layer {
    let layer = stage.getLayers()[0];
    if (!layer) {
      layer = new Konva.Layer();
      stage.add(layer);
    }
    return layer;
  }

  /**
   * Fill the entire stage with a specified colour.
   *
   * @param stage the Konva stage
   * @param colour the fill colour (default is '#FF10F0')
   */
  public static fillCanvas(stage: Konva.Stage, colour: string = '#FF10F0'): void {
    const layer = KonvaRenderer.getLayer(stage);
    const rect = new Konva.Rect({
      x: 0,
      y: 0,
      width: stage.width(),
      height: stage.height(),
      fill: colour,
    });
    layer.add(rect);
    layer.draw();
  }

  /**
   * Clear the stage by removing all shapes from its layer.
   *
   * @param stage the Konva stage
   */
  public static clearCanvas(stage: Konva.Stage): void {
    const layer = KonvaRenderer.getLayer(stage);
    layer.destroyChildren();
    layer.draw();
  }

  /**
   * Write text on the stage.
   *
   * @param stage the Konva stage
   * @param text the text to display
   * @param xCoordinate the x-coordinate for the text
   * @param yCoordinate the y-coordinate for the text
   * @param alignment text alignment ('center', 'left', or 'right')
   * @param fontFamily the font family (default is 'sans-serif')
   * @param fontSize the font size in pixels (default is 20)
   * @param color the text colour (default is 'red')
   */
  public static writeText(
    stage: Konva.Stage,
    text: string,
    xCoordinate: number,
    yCoordinate: number,
    alignment: 'center' | 'left' | 'right' = 'center',
    fontFamily: string = 'sans-serif',
    fontSize: number = 20,
    color: string = 'red'
  ): void {
    const layer = KonvaRenderer.getLayer(stage);
    const konvaText = new Konva.Text({
      x: xCoordinate,
      y: yCoordinate,
      text: text,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fill: color,
      align: alignment,
    });
    layer.add(konvaText);
    layer.draw();
  }

  /**
   * Draw a circle on the stage.
   *
   * @param stage the Konva stage
   * @param centerX the x-coordinate of the circle's center
   * @param centerY the y-coordinate of the circle's center
   * @param radius the circle's radius
   * @param color the stroke colour of the circle (default is 'red')
   * @param fillColor optional fill colour for the circle
   */
  public static drawCircle(
    stage: Konva.Stage,
    centerX: number,
    centerY: number,
    radius: number,
    color: string = 'red',
    fillColor?: string
  ): void {
    const layer = KonvaRenderer.getLayer(stage);
    const konvaCircle = new Konva.Circle({
      x: centerX,
      y: centerY,
      radius: radius,
      stroke: color,
      strokeWidth: 2,
      fill: fillColor,
    });
    layer.add(konvaCircle);
    layer.draw();
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
    stage: Konva.Stage,
    dx: number,
    dy: number,
    width: number,
    height: number,
    color: string = 'red',
    fillColor?: string,
  ): void {
    const layer = KonvaRenderer.getLayer(stage);
    const konvaRect = new Konva.Rect({
      x: dx,
      y: dy,
      width: width,
      height: height,
      strokeWidth: 2,
      stroke: color,
      fill: fillColor,
    });
    layer.add(konvaRect);
    layer.draw();
  }
}
