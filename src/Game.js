import { Board } from "./board/Board";
import { UI } from "./ui/UI";

export class Game {
    constructor(app) {
        this.app = app;
        this.create();
    }

    create() {
        this.ui = new UI(this.app);
        this.board = new Board(this.app);
        this.board.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2);

        this.app.stage.addChild(this.board, this.ui);
        this.resize();
    }

    resize() {
        this.ui.resize(this.app.renderer.width, this.app.renderer.height);
        this.board.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2);
    }
}
