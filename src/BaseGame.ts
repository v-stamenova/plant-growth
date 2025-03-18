import Game from './Game.js';

import CanvasRenderer from './CanvasRenderer.js';
import KeyListener from './KeyListener.js';
import MouseListener from './MouseListener.js';
import Plot from './objects/Plot.js';
import Field from './objects/Field.js';
import DataReader from './helpers/DataReader.js';
import Observation from './objects/Observation.js';
import Konva from 'konva';
import KonvaRenderer from './helpers/KonvaRenderer.js';

export default class BaseGame extends Game {
  private stage: Konva.Stage;

  private reader: DataReader;

  private fields: Field[];

  private currentDate: string;

  public constructor(stage: Konva.Stage) {
    super();
    this.stage = stage;
    this.fields = [];
    this.currentDate = '';

    this.reader = new DataReader('../data/rilland_2022.csv');
    this.reader.load()
      .then((data: Field[]) => {
        this.fields = data;
        this.currentDate = this.fields[0]?.getDate() ?? '';
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
    this.currentDate = this.fields[0]?.getDate() ?? '';

    return true;
  }

  /**
   * Render all the elements in the screen.
   */
  public render(): void {
    KonvaRenderer.clearCanvas(this.stage);
    this.fields.forEach((field: Field) => field.render(this.stage));
    KonvaRenderer.writeText(this.stage, this.currentDate, 20, 50, 'left', 'sans-serif', 40, 'blue');
  }
}
