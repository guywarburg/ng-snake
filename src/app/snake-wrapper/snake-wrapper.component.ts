import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'snake-wrapper',
  templateUrl: './snake-wrapper.component.html',
  styleUrls: ['./snake-wrapper.component.scss']
})
export class SnakeWrapperComponent implements OnInit {
  h = 400;
  w = 400;
  intervalSpeed = 100;
  size = 10;
  ctx: CanvasRenderingContext2D;

  allFood;
  round: number;
  mySnake: Snake;
  gamePlay;

  @ViewChild('myCanvas') canvasRef: ElementRef;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(e: KeyboardEvent) {
    debugger;
    switch (e.which) {
      case 37: // left
        if (this.mySnake.direction === Arrowkey.RIGHT) {
          break;
        }
        this.mySnake.direction = Arrowkey.LEFT;
        break;

      case 38: // up
        if (this.mySnake.direction === Arrowkey.DOWN) {
          break;
        }
        this.mySnake.direction = Arrowkey.UP;
        break;

      case 39: // right
        if (this.mySnake.direction === Arrowkey.LEFT) {
          break;
        }
        this.mySnake.direction = Arrowkey.RIGHT;
        break;

      case 40: // down
        if (this.mySnake.direction === Arrowkey.UP) {
          break;
        }
        this.mySnake.direction = Arrowkey.DOWN;
        break;

      default:
        return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  }

  constructor() {
  }

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.initGame();
  }

  initGame() {
    this.allFood = [];
    this.round = 1;
    this.intervalSpeed = 100;
    this.mySnake = this.initSnake(0, 0);
    this.drawSnake(this.mySnake);
    this.allFood = this.makeFood(this.round);
    this.drawFood();
    this.setGameInterval();
  }

  setGameInterval() {
    this.gamePlay = setInterval(() => {
      this.clearRect();
      this.mySnake.move(this.allFood);
      if (this.testForFood()) {
        if (this.noMoreFood()) {
          this.levelUp();
        }
      } else {
        this.mySnake.removeNode();
      }
      if (this.testForWall() || this.testForSelf()) {
        this.gameOver();
      }
      this.drawSnake(this.mySnake);
      this.drawFood();
    }, this.intervalSpeed);
  }

  initSnake(x: number, y: number): Snake {
    const snake = new Snake(x, y);
    snake.addNode(x + this.size, y);
    snake.addNode(x + (this.size * 2), y);
    return snake;
  }

  drawSnake(snake: Snake): void {
    const head = snake.head;
    while (snake.head !== null) {
      this.ctx.fillStyle = '#fff';
      this.ctx.fillRect(snake.head.x, snake.head.y, this.size, this.size);
      // move to next node;
      snake.head = snake.head.prev;
    }
    snake.head = head;
  }

  clearRect() {
    this.ctx.fillStyle = '#333';
    this.ctx.rect(0, 0, this.w, this.h);
    this.ctx.fill();
  }

  makeFood(numOfFood) {
    const arr = [];
    for (let i = 0; i < numOfFood; i++) {
      // random location within the canvas rounded to the nearest tenth.
      arr.push(new Food(this.getRandFoodLocation(this.w - this.size), this.getRandFoodLocation(this.h - this.size)));
    }
    return arr;
  }

  drawFood() {
    for (let i = 0; i < this.allFood.length; i++) {
      if (this.allFood[i].visible) {
        this.ctx.fillStyle = '#45f043';
        this.ctx.fillRect(this.allFood[i].x, this.allFood[i].y, this.size, this.size);
      }
    }
  }

  getRandFoodLocation(max) {
    let temp;
    temp = Math.floor(Math.random() * max);
    temp = temp - (temp % 10);

    return temp;
  }

  testForFood() {
    for (let i = 0; i < this.allFood.length; i++) {
      if (this.allFood[i].x === this.mySnake.head.x) {
        if (this.allFood[i].y === this.mySnake.head.y) {
          this.allFood[i].visible = false;
          return true;
        }
      }
    }
    return false;
  }

  noMoreFood() {
    let count = 0;
    for (let i = 0; i < this.allFood.length; i++) {
      if (!this.allFood[i].visible) {
        count++;
      }
    }
    if (count === this.allFood.length) {
      return true;
    }
    return false;
  }

  testForWall() {
    if (this.mySnake.head.x >= this.w || this.mySnake.head.x < 0 ||
      this.mySnake.head.y >= this.h || this.mySnake.head.y < 0) {
      return true;
    } else {
      return false;
    }
  }

  testForSelf() {
    const head = this.mySnake.head;
    this.mySnake.head = this.mySnake.head.prev;
    while (this.mySnake.head !== null) {
      if (head.x === this.mySnake.head.x && head.y === this.mySnake.head.y) {
        return true;
      }
      // move to next node;
      this.mySnake.head = this.mySnake.head.prev;
    }
    this.mySnake.head = head;
    return false;
  }

  gameOver() {
    setTimeout(() => {
      this.clearRect();
    }, this.intervalSpeed);
    clearInterval(this.gamePlay);
    // $('#modal').show();
  }

  levelUp() {
    this.round++;
    this.allFood = this.makeFood(this.round);
    this.intervalSpeed *= 0.6;
    // $('#level').text(round);
  }
}

/** Snake and SnakeNode Interfaces */
// TODO - move

class SnakeNode {
  next;
  prev;
  x;
  y;

  constructor(posX, posY) {
    this.next = null;
    this.prev = null;
    this.x = posX;
    this.y = posY;
  }
}

class Snake {
  // vars
  head;
  tail;
  direction;
  length;

  constructor(x, y) {
    const node = new SnakeNode(x, y);
    this.head = node;
    this.tail = node;
    this.direction = Arrowkey.RIGHT;
    this.length = 1;
  }

  // funcs
  addNode(posX, posY) {
    const tempNode = new SnakeNode(posX, posY);
    this.head.next = tempNode;
    tempNode.prev = this.head;
    this.head = tempNode;

    this.length++;
  }

  removeNode() {
    this.tail = this.tail.next;
    this.tail.prev = null;

    this.length--;
  }

  move(increment) {
    let newX, newY;
    const size = 10; // TODO abstract from class
    switch (this.direction) {
      case Arrowkey.UP:
        newX = this.head.x;
        newY = this.head.y - size;
        break;
      case Arrowkey.RIGHT:
        newX = this.head.x + size;
        newY = this.head.y;
        break;
      case Arrowkey.DOWN:
        newX = this.head.x;
        newY = this.head.y + size;
        break;
      case Arrowkey.LEFT:
      default:
        newX = this.head.x - size;
        newY = this.head.y;
        break;
    }
    this.addNode(newX, newY);
  }
}

class Food {
  x;
  y;
  visible;

  constructor(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.visible = true;
  }

  eat() {
    this.visible = false;
  }
}

const Arrowkey = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3
};
