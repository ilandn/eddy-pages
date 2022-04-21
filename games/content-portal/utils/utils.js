

function initQuestions(questionUI){
	var params = decodeURI(location.href).split('?')[1].split('&');
	var data = {};
	for (x in params){
		data[params[x].split('=')[0]] = params[x].split('=')[1];
	 }
	if(!questionUI){
		questionUI = new GenericQuestionUI();
	}
	var questions = new Questions(JSON.parse(data.questions), questionUI);
	return questions;
}



function GenericQuestionUI() {
	this.refresh = function(q) {
		$("#question").html("Question: "+q.questionText());
		$('[id^="answer"]').each(function (index, value) {
			$("#answer"+index).html((index+1)+":"+q.answers()[index]);
		});
		$('[id^="btn"]').each(function (index, value) {
			$("#btn"+index).html(q.answers()[index]);
		});
	};	
}

function Questions(questions, questionUI) {
		this.questionUI = questionUI;
		this.questions = questions;
		this.currentQuestion = null;
		this.currentAnswers = null;
		this.currentRightAnswerIdx = null;
		this.questionIdx = -1;
		this.length = this.questions.length;
		this.rightAnswer = function (){
		    return this.currentQuestion.data.correctAnswer;
		};
		this.rightAnswerIdx = function (){
		    return this.currentRightAnswerIdx;
		};
		this.answers = function (){
		    return this.currentAnswers;
		};
		this.questionText = function (){
		    return this.currentQuestion.data.body;
		};
		
		
		this.checkAnswerNum = function(answerNum){
			if(answerNum < this.currentAnswers.length)
				return this.checkAnswer(this.currentAnswers[answerNum]);
			else
				return false;
		}
		
		this.checkAnswer = function(answer){
			currentTime = new Date();
			var diff = (currentTime - this.time)/1000;
			let answerRight = answer === this.rightAnswer();
			var customData = { 'time':diff, 'answerRight': answerRight};
			var event = new CustomEvent('message', { detail:customData})
			window.parent.document.dispatchEvent(event)
			return answerRight;
			
		}
		
		this.newQuestion = function(){
			this.questionIdx+=1;
			if (this.questionIdx < this.length){
				this.time = new Date();
			
				this.currentQuestion = this.questions[this.questionIdx];
				
				if (this.currentQuestion.type == 'MULTIPLE_CHOICE'){
						this.currentAnswers  = this.currentQuestion.data.answers.split(",").map(Function.prototype.call, String.prototype.trim);
						this.currentRightAnswerIdx = this.currentAnswers.indexOf(this.rightAnswer())
				}
				this.questionUI.refresh(this);
			}
			else{
				var event = new CustomEvent('donePlaying', { detail:null})
				window.parent.document.dispatchEvent(event)
			}
		}
}

