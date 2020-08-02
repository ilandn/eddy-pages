var 	moves = 0,
		currentQuestionsMoves=0,
		$scorePanel = $('#score-panel'),
		$moveNum = $scorePanel.find('.moves'),
		$restart = $scorePanel.find('.restart'),
		delay = 800;

var questions = initQuestions();

// Initial Game
function initGame() {
  questions.newQuestion();
  moves += currentQuestionsMoves;
  currentQuestionsMoves = 0;
  if (!questions.answers()){
	  endGame(moves);
	  return;
  }
  $moveNum.html(moves);
	for (var i = 0; i < 4; i++) {
		let btn = $('#btn'+i);
		//console.log()
		btn.html(questions.answers()[i]);
		btn.removeClass('open show match notmatch animated infinite rubberBand');
	}
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
		currentQuestionsMoves=Math.max(x.length, currentQuestionsMoves);	
	}
	else{
		console.log("Wrong"+x.toLowerCase().substring(0,x.length));
		//moves= moves > 0? moves -1: moves;
	}
		document.getElementById("flower").src="f1"+(moves+currentQuestionsMoves)+".png";
		$moveNum.html(moves+currentQuestionsMoves);
}
$('#answer_input').on('input', myFunction);


initGame();