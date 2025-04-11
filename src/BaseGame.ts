import Game from './Game.js';

import CanvasRenderer from './CanvasRenderer.js';
import KeyListener from './KeyListener.js';
import MouseListener from './MouseListener.js';
import Plot from './objects/Plot.js';
import Field from './objects/Field.js';
import DataReader from './helpers/DataReader.js';
import Observation from './objects/Observation.js';
import Slider from './objects/Slider.js';

export default class BaseGame extends Game {
  private canvas: HTMLCanvasElement;

  private keyListener: KeyListener;

  private mouseListener: MouseListener;

  private reader: DataReader;

  private fields: Field[];

  private currentDate: string;

  private dates: string[];

  private dateSlider: Slider;

  public constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.keyListener = new KeyListener();
    this.mouseListener = new MouseListener(canvas);
    this.fields = [];
    this.currentDate = '';
    this.dates = [];
    this.dateSlider = new Slider(0, 0, 0);


    this.reader = new DataReader('../data/rilland_2022.csv');
    this.reader.load()
      .then((data: Field[]) => {
        this.fields = data;
        this.currentDate = this.fields[0]?.getDate() ?? '';
        this.dates = this.fields[0]?.getDates() ?? [];
        this.dateSlider = new Slider(window.innerWidth * 0.3, window.innerHeight * 0.025, window.innerWidth * 0.2, 0, this.dates.length - 1, 0, 0)

        console.log('CSV Data:', data);
      })
      .catch((err: Error) => {
        console.error('Error loading CSV:', err);
      });
  }

  /**
   * Process all input. Called from the GameLoop.
   */
  public processInput(): void {
    this.dateSlider.processInput(this.mouseListener);
  }

  /**
   * Update game state. Called from the GameLoop
   *
   * @param elapsed time in ms elapsed from the GameLoop
   * @returns true if the game should continue
   */
  public update(elapsed: number): boolean {
    this.fields.forEach((field: Field) => field.update(elapsed, this.dateSlider.activeValue));
    this.currentDate = this.dates[this.dateSlider.activeValue] ?? '';
    return true;
  }

  /**
   * Render all the elements in the screen.
   */
  public render(): void {
    CanvasRenderer.clearCanvas(this.canvas);
    this.fields.forEach((field: Field) => field.render(this.canvas));
    CanvasRenderer.writeText(this.canvas, this.currentDate, 20, 50, 'left', 'sans-serif', 40, 'blue');
    this.dateSlider.render(this.canvas);
    CanvasRenderer.writeText(this.canvas, this.dates[0] ?? '', this.canvas.width * 0.215, this.canvas.height * 0.045, 'left', 'system-ui', 20, 'blue')
    CanvasRenderer.writeText(this.canvas, this.dates[this.dates.length - 1] ?? '', this.canvas.width * 0.55, this.canvas.height * 0.045, 'left', 'system-ui', 20, 'blue')
  }
}
