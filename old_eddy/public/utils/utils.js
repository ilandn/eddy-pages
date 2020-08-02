

function initQuestions(questionUI) {
	var params = location.href.split('?')[1].split('&');
	var data = {};
	for (x in params) {
		data[params[x].split('=')[0]] = decodeURIComponent(params[x].split('=')[1]);
	}
	if (!questionUI) {
		questionUI = new GenericQuestionUI();
	}
	var questions = new Questions(JSON.parse(data.questions), questionUI);
	return questions;
}

function createObject(currentObject, jqSearch, value) {
	if (value.indexOf('http') >= 0) {
		var img = document.createElement('IMG');
		img.src = value;
		img.setAttribute('width', 'auto');
		img.setAttribute('height', '40px');
		img.setAttribute('class', currentObject.childNodes[0].class);

		console.log('prev obj', currentObject.type);
		currentObject.replaceChild(img, currentObject.childNodes[0]);
		currentObject.backgroundColor = 'white';
	}
	else {
		var text = document.createTextNode(value);
		currentObject.replaceChild(text, currentObject.childNodes[0]);
	}
};

function GenericQuestionUI() {
	var originalText = $("#question");
	var replaceBackToText = false;
	var speakButton = null;

	this.refresh = function (q, refreshQuesion) {
		//let value = 'speak:cat cat cat';//q.questionText();
		//let v = 'https://visualpharm.com/assets/869/Speaker-595b40b85ba036ed117dab1a.svg';
		if (refreshQuesion) {
			if (q.currentQuestion.type == 'MULTIPLE_CHOICE') {
				if ($("#response_input"))
					$("#response_input").hide();
				if ($("#responseSelection"))
					$("#responseSelection").show();

			}
			if (q.currentQuestion.type == 'TYPING') {
				if ($("#response_input"))
					$("#response_input").show();
				if ($("#responseSelection"))
					$("#responseSelection").hide();
			}
			let v = q.questionText();
			if (v.indexOf('speak:') >= 0) {

				var btn = document.createElement("BUTTON");        // Create a <button> element

				var img = document.createElement('IMG');
				img.src = 'https://visualpharm.com/assets/869/Speaker-595b40b85ba036ed117dab1a.svg';
				img.setAttribute('width', 'auto');
				img.setAttribute('height', '30px');
				//
				btn.appendChild(img);                                // Append the text to <button>
				//document.body.appendChild(btn);

				btn.onclick = function () {
					var u = new SpeechSynthesisUtterance();
					var splitText = v.split(":");
					if (splitText.length === 3) {
						u.text = splitText[2];
						u.lang = splitText[1];
					}
					else if (splitText.length === 2) {
						u.text = splitText[1];
						u.lang = 'en-US';
					}

					speechSynthesis.speak(u);

					// Prevent Default Action
					return false;
				};
				setTimeout(btn.onclick, 1); // Redraw
				this.replaceBackToText = true;
				$("#question").replaceWith(btn);
				btn.setAttribute("id", "question");

			}
			else if (v.indexOf('http') >= 0) {
				img = document.createElement('IMG');
				img.src = v;
				img.setAttribute('width', 'auto');
				img.setAttribute('height', '50px');
				this.replaceBackToText = true;
				$("#question").replaceWith(img);

			}
			else {
				$("#question").html("Question: " + q.questionText());
			}
		}
		if (q.answers()) {
			$('[id^="answer"]').each(function (index, value) {
				createObject(value, $("#answer" + index), q.answers()[index]);
				//$("#answer" + index).html((index + 1) + ":" + q.answers()[index]);
			});
			$('[id^="btn"]').each(function (index, value) {
				//$("#btn" + index).html(q.answers()[index]);
				createObject(value, $("#btn" + index), q.answers()[index]);
			});
		}
	};
}

function standartize(x) {
	var ret = String(x);
	if (ret.indexOf('http') < 0)
		return String(x).toLowerCase();
	else
		return ret;
}

function Questions(questions, questionUI) {
	this.questionUI = questionUI;
	this.questions = questions;
	this.currentQuestion = null;
	this.currentAnswers = null;
	this.currentRightAnswerIdx = null;
	this.questionIdx = -1;
	this.alternativeAnswers = null;
	this.length = this.questions.length;
	this.rightAnswer = function () {
		if (this.currentQuestion && this.currentQuestion.data) {
			return standartize(this.currentQuestion.data.correctAnswer);
		}
		else return null;
	};

	this.overrideAnswers = function (idx, value) {
		this.alternativeAnswers[idx] = value;
		if (this.questionUI) {
			this.questionUI.refresh(this, false);
		}

	};

	this.rightAnswerIdx = function () {
		return this.currentRightAnswerIdx;
	};
	this.answers = function () {
		if (this.alternativeAnswers)
			return this.alternativeAnswers;
		else
			return this.currentAnswers;
	};
	this.questionText = function () {
		if (this.questionIdx < this.length) {
			return this.currentQuestion.data.body;
		}
		else{
			return null;
		}
	};


	this.checkAnswerNum = function (answerNum) {
		if (answerNum < this.currentAnswers.length)
			return this.checkAnswer(this.currentAnswers[answerNum]);
		else
			return false;
	}

	this.checkAnswer = function (answer) {
		currentTime = new Date();
		var diff = (currentTime - this.time);
		let answerRight = standartize(answer) === this.rightAnswer();
		var answerMsg = {
			'replyTime': diff, 'isCorrect': answerRight,
			"questionId": this.questions[this.questionIdx].id
		}
		var event = new CustomEvent('doneQuestion', { detail: answerMsg })
		window.parent.document.dispatchEvent(event)
		return answerRight;

	}

	this.newQuestion = function () {
		this.questionIdx += 1;
		if (this.questionIdx < this.length) {
			this.time = new Date();

			this.currentQuestion = this.questions[this.questionIdx];

			if (this.currentQuestion.type == 'MULTIPLE_CHOICE') {
				this.currentAnswers = this.currentQuestion.data.answers.map(standartize); //.split(",").map(Function.prototype.call, String.prototype.trim);
				this.currentRightAnswerIdx = this.currentAnswers.indexOf(this.rightAnswer())
			}
			if (this.questionUI) {
				this.questionUI.refresh(this, true);
			}
		}
		else {
			var event = new CustomEvent('donePlaying', { detail: null })
			window.parent.document.dispatchEvent(event)
		}
	}
}

