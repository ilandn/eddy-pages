var 	moves = 0,
		currentQuestionsMoves=0,
		$scorePanel = $('#score-panel'),
		$moveNum = $scorePanel.find('.moves'),
		$restart = $scorePanel.find('.restart'),
		delay = 800;
var image = document.getElementById("likes");
image.classList.add('pause');
var questions = new Questions(["אנא איית את המילה חתול באנגלית", "אנא איית את המילה כלב באנגלית" , "אנא איית את המילה לקרוא באנגלית"],
	[["11", "14", "13", "18"], ["6", "9", "7", "8"],["11", "14", "13", "10"]],
	["cat","dog","read" ]);

function QuestionUI() {
		this.question = "1";
		this.set = function(txt) {
			this.question = txt;
		};
		
		this.refresh = function(h) {
			$(h).html(this.question);
		};
		
	}
function Questions(questions, allAnswers, rightAnswers) {
		this.questionUI = new QuestionUI();
		this.answers = allAnswers;
		this.questionIdx = -1;
		this.rightAnswers = rightAnswers;
		this.allAnswers = allAnswers;
		this.questions = questions;
		this.rightAnswer = function (){
		    return this.rightAnswers[this.questionIdx];
		};

		this.answers = function (){
		    return this.allAnswers[this.questionIdx];
		};
		this.questionText = function (){
		    return this.questions[this.questionIdx];
		};
		
		this.newQuestion = function(){
			this.questionIdx+=1;
			this.questionUI.set(this.questionText());
			this.questionUI.refresh("#question");
		}
}


function answer(answerNum){
		let btn = $('#btn'+answerNum);
	  if (btn.html()==="?"){
			return;
		}
	console.log(answerNum+"   "+ questions.rightAnswer());
	
	if (answerNum== questions.rightAnswer()){
	  console.log("YO YOY YOY ");
		btn.addClass('match animated infinite rubberBand');
      setTimeout(function() {
        btn.removeClass('open show animated infinite rubberBand');
		moves+=1;
		document.getElementById("flower").src="f1"+moves+".png";
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

initGame();

function myFunction() {
	let question_input = $('#answer_input');
    var x = question_input.val();
    console.log("test"+x.toLowerCase().substring(0,x.length));
	if (x.toLowerCase().substring(0,x.length) === questions.rightAnswer().toLowerCase().substring(0,x.length)){
		console.log("Right"+x.toLowerCase().substring(0,x.length));
		currentQuestionsMoves=Math.max(x.length, currentQuestionsMoves);
		image.classList.add('pause');
		setTimeout(function() {
				image.classList.add('pause');
			}, 999);
		
		if (x.length===questions.rightAnswer().length){
			question_input.addClass('match animated infinite');
			setTimeout(function() {
				question_input.removeClass('match animated infinite');
				question_input.val("");
				initGame();
			}, delay);
		}
			
	}
	else{
		console.log("Wrong"+x.toLowerCase().substring(0,x.length));
		//moves= moves > 0? moves -1: moves;
	}
		//document.getElementById("flower").src="f1"+(moves+currentQuestionsMoves)+".png";
		$moveNum.html(moves+currentQuestionsMoves);
}
$('#answer_input').on('input', myFunction);



//    button = document.getElementById("pause");
 