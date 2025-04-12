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

        // here, the 0.3 stands for 30% for the canvas.
        // as in, canvas.width * 0.3 is done in the class to render
        // this is done because the canvas dimensions can change, and if they are initialised
        // at posX = canvas.width * 0.3, it wont change if the canvas size changes
        this.dateSlider = new Slider(0.2, 0.025, 0.37, 0, this.dates.length - 1, 0, 0);

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

    let { xSpeed, ySpeed } = { xSpeed: 0, ySpeed: 0 };
    const cameraSpeed: number = 15;
    if (this.keyListener.isKeyDown('ArrowDown') || this.keyListener.isKeyDown('KeyS')) {
      ySpeed -= cameraSpeed;
    }
    if (this.keyListener.isKeyDown('ArrowUp') || this.keyListener.isKeyDown('KeyW')) {
      ySpeed += cameraSpeed;
    }
    if (this.keyListener.isKeyDown('ArrowLeft') || this.keyListener.isKeyDown('KeyA')) {
      xSpeed += cameraSpeed;
    }
    if (this.keyListener.isKeyDown('ArrowRight') || this.keyListener.isKeyDown('KeyD')) {
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
    if ((maxPosY ?? 0) <= this.canvas.height - (fieldHeight ?? 0) * 10) {
      ySpeed += cameraSpeed;
    }
    if ((minPosX ?? 0) >= (fieldWidth ?? 0) / 2) {
      xSpeed -= cameraSpeed;
    }
    if ((minPosY ?? 0) >= (fieldHeight ?? 0) * 1.5) {
      ySpeed -= cameraSpeed;
    }

    this.fields.forEach((field: Field) => {
      field.move(xSpeed, ySpeed);
    });

    // input processing for fields
    // turns off info panel for all fields except the one clicked
    // if anything else is clicked, it closes the info panel again
    this.fields.forEach((field: Field) => {
      if (field.isHover(this.mouseListener)) {
        if (this.mouseListener.buttonPressed(0)) {
          if (field.openInfoPanel) {
            field.openInfoPanel = false;
          } else {
            this.fields.forEach((otherField: Field) => {
              otherField.openInfoPanel = false;
            });
            field.openInfoPanel = true;
          }
        }
      }
    });

    // only resets the info overlay if the user isnt changing the slider
    // this way, the user can see the plant change over time in the info overlay
    if (this.mouseListener.buttonPressed(0) && !this.dateSlider.holding) {
      this.fields.map((field: Field) => field.openInfoPanel = false);
    }
  }

  /**
   * Update game state. Called from the GameLoop
   *
   * @param elapsed time in ms elapsed from the GameLoop
   * @returns true if the game should continue
   */
  public update(elapsed: number): boolean {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

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
    this.fields.forEach((field: Field) => {
      if (field.openInfoPanel) {
        field.renderInfoPanel(this.canvas, this.dateSlider.activeValue);
      }
    });
    this.dateSlider.render(this.canvas);
    CanvasRenderer.writeText(this.canvas, `Current: ${this.currentDate}`, this.canvas.width * 0.4, this.canvas.height * 0.1, 'center', 'sans-serif', 30, 'black', true);
    CanvasRenderer.writeText(this.canvas, this.dates[0] ?? '', this.canvas.width * 0.17, this.canvas.height * 0.045, 'right', 'system-ui', 20, 'black', true);
    CanvasRenderer.writeText(this.canvas, this.dates[this.dates.length - 1] ?? '', this.canvas.width * 0.6, this.canvas.height * 0.045, 'left', 'system-ui', 20, 'black', true)
  }
}
