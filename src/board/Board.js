import { Container, Graphics } from "pixi.js";
import { EVENTS } from "../Events";
import { CONFIG } from "../config";

export class Board extends Container {
  constructor(app) {
    super();
    this.app = app.stage;
    this.snake = [];
    this.walls = [];
    this.speed = CONFIG.GAME_SPEED;
    this.gameMode = CONFIG.gameModes[0].value;
    this.direction = "left";
    this.isPlaying = false;

    this.gameLoop = setInterval(this.update.bind(this), this.speed);
    this.createBoard();
    this.createSnake();
    this.createFood();

    this.addListeners();
  }

  handleDirectionChange(event) {
    const newDirection = event.detail;
    const oppositeDirections = {
      up: "down",
      down: "up",
      left: "right",
      right: "left",
    };

    if (oppositeDirections[this.direction] !== newDirection) {
      this.direction = newDirection;
    }
  }

  handleGameModeChange(event) {
    this.gameMode = event.detail;
    this.createFood(this.gameMode === "portal");
  }

  update() {
    if (!this.isPlaying) {
      return;
    }
    let head = { x: this.snake[0].x, y: this.snake[0].y };

    switch (this.direction) {
      case "up":
        head.y -= 20;
        break;
      case "down":
        head.y += 20;
        break;
      case "left":
        head.x -= 20;
        break;
      case "right":
        head.x += 20;
        break;
    }

    if (this.gameMode === "no_die") {
      if (head.x < -200) head.x = 200 - 20;
      if (head.x > 180) head.x = -200;
      if (head.y < -200) head.y = 200 - 20;
      if (head.y > 180) head.y = -200;
    } else {
        // Check for collision with walls or self (classic mode)
      if (
        head.x < -200 ||
        head.x > 180 ||
        head.y < -200 ||
        head.y > 180 ||
        this.isCollision(head) ||
        this.isWallCollision(head)
      ) {
        this.endGame();
        return;
      }
    }

    // Check for collision with food
    if (this.isFoodCollision(head)) {
      if (this.gameMode === "portal") {
        // Teleport to the second food cell and grow the snake
        if (head.x === this.food1.x && head.y === this.food1.y) {
          head.x = this.food2.x;
          head.y = this.food2.y;
        } else if (head.x === this.food2.x && head.y === this.food2.y) {
          head.x = this.food1.x;
          head.y = this.food1.y;
        }

        // Remove the eaten food and create new food cells
        this.removeChild(this.food1);
        this.removeChild(this.food2);
        this.createFood(true);
      } else {
        this.createFood(this.gameMode === "portal");
      }

      if (this.gameMode === "walls") {
        this.createWall();
      }
      
      document.dispatchEvent(new Event(EVENTS.signals.increase_score));

      // Game Mode: Speed - Speed up by 10%
      if (this.gameMode === "speed") {
        this.speed *= 0.9;
        clearInterval(this.gameLoop);
        this.gameLoop = setInterval(this.update.bind(this), this.speed);
      }
    } else {
      // Remove the last segment if not in No die mode
      const tail = this.snake.pop();
      this.removeChild(tail);
    }

    // Create a new head segment
    const newHead = new Graphics();
    newHead.beginFill(0x00ff00);
    newHead.drawRect(0, 0, 20, 20);
    newHead.endFill();
    newHead.x = head.x;
    newHead.y = head.y;

    // Add the new head to the snake
    this.snake.unshift(newHead);
    this.addChild(newHead);
  }

