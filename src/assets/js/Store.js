let SCORE = 0
let store = {}
let $score = $(".score")
let $best = $(".bestScore")
let bestKey = "BEST_SCORE";
if(typeof(localStorage)!=="undefined")
{
  if(localStorage.getItem(bestKey)==null){
    localStorage.setItem(bestKey,0)
  }else{
    $best.text(localStorage.getItem(bestKey))
  }
}
Object.defineProperty(store,"SCORE",{
  get: function (){
    return SCORE
  },
  set(v) {
    SCORE = v
    if(SCORE>localStorage.getItem(bestKey)){
      localStorage.setItem(bestKey,SCORE)
      $best.text(SCORE)
    }
    $score.text(SCORE)
  }
})

export default store