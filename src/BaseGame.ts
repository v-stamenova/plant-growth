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

  private currentDate: string;

  private maxFieldBoundaries: number[];

  public constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.keyListener = new KeyListener();
    this.mouseListener = new MouseListener(canvas);
    this.fields = [];
    this.maxFieldBoundaries = [];
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
    let { xSpeed, ySpeed } = { xSpeed: 0, ySpeed: 0 };
    const cameraSpeed: number = 15;
    if (this.keyListener.isKeyDown('ArrowDown')) {
      ySpeed -= cameraSpeed;
    }
    if (this.keyListener.isKeyDown('ArrowUp')) {
      ySpeed += cameraSpeed;
    }
    if (this.keyListener.isKeyDown('ArrowLeft')) {
      xSpeed += cameraSpeed;
    }
    if (this.keyListener.isKeyDown('ArrowRight')) {
      xSpeed -= cameraSpeed;
    }

    // getting the maximum x and y positions for the fields to use as boundaries
    const maxPosX: number = Math.max(...this.fields.map((field: Field) =>
      field.getPosition()[0] ?? 0));
    const maxPosY: number = Math.max(...this.fields.map((field: Field) =>
      field.getPosition()[1] ?? 0));
    const minPosX: number = Math.min(...this.fields.map((field: Field) =>
      field.getPosition()[0] ?? 0));
    const minPosY: number = Math.min(...this.fields.map((field: Field) =>
      field.getPosition()[1] ?? 0));
    const [fieldWidth, fieldHeight]: number[] =
      [this.fields[0]?.getDimensions?.()[0] ?? 0, this.fields[0]?.getDimensions?.()[1] ?? 0];

    // makes sure fields don't move if the camera gets out of the field boundaries
    if ((maxPosX ?? 0) <= this.canvas.width - (fieldWidth ?? 0) * 1.5) {
      xSpeed += cameraSpeed;
    }
    if ((maxPosY ?? 0) <= this.canvas.height - (fieldHeight ?? 0) * 1.5) {
      ySpeed += cameraSpeed;
    }
    if ((minPosX ?? 0) >= (fieldWidth ?? 0) / 2) {
      xSpeed -= cameraSpeed;
    }
    if ((minPosY ?? 0) >= (fieldHeight ?? 0) / 2) {
      ySpeed -= cameraSpeed;
    }

    this.fields.forEach((field: Field) => {
      field.move(xSpeed, ySpeed);
    });
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
    CanvasRenderer.clearCanvas(this.canvas);
    this.fields.forEach((field: Field) => field.render(this.canvas));
    CanvasRenderer.writeText(this.canvas, this.currentDate, 20, 50, 'left', 'sans-serif', 40, 'blue');
  }
}
