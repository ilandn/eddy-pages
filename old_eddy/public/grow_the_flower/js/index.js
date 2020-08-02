var 	fl_moves = 0,
		$scorePanel = $('#score-panel'),
		$moveNum = $scorePanel.find('.moves'),
		$restart = $scorePanel.find('.restart'),
		delay = 800;

var questions = initQuestions();


function answer(answerNum){
		let btn = $('#btn'+answerNum);
	  if (btn.html()==="?"){
			return;
		}
	console.log(answerNum+"   "+ questions.rightAnswer());
	
	if (questions.checkAnswerNum(answerNum)){
	  console.log("YO YOY YOY ");
		btn.addClass('match animated infinite rubberBand');
      setTimeout(function() {
        btn.removeClass('open show animated infinite rubberBand');
		fl_moves+=1;
		document.getElementById("flower").src="f1"+fl_moves+".png";
		$moveNum.html(fl_moves);
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
	  endGame(fl_moves);
	  return;
  }
  $moveNum.html(fl_moves);
	for (var i = 0; i < 4; i++) {
		let btn = $('#btn'+i);
		//console.log()
		//btn.html(questions.answers()[i]);
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

initGame();