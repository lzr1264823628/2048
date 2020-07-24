String.prototype.format = function (args) {
  let result = this;
  if (arguments.length < 1) {
    return result;
  }

  let data = arguments;       //如果模板参数是数组
  if (arguments.length === 1 && typeof (args) == "object") {
    //如果模板参数是对象
    data = args;
  }
  for (let key in data) {
    let value = data[key];
    if (undefined !== value) {
      result = result.replace("{" + key + "}", value);
    }
  }
  return result;
}
import store from "./Store";

import Number_Grid from "./NumberGrid";

function Game() {
}

Game.prototype = {
  gridArray: [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]],
  init() {
    // 清楚格面
    this.clear()
    // 清除分数
    store.SCORE = 0;
    // 生成两个数字
    this.createRandomGrid();
    this.createRandomGrid();
    // 监听事件
    this.addListen();
  },
  clear() {
    for (let i = 0; i < this.gridArray.length; i++) {
      for (let j = 0; j < this.gridArray[i].length; j++) {
        if (this.gridArray[i][j] !== null) {
          this.gridArray[i][j].dom.remove()
          this.gridArray[i][j].removeChildren()
          delete this.gridArray[i][j]
          this.gridArray[i][j] = null
        }
      }
    }
  },
  createRandomGrid() {
    let size = Math.random() < 0.9 ? 2 : 4;
    let remain = this.getRemain()
    let select = remain[Math.floor(remain.length * Math.random())]
    let grid = new Number_Grid()
    // console.log(select,remain)
    grid.create(size, select)
    this.gridArray[select[0]][select[1]] = grid
  },
  getRemain() {
    let temp = []
    for (let i = 0; i < this.gridArray.length; i++) {
      for (let j = 0; j < this.gridArray[i].length; j++) {
        if (this.gridArray[i][j] === null) {
          temp.push([i, j])
        }
      }
    }
    return temp
  },
  changePosition(oldPosition, newPosition) {
    this.gridArray[newPosition[0]][newPosition[1]] = this.gridArray[oldPosition[0]][oldPosition[1]]
    this.gridArray[oldPosition[0]][oldPosition[1]] = null
  }
  ,
  moveGrid(direction) {
    let moveFlag = false;
    switch (direction) {
      case "left":
        for (let y = 0; y < 4; y++) {
          let lastMerge = null;
          for (let x = 0; x < 4; x++) {
            if (this.gridArray[x][y] !== null && x !== 0) {
              // 找此数字左方向的数字
              let findFlag = null;
              for (let k = x - 1; k >= 0; k--) {
                if (this.gridArray[k][y] !== null) {
                  findFlag = k;
                  break;
                }
              }
              // 定义缓存格子对象的变量
              let temp = null;
              // 如果没有找到,将格子移动到最左边,并移动它在数组中的位置
              if (findFlag === null) {
                if (this.gridArray[x][y].changePosition([0, y])) {
                  this.changePosition([x, y], [0, y])
                  moveFlag = true;
                }
              } else {
                // 上一个是合并项
                if (findFlag === lastMerge) {
                  if (findFlag + 1 !== x) {
                    this.gridArray[x][y].changePosition([findFlag + 1, y])
                    this.changePosition([x, y], [findFlag + 1, y])
                    moveFlag = true
                  }
                } else {
                  // 尝试合并
                  let result = this.gridArray[findFlag][y].merge(this.gridArray[x][y])
                  if (result) {
                    // 合并成功
                    this.gridArray[findFlag][y] = result
                    this.gridArray[x][y] = null
                    moveFlag = true
                    lastMerge = findFlag
                    // 2048游戏结束
                    if (result.size === 2048) {
                      this.settleControl(false)
                    }
                  } else {
                    // 合并失败
                    if (findFlag + 1 !== x) {
                      this.gridArray[x][y].changePosition([findFlag + 1, y])
                      this.changePosition([x, y], [findFlag + 1, y])
                      moveFlag = true
                    }
                  }
                }
              }

            }
          }
        }
        break;

      case "top":
        for (let x = 0; x < 4; x++) {
          let lastMerge = null
          for (let y = 0; y < 4; y++) {
            if (this.gridArray[x][y] !== null && y !== 0) {
              // 找此数字上方向的数字
              let findFlag = null;
              for (let k = y - 1; k >= 0; k--) {
                if (this.gridArray[x][k] !== null) {
                  findFlag = k;
                  break;
                }
              }
              // 定义缓存格子对象的变量
              let temp = null;
              // 如果没有找到,将格子移动到最上边,并移动它在数组中的位置
              if (findFlag === null) {
                if (this.gridArray[x][y].changePosition([x, 0])) {
                  this.changePosition([x, y], [x, 0])
                  moveFlag = true
                }
              } else {
                if (findFlag === lastMerge) {
                  if (findFlag + 1 !== y) {
                    this.gridArray[x][y].changePosition([x, findFlag + 1])
                    this.changePosition([x, y], [x, findFlag + 1])
                    moveFlag = true
                  }
                } else {
                  // 尝试合并
                  let result = this.gridArray[x][findFlag].merge(this.gridArray[x][y])
                  if (result) {
                    // 合并成功
                    this.gridArray[x][findFlag] = result
                    this.gridArray[x][y] = null
                    moveFlag = true
                    lastMerge = findFlag
                    // 2048游戏结束
                    if (result.size === 2048) {
                      this.settleControl(false)
                    }
                  } else {
                    // 合并失败
                    if (findFlag + 1 !== y) {
                      this.gridArray[x][y].changePosition([x, findFlag + 1])
                      this.changePosition([x, y], [x, findFlag + 1])
                      moveFlag = true
                    }
                  }
                }

              }
            }
          }
        }
        break;

      case "right":
        for (let y = 0; y < 4; y++) {
          let lastMerge = null
          for (let x = 3; x >= 0; x--) {
            if (this.gridArray[x][y] !== null && x !== 3) {
              // 找此数字左方向的数字
              let findFlag = null;
              for (let k = x + 1; k < 4; k++) {
                if (this.gridArray[k][y] !== null) {
                  findFlag = k;
                  break;
                }
              }
              // 定义缓存格子对象的变量
              let temp = null;
              // 如果没有找到,将格子移动到最左边,并移动它在数组中的位置
              if (findFlag === null) {
                if (this.gridArray[x][y].changePosition([3, y])) {
                  this.changePosition([x, y], [3, y])
                  moveFlag = true
                }
              } else {
                if (findFlag === lastMerge) {
                  if (findFlag - 1 !== x) {
                    this.gridArray[x][y].changePosition([findFlag - 1, y])
                    this.changePosition([x, y], [findFlag - 1, y])
                    moveFlag = true
                  }
                } else {
                  // 尝试合并
                  let result = this.gridArray[findFlag][y].merge(this.gridArray[x][y])
                  if (result) {
                    // 合并成功
                    this.gridArray[findFlag][y] = result
                    this.gridArray[x][y] = null
                    moveFlag = true
                    lastMerge = findFlag
                    // 2048游戏结束
                    if (result.size === 2048) {
                      this.settleControl(false)
                    }
                  } else {
                    // 合并失败
                    if (findFlag - 1 !== x) {
                      this.gridArray[x][y].changePosition([findFlag - 1, y])
                      this.changePosition([x, y], [findFlag - 1, y])
                      moveFlag = true
                    }
                  }
                }
              }

            }
          }
        }
        break;

      case "bottom":
        for (let x = 0; x < 4; x++) {
          let mergeFlag = null;
          for (let y = 3; y >= 0; y--) {
            if (this.gridArray[x][y] !== null && y !== 3) {
              // 找此数字上方向的数字
              let findFlag = null;
              for (let k = y + 1; k < 4; k++) {
                if (this.gridArray[x][k] !== null) {
                  findFlag = k;
                  break;
                }
              }
              // 定义缓存格子对象的变量
              let temp = null;
              // 如果没有找到,将格子移动到最上边,并移动它在数组中的位置
              if (findFlag === null) {
                if (this.gridArray[x][y].changePosition([x, 3])) {
                  this.changePosition([x, y], [x, 3])
                  moveFlag = true
                }
              } else {
                if (findFlag === mergeFlag) {
                  if (findFlag - 1 !== y) {
                    this.gridArray[x][y].changePosition([x, findFlag - 1])
                    this.changePosition([x, y], [x, findFlag - 1])
                    moveFlag = true
                  }
                } else {
                  // 尝试合并
                  let result = this.gridArray[x][findFlag].merge(this.gridArray[x][y])
                  if (result) {
                    // 合并成功
                    this.gridArray[x][findFlag] = result
                    this.gridArray[x][y] = null
                    moveFlag = true
                    // 2048游戏结束
                    if (result.size === 2048) {
                      this.settleControl(false)
                    }
                  } else {
                    // 合并失败
                    if (findFlag - 1 !== y) {
                      this.gridArray[x][y].changePosition([x, findFlag - 1])
                      this.changePosition([x, y], [x, findFlag - 1])
                      moveFlag = true
                    }
                  }
                }
              }
            }
          }
        }
        break;

    }
    return moveFlag
  }
  ,
  addListen() {
    // 移除前事件
    $(document).off()
    // 添加事件
    $(document).keyup((e) => {
      // 左37 上38 右39 下40
      let moveFlag = false;
      switch (e.which) {
        case 37:
          moveFlag = this.moveGrid("left")
          e.preventDefault();
          break;

        case 38:
          moveFlag = this.moveGrid("top")
          e.preventDefault();
          break;

        case 39:
          moveFlag = this.moveGrid("right")
          e.preventDefault();
          break;

        case 40:
          moveFlag = this.moveGrid("bottom")
          e.preventDefault();
          break;

      }
      // 生成新的
      if (moveFlag) {
        this.createRandomGrid()
        // 游戏结束检测
        if (this.gameOver()) {
          this.settleControl(true)
        }
      }
    })
    let startX, startY;
    let $body = $("body");
    $body.off()
    $body.on("touchstart", function (e) {
      // 判断默认行为是否可以被禁用
      // if (e.cancelable) {
      //   // 判断默认行为是否已经被禁用
      //   if (!e.defaultPrevented) {
      //     e.preventDefault();
      //   }
      // }
      startX = e.originalEvent.changedTouches[0].pageX;
      startY = e.originalEvent.changedTouches[0].pageY;
    });
    $body.on("touchend", (e) => {
      // 判断默认行为是否可以被禁用
      // if (e.cancelable) {
      //   // 判断默认行为是否已经被禁用
      //   if (!e.defaultPrevented) {
      //     e.preventDefault();
      //   }
      // }
      let moveEndX = e.originalEvent.changedTouches[0].pageX
      let moveEndY = e.originalEvent.changedTouches[0].pageY
      let X = moveEndX - startX
      let Y = moveEndY - startY;
      let theta = Math.atan(Math.abs(Y / X));
      let moveFlag;
      if (X > 0 && Y > 0) {
        if (theta > 0 && theta <= Math.PI / 4) {
          // alert("右")
          moveFlag = this.moveGrid("right")
        } else {
          // alert("下")
          moveFlag = this.moveGrid("bottom")
        }
      } else if (X > 0 && Y < 0) {
        if (theta > 0 && theta <= Math.PI / 4) {
          // alert("右")
          moveFlag = this.moveGrid("right")
        } else {
          // alert("上")
          moveFlag = this.moveGrid("top")
        }
      } else if (X < 0 && Y < 0) {
        if (theta > 0 && theta <= Math.PI / 4) {
          // alert("左")
          moveFlag = this.moveGrid("left")
        } else {
          // alert("上")
          moveFlag = this.moveGrid("top")
        }
      } else if (X < 0 && Y > 0) {
        if (theta > 0 && theta <= Math.PI / 4) {
          // alert("左")
          moveFlag = this.moveGrid("left")
        } else {
          // alert("下")
          moveFlag = this.moveGrid("bottom")
        }
      } else if (X === 0 && Y > 0) {
        // alert("下")
        moveFlag = this.moveGrid("bottom")
      } else if (X === 0 && Y < 0) {
        // alert("上")
        moveFlag = this.moveGrid("top")
      } else if (Y === 0 && X > 0) {
        // alert("右")
        moveFlag = this.moveGrid("right")
      } else if (Y === 0 && X < 0) {
        // alert("左")
        moveFlag = this.moveGrid("left")
      }
      // 生成新的数字
      if (moveFlag) {
        this.createRandomGrid()
        // 游戏结束检测
        if (this.gameOver()) {
          this.settleControl(true)
        }
      }
    });

  },
  gameOver() {
    let remain = this.getRemain()
    if (remain.length !== 0) {
      return false
    }
    let canMergeFlag = false
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if ((x !== 3 && this.gridArray[x][y].size === this.gridArray[x + 1][y].size) || (y !== 3 && this.gridArray[x][y].size === this.gridArray[x][y + 1].size)) {
          canMergeFlag = true
          break;
        }
      }
      if (canMergeFlag) {
        break;
      }
    }
    return !canMergeFlag
  },
  settleControl(gameOverStatus) {
    let $cover = $(".cover-contain")
    let $cover_text = $(".cover-contain>.cover-btn-group>p")
    let $cover_btn = $(".cover-contain>.cover-btn-group>button")
    if (gameOverStatus) {
      $cover_text.text("game over")
      $cover_btn.off()
      $cover_btn.text("try again")
      $cover_btn.click(() => {
        this.init()
        $cover.fadeOut(1000)
      })
      $cover.fadeIn(1000)
    } else {
      $cover_text.text("you win")
      $cover_btn.off()
      $cover_btn.text("new game")
      $cover_btn.click(() => {
        this.init()
        $cover.fadeOut(1000)
      })
      $cover.fadeIn(1000)
    }
  }
}

export default Game;