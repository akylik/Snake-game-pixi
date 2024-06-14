import { Container, Graphics, Text } from "pixi.js";
import { Button } from "./Button";
import { EVENTS } from "../Events";
import { TextStyles } from "../TextStyles";
import { CONFIG } from "../config";

export class UI extends Container {
  constructor(app) {
    super();
    this.app = app;
    console.log("🚀 ~ UI ~ constructor ~ this.app:", this.app)

    this.bestScore = 0;
    this.currentScore = 0;

    this.defaultGameMode = CONFIG.gameModes[0].value;
    this.gameModes = CONFIG.gameModes;
    this.selectedGameMode = this.defaultGameMode;

    this.createUI();
    this.addKeyboardListeners();
    this.addListeners();
    this.resize();
  }

  resize(width, height) {
    this.topPanelUI.position.set(width * 0.5 - this.topPanelUI.width * 0.5, 50);
    this.bottomPanelUI.position.set(width * 0.5 - this.bottomPanelUI.width * 0.5, height * 0.9);
  }

  createUI() {
    this.topPanelUI = new Container();
    this.bottomPanelUI = new Container();
    this.addChild(this.topPanelUI, this.bottomPanelUI);

    this.bestScoreLabel = new Text(
      `Best score: ${this.bestScore}`,
      TextStyles.main_style
    );
    this.bestScoreLabel.anchor.set(0.5);
    this.bestScoreLabel.position.set(50, 0);
    this.topPanelUI.addChild(this.bestScoreLabel);

    this.currentScoreLabel = new Text(
      `Current score: ${this.currentScore}`,
      TextStyles.main_style
    );
    this.currentScoreLabel.anchor.set(0.5);
    this.currentScoreLabel.position.set(400, 0);
    this.topPanelUI.addChild(this.currentScoreLabel);

    this.gameOverLabel = new Text(`Game Over`, TextStyles.selected_style);
    this.gameOverLabel.anchor.set(0.5);
    this.gameOverLabel.position.set(220, 0);
    this.gameOverLabel.visible = false;
    this.topPanelUI.addChild(this.gameOverLabel);

    this.playBtn = new Button("Play", EVENTS.signals.start_game);
    this.playBtn.position.set(50, 0);
    this.bottomPanelUI.addChild(this.playBtn);

    this.menuBtn = new Button("Menu", EVENTS.signals.resume_game);
    this.menuBtn.position.set(320, 0);
    this.menuBtn.hide();
    this.bottomPanelUI.addChild(this.menuBtn);

    this.exitBtn = new Button("Exit", EVENTS.signals.game_restart);
    this.exitBtn.position.set(190, 0);
    this.bottomPanelUI.addChild(this.exitBtn);

    this.createRadioList();

    this.addChild(
      ...this.radioButtons
    );
  }

  createRadioList() {
    this.radioButtons = this.gameModes.map((mode, index) => {
      const buttonContainer = new Container();

      const circle = new Graphics();
      circle.beginFill(0xffffff);
      circle.lineStyle(2, 0x000000);
      circle.drawCircle(0, 0, 15);
      circle.endFill();

      const buttonText = new Text(mode.name, TextStyles.main_style);
      buttonText.anchor.set(0, 0.5);
      buttonText.position.set(20, 0);

      buttonContainer.addChild(circle, buttonText);
      buttonContainer.position.set(40, 100 + index * 40);
      buttonContainer.interactive = true;
      buttonContainer.buttonMode = true;

      buttonContainer.on("pointerdown", () => {
        this.selectGameMode(mode.value);
        document.dispatchEvent(new Event(EVENTS.signals.game_restart));
      });

      buttonContainer.circle = circle;
      buttonContainer.buttonText = buttonText;

      return buttonContainer;
    });

    this.updateRadioList();
  }

  selectGameMode(mode) {
    this.selectedGameMode = mode;
    this.updateRadioList();
    document.dispatchEvent(
      new CustomEvent(EVENTS.signals.change_game_mode, {
        detail: mode,
      })
    );
  }

  updateRadioList() {
    this.radioButtons.forEach((buttonContainer) => {
      const isSelected =
        CONFIG.gameModes.find(
          (mode) => mode.name === buttonContainer.buttonText.text
        ).value === this.selectedGameMode;
      buttonContainer.circle.tint = isSelected ? 0xff0000 : 0xffffff;
      buttonContainer.buttonText.style = isSelected
        ? TextStyles.selected_style
        : TextStyles.main_style;
    });
  }

  onKeyDown(event) {
    let direction;
    switch (event.code) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
    document.dispatchEvent(
      new CustomEvent(EVENTS.signals.change_direction, {
        detail: direction,
      })
    );
  }

  addKeyboardListeners() {
    window.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  addListeners() {
    document.addEventListener(EVENTS.signals.start_game, () => {
      this.menuBtn.show();
      this.playBtn.hide();
      this.exitBtn.hide();
    });

    document.addEventListener(EVENTS.signals.resume_game, () => {
      this.playBtn.show();
      this.exitBtn.show();
      this.menuBtn.hide();
    });

    document.addEventListener(EVENTS.signals.game_restart, () => {
      this.currentScore = 0;
      this.currentScoreLabel.text = `Current score: ${this.currentScore}`;
      this.playBtn.show();
      this.exitBtn.show();
      this.menuBtn.hide();
      this.gameOverLabel.visible = false;
    });

    document.addEventListener(EVENTS.game_end, () => {
      this.gameOverLabel.visible = true;
      this.exitBtn.show();
      this.menuBtn.hide();
    });

    document.addEventListener(EVENTS.signals.increase_score, () => {
      this.currentScore += 10;
      this.bestScore =
        this.currentScore > this.bestScore ? this.currentScore : this.bestScore;
      this.bestScoreLabel.text = `Best score: ${this.bestScore}`;
      this.currentScoreLabel.text = `Current score: ${this.currentScore}`;
    });
  }
}
