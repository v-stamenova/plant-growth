import CanvasRenderer from '../CanvasRenderer.js';
import Plot from './Plot.js';

export default class Field {
  private posX: number;
  private posY: number;
  private width: number;
  private height: number;
  private plantMaxRadius: number;
  private plots: Plot[];
  private name: string;

  public constructor(name: string, posX: number, posY:number, plantMaxRadius: number) {
    this.posX = posX;
    this.posY = posY;
    this.width = plantMaxRadius * 2 * 4 + (plantMaxRadius * 0.9);
    this.height = plantMaxRadius * 2 * 2 + + (plantMaxRadius * 0.5);
    this.plantMaxRadius = plantMaxRadius;
    this.plots = [];
    this.name = name;
    this.fillPlots();
  }

  public fillPlots() {
    let index: number = 0;
    let centerX: number = this.posX + this.plantMaxRadius * 1.3;
    let centerY: number = this.posY + this.plantMaxRadius * 1.2;
    while (index < 8) {
      this.plots.push(new Plot(centerX, centerY, this.plantMaxRadius));
      centerX += this.plantMaxRadius * 2.1;

      if(index == 3){
        centerX = this.posX + this.plantMaxRadius * 1.3;
        centerY += this.plantMaxRadius * 2.1;
      }

      index += 1;
    }
  }

  public update(elapsed: number): boolean {
    this.plots.forEach((plot: Plot) => plot.update(elapsed));
    return true;
  }

  public render(canvas: HTMLCanvasElement): void {
    CanvasRenderer.drawRectangle(canvas, this.posX, this.posY, this.width, this.height, '#240404', '#240404');
    this.plots.forEach((plot: Plot) => plot.render(canvas));
    CanvasRenderer.writeText(canvas, this.name, (this.width / 2) + this.posX , this.height + this.posY + 20, 'center');
  }
}