import * as PIXI from "pixi.js";
import Sound from "pixi-sound";
import Stats from "stats.js";
import { Game } from "./Game";
import { CONFIG } from "./config";
import '../public/css/app.css';

const app = new PIXI.Application({
    width: CONFIG.GAME_WIDTH,
    height: CONFIG.GAME_HEIGHT,
    backgroundColor: 0x1099bb,
    resizeTo: window 
});

let game;

function init() {
    document.body.appendChild(app.view);
    window.addEventListener('resize', resize);
    resize();
    setup();
}

function setup() {
    game = new Game(app);
    // let stats = new Stats();
    // stats.showPanel(0);
    // document.body.appendChild(stats.dom);

    app.ticker.add((delta) => {
        // stats.begin();
        // stats.end();
    });
}

function resize() {
    game?.resize();
    const width = window.innerWidth;
    const height = window.innerHeight;

    app.view.style.position = 'absolute';
    app.view.style.left = `${(width - app.renderer.width) / 2}px`;
    app.view.style.top = `${(height - app.renderer.height) / 2}px`;
}

init();