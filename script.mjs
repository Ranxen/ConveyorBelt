import { Game } from "./Game.mjs";


let game;

function setup() {
    game = new Game();
}


window.onload = () => {
    setup();
};


window.addEventListener('resize', () => {
    if (game) {
        game.resize();
    }
});