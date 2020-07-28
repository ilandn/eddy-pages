


/* QuestionUI - should accept this and refresh example
function QuestionUI() {
		this.refresh = function(q) {
			$("#question").html("Question: "+q.questionText());
			for (var i=0;i<4;i++){
				$("#answer"+i).html((i+1)+":"+q.answers()[i]);
			}
		};
		
	}
*/
function Questions(questions, questionUI) {
		this.questionUI = questionUI;
		this.questions = questions;
		this.currentQuestion = null;
		this.currentAnswers = null;
		this.currentRightAnswerIdx = null;
		this.questionIdx = -1;
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
		
		this.newQuestion = function(){
			this.questionIdx+=1;
			this.currentQuestion = this.questions[this.questionIdx];
			
			if (this.currentQuestion.type == 'MULTIPLE_CHOICE'){
					this.currentAnswers  = this.currentQuestion.data.answers.split(",").map(Function.prototype.call, String.prototype.trim);
					this.currentRightAnswerIdx = this.currentAnswers.indexOf(this.rightAnswer())
			}
			this.questionUI.refresh(this);
		}
}


export default Questions;