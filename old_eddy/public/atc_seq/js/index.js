var 	moves = 0,
		$scorePanel = $('#score-panel'),
		$moveNum = $scorePanel.find('.moves'),
		$restart = $scorePanel.find('.restart'),
		delay = 800;


var questions = initQuestions();

// Initial Game
function initGame() {
  questions.newQuestion();
  if (!questions.questionText()){
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

function myFunction() {
	let question_input = $('#answer_input');
    var x = question_input.val();
    console.log("test"+x.toLowerCase().substring(0,x.length));
	if (x.length===questions.rightAnswer().length && questions.checkAnswer(x)){
		question_input.addClass('match');
			setTimeout(function() {
				question_input.removeClass('match');
				question_input.val("");
				initGame();
			}, delay);
	}
	if (x.toLowerCase().substring(0,x.length) === questions.rightAnswer().toLowerCase().substring(0,x.length)){
		console.log("Right"+x.toLowerCase().substring(0,x.length));
		question_input.addClass('match');		
	}
	else{
		console.log("Wrong"+x.toLowerCase().substring(0,x.length));
		question_input.removeClass('match');
		//moves= moves > 0? moves -1: moves;
	}
}
$('#answer_input').on('input', myFunction);

initGame();
