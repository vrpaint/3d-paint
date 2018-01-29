import World from './world/World';
import './index.css';

const canvasElement = document.getElementById("scene") as HTMLCanvasElement;

const world = new World(canvasElement);
world.run();
console.log(world);
