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
  if (!questions.questionText()){
	  endGame(moves);
	  return;
	}
	for (var i = 0; i < 4; i++) {
		let btn = $('#btn'+i);
		//console.log()
		btn.removeClass('open show match notmatch animated infinite rubberBand');
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

function myFunction() {
	let question_input = $('#response_input');
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
$('#response_input').on('input', myFunction);

initGame();