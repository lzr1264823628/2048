import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'
import $ from 'expose-loader?exposes[]=$&exposes[]=jQuery!jquery/dist/jquery.min';
import './assets/css/cli.css';
import './assets/css/number-contain.css';
import './assets/css/number-color.css'
import './assets/css/cover.css'
import './assets/css/score.css'
import Game from './assets/js/GameManage'

let g = new Game()
g.init();
let $btn = $(".btn-new-game")
$btn.click(() => {
  g.init();
})
$btn.on("tap",() => {
  g.init();
})