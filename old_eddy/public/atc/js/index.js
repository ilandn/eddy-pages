var 	moves = 0,
		$scorePanel = $('#score-panel'),
		$moveNum = $scorePanel.find('.moves'),
		$restart = $scorePanel.find('.restart'),
		delay = 800;

////////////////////////////////////////////////////questions //////////////////////////////////
var questions = initQuestions();


function answer(answerNum){
		let btn = $('#btn'+answerNum);
	  if (btn.html()==="?"){
			return;
		}
	if (questions.checkAnswerNum(answerNum)){
	  console.log("YO YOY YOY ");
	  //parent.$('body').trigger('success');
		btn.addClass('match animated infinite rubberBand');
      setTimeout(function() {
        btn.removeClass('open show animated infinite rubberBand');
		moves+=1;
		$moveNum.html(moves);
				initGame();
      }, delay /2);
		
	}
	else {
		for (var i = 0; i < 4; i++) {
			let btn = $('#btn'+i);
			btn.prop('disabled', true);
		}
		btn.addClass('notmatch animated infinite wobble');
			setTimeout(function() {
				btn.removeClass('animated infinite wobble');
				for (var i = 0; i < 4; i++) {
					let btn = $('#btn'+i);
					btn.prop('disabled', false);
					}
			}, delay * 3);
	}
}
// Initial Game
function initGame() {
  questions.newQuestion();
  if (!questions.answers()){
	  endGame(moves);
	  return;
  }
  $moveNum.html(moves);
};
// End Game
function endGame(moves) {
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Congratulations! You Done!',
		text: 'With ' + moves + ' right answers.\nBoom Shaka Lak!',
		type: 'success',
		confirmButtonColor: '#9BCB3C',
		confirmButtonText: 'Play again!'
	}).then(function(isConfirm) {
		if (isConfirm) {
			qestions.questionIdx = -1;
			initGame();
		}
	})
}

// Restart Game
$restart.on('click', function() {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Are you sure?',
    text: "Your progress will be Lost!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#9BCB3C',
    cancelButtonColor: '#EE0E51',
    confirmButtonText: 'Yes, Restart Game!'
  }).then(function(isConfirm) {
    if (isConfirm) {
      initGame();
    }
  })
});

var loader = document.getElementById('loader')
  , border = document.getElementById('border')
  , α = 0
  , π = Math.PI
  , t = 180;

(function draw() {
  α++;
  α %= 360;
  var r = ( α * π / 180 )
    , x = Math.sin( r ) * 125
    , y = Math.cos( r ) * - 125
    , mid = ( α > 180 ) ? 1 : 0
    , anim = 'M 0 0 v -125 A 125 125 1 ' 
           + mid + ' 1 ' 
           +  x  + ' ' 
           +  y  + ' z';
  //[x,y].forEach(function( d ){
  //  d = Math.round( d * 1e3 ) / 1e3;
  //});
 
  loader.setAttribute( 'd', anim );
  border.setAttribute( 'd', anim );
  
  setTimeout(draw, t); // Redraw
})();

initGame();