  isCollision(newHead) {
    return this.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y);
  }

  isFoodCollision(head) {
    if (this.gameMode === "portal") {
      return (head.x === this.food1.x && head.y === this.food1.y) || (head.x === this.food2.x && head.y === this.food2.y);
    }
    return head.x === this.food.x && head.y === this.food.y;
  }

  isWallCollision(newHead) {
    return this.walls.some(segment => segment.x === newHead.x && segment.y === newHead.y);
  }

  endGame() {
    document.dispatchEvent(new Event(EVENTS.game_end));
    this.isPlaying = false;
    clearInterval(this.gameLoop);
  }

  resetGame() {
    clearInterval(this.gameLoop);

    this.snake.forEach(segment => this.removeChild(segment));
    this.snake = [];
    this.walls.forEach(segment => this.removeChild(segment));
    this.walls = []; 

    if (this.food) {
      this.removeChild(this.food);
      this.food = null;
    }

    if (this.food1) {
      this.removeChild(this.food1);
      this.food1 = null;
    }

    if (this.food2) {
      this.removeChild(this.food2);
      this.food2 = null;
    }

    this.speed = CONFIG.GAME_SPEED;
    this.direction = "left";
    this.isPlaying = false;

    this.createSnake();
    this.createFood(this.gameMode === "portal");

    this.gameLoop = setInterval(this.update.bind(this), this.speed);
  }

  createBoard() {
    const boardGraphics = new Graphics();
    const cellSize = 20;
    const boardSize = 20 * cellSize;

    boardGraphics.beginFill(0xffffff);
    boardGraphics.lineStyle(1, 0x000000);
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 20; y++) {
        boardGraphics.drawRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
    boardGraphics.endFill();

    boardGraphics.x = (this.app.width - boardSize) / 2;
    boardGraphics.y = (this.app.height - boardSize) / 2;

    this.addChild(boardGraphics);
  }

  createSnake() {
    for (let i = 0; i < 3; i++) {
      this.snakePart = new Graphics();
      this.snakePart.beginFill(0x00ff00);
      this.snakePart.drawRect(20 * i, 0, 20, 20);
      this.snakePart.endFill();
      this.snake.push(this.snakePart);
      this.addChild(this.snakePart);
    }
  }

  createFood(portalMode = false) {
    if (portalMode) {
      if (this.food1) this.removeChild(this.food1);
      if (this.food2) this.removeChild(this.food2);

      let food1X, food1Y, food2X, food2Y;
      let isFood1OnSnake, isFood2OnSnake;

      do {
        isFood1OnSnake = false;
        food1X = Math.floor(Math.random() * 20) * 20 - 200;
        food1Y = Math.floor(Math.random() * 20) * 20 - 200;

        this.snake.forEach((segment) => {
          if (segment.x === food1X && segment.y === food1Y) {
            isFood1OnSnake = true;
          }
        });
      } while (isFood1OnSnake);

      do {
        isFood2OnSnake = false;
        food2X = Math.floor(Math.random() * 20) * 20 - 200;
        food2Y = Math.floor(Math.random() * 20) * 20 - 200;

        this.snake.forEach((segment) => {
          if (segment.x === food2X && segment.y === food2Y) {
            isFood2OnSnake = true;
          }
        });

        if (food1X === food2X && food1Y === food2Y) {
          isFood2OnSnake = true;
        }
      } while (isFood2OnSnake);

      this.food1 = new Graphics();
      this.food1.beginFill(0xff0000);
      this.food1.drawRect(0, 0, 20, 20);
      this.food1.endFill();
      this.food1.x = food1X;
      this.food1.y = food1Y;
      this.addChild(this.food1);

      this.food2 = new Graphics();
      this.food2.beginFill(0xff0000);
      this.food2.drawRect(0, 0, 20, 20);
      this.food2.endFill();
      this.food2.x = food2X;
      this.food2.y = food2Y;
      this.addChild(this.food2);
    } else {
      if (this.food) this.removeChild(this.food);

      let foodX, foodY;
      let isFoodOnSnake;

      do {
        isFoodOnSnake = false;
        foodX = Math.floor(Math.random() * 20) * 20 - 200;
        foodY = Math.floor(Math.random() * 20) * 20 - 200;

        this.snake.forEach((segment) => {
          if (segment.x === foodX && segment.y === foodY) {
            isFoodOnSnake = true;
          }
        });
      } while (isFoodOnSnake);

      this.food = new Graphics();
      this.food.beginFill(0xff0000);
      this.food.drawRect(0, 0, 20, 20);
      this.food.endFill();
      this.food.x = foodX;
      this.food.y = foodY;
      this.addChild(this.food);
    }
  }

  createWall() {
    let wallX, wallY;
    let isWallOnSnakeOrFood;

    do {
      isWallOnSnakeOrFood = false;
      wallX = Math.floor(Math.random() * 20) * 20 - 200;
      wallY = Math.floor(Math.random() * 20) * 20 - 200;

      this.snake.forEach((segment) => {
        if (segment.x === wallX && segment.y === wallY) {
          isWallOnSnakeOrFood = true;
        }
      });

      if (this.food && this.food.x === wallX && this.food.y === wallY) {
        isWallOnSnakeOrFood = true;
      }

      if (this.food1 && this.food1.x === wallX && this.food1.y === wallY) {
        isWallOnSnakeOrFood = true;
      }

      if (this.food2 && this.food2.x === wallX && this.food2.y === wallY) {
        isWallOnSnakeOrFood = true;
      }
    } while (isWallOnSnakeOrFood);

    const wall = new Graphics();
    wall.beginFill(0x000000);
    wall.drawRect(0, 0, 20, 20);
    wall.endFill();
    wall.x = wallX;
    wall.y = wallY;
    this.walls.push(wall);
    this.addChild(wall);
  }

  addListeners() {
    document.addEventListener(
      EVENTS.signals.change_direction,
      this.handleDirectionChange.bind(this)
    );
    document.addEventListener(
      EVENTS.signals.change_game_mode,
      this.handleGameModeChange.bind(this)
    );
    document.addEventListener(
      EVENTS.signals.start_game,
      () => (this.isPlaying = true)
    );

    document.addEventListener(
      EVENTS.signals.resume_game,
      () => (this.isPlaying = false)
    );

    document.addEventListener(
      EVENTS.signals.game_restart,
      this.resetGame.bind(this)
    );
  }
}
