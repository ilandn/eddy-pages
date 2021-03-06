
var questions = initQuestions();
function hasNumber(myString) {
	return /\d/.test(myString);
}

Candy.Game = function (game) {
	// define needed variables for Candy.Game
	this._player = null;
	this._candyGroup = null;
	this._spawnCandyTimer = 0;
	this._fontStyle = null;
	// define Candy variables to reuse them in Candy.item functions
	Candy._scoreText = null;
	Candy._text = "";
	Candy._score = 0;
	Candy._health = 3;
};
Candy.Game.prototype = {
	create: function () {
		// start the physics engine
		this.physics.startSystem(Phaser.Physics.ARCADE);
		// set the global gravity
		this.physics.arcade.gravity.y = 50;
		// display images: background, floor and score
		this.add.sprite(0, 0, 'background');
		this.add.sprite(-30, Candy.GAME_HEIGHT - 160, 'floor');
		this.add.sprite(10, 5, 'score-bg');
		// add pause button
		this.add.button(Candy.GAME_WIDTH - 96 - 10, 5, 'button-pause', this.managePause, this);
		// create the player
		this._player = this.add.sprite(5, 760, 'monster-idle');
		// add player animation
		this._player.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 10, true);
		// play the animation
		this._player.animations.play('idle');
		// set font style
		this._fontStyle = { font: "40px Arial", fill: "#FFCC00", stroke: "#333", strokeThickness: 5, align: "center" };
		// initialize the spawn timer
		this._spawnCandyTimer = 0;
		// initialize the score text with 0
		Candy._scoreText = this.add.text(120, 20, "0", this._fontStyle);
		Candy._textBoard = this.add.text(40, 80, "?", this._fontStyle);
		// set health of the player
		Candy._health = 10;
		// create new group for candy
		this._candyGroup = this.add.group();
		// spawn first candy
		Candy.item.spawnCandy(this);
		initGame();
	},
	managePause: function () {
		// pause the game
		this.game.paused = true;
		// add proper informational text
		var pausedText = this.add.text(100, 250, "Game paused.\nTap anywhere to continue.", this._fontStyle);
		// set event listener for the user's click/tap the screen
		this.input.onDown.add(function () {
			// remove the pause text
			pausedText.destroy();
			// unpause the game
			this.game.paused = false;
		}, this);
	},
	update: function () {
		// update timer every frame
		this._spawnCandyTimer += this.time.elapsed;
		// if spawn timer reach one second (1000 miliseconds)
		if (this._spawnCandyTimer > 300) {
			// reset it
			this._spawnCandyTimer = 0;
			// and spawn new candy
			Candy.item.spawnCandy(this);
		}
		// loop through all candy on the screen
		this._candyGroup.forEach(function (candy) {
			// to rotate them accordingly
			if (candy.text !== "")
				candy.y += 1;
			//candy.angle += candy.rotateMe;
		});
		// if the health of the player drops to 0, the player dies = game over
		if (!Candy._health) {
			// show the game over message
			this.add.sprite((Candy.GAME_WIDTH - 594) / 2, (Candy.GAME_HEIGHT - 271) / 2, 'game-over');
			// pause the game
			this.game.paused = true;
		}
	}
};
Candy.item = {
	spawnCandy: function (game) {
		// calculate drop position (from 0 to game width) on the x axis
		var dropPos = Math.floor(Math.random() * Candy.GAME_WIDTH);
		// define the offset for every candy
		var dropOffset = [-27, -36, -36, -38, -48];
		// randomize candy type
		var candyType = Math.round(Math.random());
		if (candyType === 1 && questions && questions.rightAnswer()) {
			var options = '';
			let rightAnswer = questions.rightAnswer();
			var max_types = 0;
			if (hasNumber(rightAnswer)) {
				max_types += 10;
				options += '0123456789';
				// abiased for the right answer
				let a = rightAnswer.charAt(Candy._text.length);
				if (a) {
					options += a;
					options += a;
					options += a;
				}
			}
			if (rightAnswer.match(/[a-z]/i)) {
				// alphabet letters found
				max_types += 26;
				options += 'abcdefghijklmnopquvrstwxyz';
				// abiased for the right answer
				let a = rightAnswer.charAt(Candy._text.length);
				if (a) {
					options += a;
					options += a;
					options += a;
					options += a;
				}
			}
			var rnd = Math.floor(Math.random() * options.length);
			var text = options.charAt(rnd);
			//var candy = game.add.bitmapText(dropPos, -30, 'carrier_command', text, 34);
			var candy = game.add.text(dropPos, -30, text, { font: "65px Arial", fill: "#ff0044", align: "center" });


			//candy.t = text;
		}
		else {
			var max_types = 5;
			var image = 'candy';
			var frame = Math.floor(Math.random() * max_types);
			// create new candy
			var candy = game.add.sprite(dropPos, -30, image);
			candy.text = "";
			// add new animation frame
			candy.animations.add('anim', [frame], 10, true);
			// play the newly created animation
			candy.animations.play('anim');

			// enable candy body for physic engine
			game.physics.enable(candy, Phaser.Physics.ARCADE);
		}


		// enable candy to be clicked/tapped
		candy.inputEnabled = true;
		//candy.input.enableDrag();
		// add event listener to click/tap
		//candy.events.onInputDown.add(this.clickCandy, this);

		candy.events.onInputUp.add(this.clickCandy, this);


		//candy.events.onInputOver.add(this.over, this);
		// be sure that the candy will fire an event when it goes out of the screen
		candy.checkWorldBounds = true;
		// reset candy when it goes out of screen
		candy.events.onOutOfBounds.add(this.removeCandy, this);
		// set the anchor (for rotation, position etc) to the middle of the candy
		//candy.anchor.setTo(0.5, 0.5);
		// set the random rotation value
		//candy.rotateMe = (Math.random() * 4) - 2;
		// add candy to the group
		game._candyGroup.add(candy);
	},
	clickCandy: function (candy) {

		candy.fill = "#ffff44";

		//candy.text = "clicked " + clicks + " times";

		// kill the candy when it's clicked
		//game.world.remove(candy);

		// add points to the score
		if (candy.text.length) {
			let tmp = Candy._text + candy.text;
			if (check_answer_seq(tmp)) {
				Candy._score += 5;
				Candy._text = tmp;				
				Candy._textBoard.setText(Candy._text);
			}
		}
		else {
			Candy._score += 5;
			candy
		}
		// update score text
		Candy._scoreText.setText(Candy._score);
		this.removeCandy(candy);

	},
	removeCandy: function (candy) {
		// kill the candy
		if (candy.text.length) {
			candy.destroy();
		}
		else {
			candy.kill();
		}
		// decrease player's health
		//Candy._health -= 1;
	}
};

function initGame() {
	questions.newQuestion();
	Candy._text = "";				
	Candy._textBoard.setText(Candy._text);
}

function check_answer_seq(x) {
	console.log("test" + x.toLowerCase().substring(0, x.length));
	if (x.length === questions.rightAnswer().length && questions.checkAnswer(x)) {
		setTimeout(function () {
			initGame();
		}, 5);
		return true;
	}
	let res = x.toLowerCase().substring(0, x.length) === questions.rightAnswer().toLowerCase().substring(0, x.length);
	console.log("Right " + res + ' ' + x.toLowerCase().substring(0, x.length));
	return res;
}

