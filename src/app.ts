import BaseGame from './BaseGame.js';
import Konva from 'konva';


const stage = new Konva.Stage({
  container: 'konva-game', // matches the id of the container div
  width: 3000,
  height: 3000,
});

const layer = new Konva.Layer();
stage.add(layer);

const game: BaseGame = new BaseGame(stage);

window.addEventListener('load', () => {
  game.start();
});
