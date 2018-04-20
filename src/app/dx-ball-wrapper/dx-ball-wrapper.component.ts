import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-dx-ball-wrapper',
  template: `<canvas #myCanvas [width]="w" [height]="h"></canvas>`,
  styleUrls: ['./dx-ball-wrapper.component.scss']
})
export class DxBallWrapperComponent implements OnInit {
  public h: number;
  public w: number;

  private playerColor: string;
  private bgColor: string;
  private brickColor: string;
  private intervalSpeed: number;
  private size: number;
  private BRICK_WIDTH: number;

  private ctx: CanvasRenderingContext2D;

  private allBricks: Brick[] = [];
  private round: number;
  private myPlayer: Player;
  private myBall: Ball;
  private gamePlay; // game interval
  private nextMoveDirection: number;

  @ViewChild('myCanvas') canvasRef: ElementRef;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(e: KeyboardEvent) {
    switch (e.which) {
      case ArrowKeys.LEFT:
        this.nextMoveDirection = Direction.LEFT;
        break;
      case ArrowKeys.RIGHT:
        this.nextMoveDirection = Direction.RIGHT;
        break;
      default:
        return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  }

  constructor() {
    this.h = 400;
    this.w = 600;

    this.playerColor = '#fff';
    this.bgColor = '#000';
    this.brickColor = '#45f043';
    this.intervalSpeed = 100;
    this.size = 10;
    this.BRICK_WIDTH = 4;

    this.round = 1;
  }

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.initGame();
  }

  initGame() {
    // setup variables
    this.myPlayer = new Player(0, this.h - this.size - 1, this.size);
    this.myBall = new Ball(this.myPlayer, this.size);
    this.allBricks = this.initBricks(this.round);
    // Draw to canvas
    this.drawPlayer(this.myPlayer);
    this.drawBricks();
    this.setGameInterval();
  }

  setGameInterval() {
    this.gamePlay = setInterval(() => {
      this.clearRect();

      this.testAndMovePlayer();
      this.drawPlayer(this.myPlayer);
      this.moveBall(this.myBall);
      this.drawBall(this.myBall);
      this.drawBricks();
    }, this.intervalSpeed);
  }

  drawPlayer(player: Player): void {
    this.ctx.fillStyle = this.playerColor;
    this.ctx.fillRect(player.x, player.y, player.width, player.size);
  }

  drawBall(ball: Ball) {
    this.ctx.fillStyle = this.brickColor;
    this.ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
  }

  clearRect() {
    this.ctx.fillStyle = this.bgColor;
    this.ctx.rect(0, 0, this.w, this.h);
    this.ctx.fill();
  }

  initBricks(round) {
    const arr = [];
    // extract round schemas
    for (let i = 0; i < 3; i++) {
      let x = i * this.size * this.BRICK_WIDTH;
      if (i) {
        x += this.size * i;
      }
      const y = this.h / 2;
      arr.push(new Brick(x, y, this.BRICK_WIDTH, this.size));
    }
    return arr;
  }

  drawBricks() {
    this.allBricks.forEach(brick => {
      if (brick.visible) {
        this.drawBrick(brick);
      }
    });
  }

  drawBrick(brick: Brick) {
    this.ctx.fillStyle = this.brickColor;
    this.ctx.fillRect(brick.x, brick.y, brick.width, brick.size);
  }

  testAndMovePlayer() {
    if (this.playerNotAtEdge(this.nextMoveDirection)) {
      this.myPlayer.move(this.nextMoveDirection);
      this.nextMoveDirection = 0;
    }
  }

  playerNotAtEdge(direction: number): boolean {
    if (this.myPlayer.x === 0 && direction === Direction.LEFT) {
      return false;
    }
    if (this.myPlayer.x + this.myPlayer.width === this.w && direction === Direction.RIGHT) {
      return false;
    }
    return true;
  }

  moveBall(ball: Ball) {
    ball.move();
    this.testForBricks(ball);
    if (this.testForPlayer(ball)) {
      ball.changeDirection('vertical');
    }
    if (!!this.ballTouchesWall(ball)) {
      const wallSide = this.ballTouchesWall(ball);
      if (wallSide === 'vertical' && ball.y + ball.size >= this.h) {
        this.gameOver();
        console.log('Game Over!');
      }
      ball.changeDirection(wallSide);
    }
  }

  ballTouchesWall(ball: Ball): string {
    if (ball.x <= 0) {
      return 'horizontal';
    }
    if (ball.x + this.size >= this.w) {
      return 'horizontal';
    }
    if (ball.y <= 0) {
      return 'vertical';
    }
    if (ball.y + this.size >= this.h) {
      return 'vertical';
    }
    return '';
  }

  testForPlayer(ball: Ball) {
    return (
      ball.y + this.size === this.myPlayer.y &&
      ball.x >= this.myPlayer.x &&
      ball.x + this.size < this.myPlayer.x + this.myPlayer.width
    );
  }

  testForBricks(ball: Ball) {
    this.allBricks.forEach(brick => {
      if (this.ballTouchesBrick(ball, brick)) {
        brick.remove();
      }
    });
  }

  ballTouchesBrick(ball: Ball, brick: Brick) {
    return ball.y === brick.y && ball.x >= brick.x && ball.x + this.size < brick.x + brick.width;
  }

  cellOverlap(item1, item2) {
    return item1.x === item2.x && item1.y === item2.y;
  }

  //   noMoreBricks() {
  //     const removedFood = this.allFood.reduce((acc, curr) => acc - curr.visible, this.allFood.length);
  //     if (removedFood === this.allFood.length) {
  //       return true;
  //     }
  //     return false;
  //   }

  gameOver() {
    setTimeout(() => {
      this.clearRect();
    }, this.intervalSpeed);
    clearInterval(this.gamePlay);
    // TODO - reveal game over modal
  }

  //   levelUp() {
  //     this.round++;
  //     this.allFood = this.makeFood(this.round);
  //     this.intervalSpeed *= 0.6;
  //   }
}

/** Snake and SnakeNode Interfaces */
// TODO - move

class Player {
  // vars
  x: number;
  y: number;
  width: number;
  size: number;

  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.width = size * 5;
  }

  move(direction) {
    if (direction) {
      this.x += direction * this.size;
    }
  }
}

class Brick {
  x;
  y;
  width;
  size;
  visible;

  constructor(posX, posY, width, size) {
    this.x = posX;
    this.y = posY;
    this.width = width * size;
    this.size = size;
    this.visible = true;
  }

  remove() {
    this.visible = false;
  }
}

class Ball {
  x;
  y;
  size;
  dx;
  dy;

  constructor(player: Player, size) {
    this.x = (player.x + player.width) / 2;
    this.y = player.y - size;
    this.size = size;
    this.dx = size;
    this.dy = -size;
  }
  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  changeDirection(wallSide) {
    if (wallSide === 'horizontal') {
      this.dx = this.dx * -1;
    }
    if (wallSide === 'vertical') {
      this.dy = this.dy * -1;
    }
  }
}

const Direction = {
  RIGHT: 1,
  LEFT: -1
};

const ArrowKeys = {
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  LEFT: 37
};

// TODO
// test if touches player
// fix bricks
// build brick layout
