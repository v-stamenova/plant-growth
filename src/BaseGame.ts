import Game from './Game.js';

import CanvasRenderer from './CanvasRenderer.js';
import KeyListener from './KeyListener.js';
import MouseListener from './MouseListener.js';
import Plot from './objects/Plot.js';
import Field from './objects/Field.js';
import DataReader from './helpers/DataReader.js';
import Observation from './objects/Observation.js';

export default class BaseGame extends Game {
  private canvas: HTMLCanvasElement;

  private keyListener: KeyListener;

  private mouseListener: MouseListener;

  private reader: DataReader;

  private fields: Field[];

  public constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.keyListener = new KeyListener();
    this.mouseListener = new MouseListener(canvas);
    this.fields = [];

    this.reader = new DataReader('../data/sample.csv');
    this.reader.load()
      .then((data: Field[]) => {
        this.fields = data;
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

  }

  /**
   * Update game state. Called from the GameLoop
   *
   * @param elapsed time in ms elapsed from the GameLoop
   * @returns true if the game should continue
   */
  public update(elapsed: number): boolean {
    this.fields.forEach((field: Field) => field.update(elapsed));
    return true;
  }

  /**
   * Render all the elements in the screen.
   */
  public render(): void {
    this.fields.forEach((field: Field) => field.render(this.canvas));
  }
}
