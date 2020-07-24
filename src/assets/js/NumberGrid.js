import store from "./Store";
function Number_Grid() {
  this.fatherDom = $(".number-contain")
  this.scoreDom = $(".score")
}

Number_Grid.prototype = {
  lastPosition: null,
  position: [],
  children: null,
  size: null,
  dom: null,
  create(number, position, children) {
    // css中position从1开始
    let dom = '<div class="number number-position-{0}-{1}"><span>{2}</span></div>'.format(position[0] + 1, position[1] + 1, number)
    this.size = number
    this.position = position
    this.dom = $(dom)
    this.dom.addClass("number-"+this.size)
    if (children !== undefined) {
      this.dom.addClass("merge")
      children[0].dom.removeClass("new merge")
      children[1].dom.removeClass("new merge")
      this.children = children
      this.fatherDom.append(this.dom)
    } else {
      this.dom.addClass("new")
      this.fatherDom.append(this.dom)
    }
  },
  changePosition(position) {
    // 改变坐标,消除保存的子格子,消除new和merge样式
    // 坐标相同不改变
    if (position !== this.position) {
      this.lastPosition = this.position
      this.position = position
      this.removeChildren()
      this.dom.removeClass('number-position-{0}-{1}'.format(this.lastPosition[0] + 1, this.lastPosition[1] + 1))
      this.dom.addClass('number-position-{0}-{1}'.format(this.position[0] + 1, this.position[1] + 1))
      return true
    } else {
      return false
    }
  },
  removeChildren() {
    if (this.children !== null) {
      this.children[0].dom.remove()
      this.children[0].removeChildren()
      this.children[1].dom.remove()
      this.children[1].removeChildren()
      delete this.children[0]
      delete this.children[1]
      this.children = null
    }
  }
  ,
  merge(otherOne) {
    // 判断数值是否相等
    if (otherOne.size === this.size) {
      // 创建新格子,把两个子格子加入新格子.并把两个格子移动重叠
      let temp = new Number_Grid()
      store.SCORE += this.size * 2
      temp.create(this.size * 2, this.position, [this, otherOne])
      otherOne.changePosition(this.position)
      return temp
    } else {
      return undefined
    }
  }
}
export default Number_Grid