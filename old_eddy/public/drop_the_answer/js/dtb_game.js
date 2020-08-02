function preload() {

    game.load.image('platform', 'assets/sprites/platform.png');
    game.load.image('ball', 'assets/sprites/shinyball.png');
	game.load.atlas('button', 'assets/buttons/button_texture_atlas.png', 'assets/buttons/button_texture_atlas.json');
	game.load.spritesheet('answers', 'assets/buttons/number-buttons-90x90.png', 90, 90);

}


var bodies = [];
var new_rec=true;
var chain=[];
var lastX=0;
var lastY=0;
var currentXChain=0;
var currentYChain=0;
var ballSprite;
var answersBoxes=[];
var platformSprite;
var platformSprite_h;
var already_hit=false;
function update() {
	
	if (game.input.mousePointer.isUp)
		new_rec=true;
		
    //  only move when you clic
    if (game.input.mousePointer.isDown)
    {
		if (new_rec===true){
			new_rec=false;
			bodies.push( new Phaser.Physics.Box2D.Body(game, null, game.input.x, game.input.y, 0) );
			chain=[];
			currentXChain=game.input.x;
			currentYChain=game.input.y;
			lastX=game.input.x;
			lastY=game.input.y;
		}
		else if(Math.abs(game.input.x - lastX) > 2 || Math.abs(game.input.y - lastY) > 2){
			chain.push(game.input.x-currentXChain);
			chain.push(game.input.y-currentYChain);
			lastX=game.input.x;
			lastY=game.input.y;
		}
		if(chain.length >0){
			
			bodies[bodies.length-1].setChain(chain); 
		}
		
		
    }
}


function create() {

    // Enable Box2D physics
    game.physics.startSystem(Phaser.Physics.BOX2D);
	game.physics.box2d.debugDraw.shapes = true;
	game.physics.box2d.debugDraw.joints = false;
	game.physics.box2d.debugDraw.aabbs = false;
	game.physics.box2d.debugDraw.pairs = false;
	game.physics.box2d.debugDraw.centerOfMass = false;
	
    

    // Static platform 
	platformSprite = game.add.sprite(400, 400, 'platform');
	platformSprite.scale.setTo(1, 0.5);
	platformSprite_h = platformSprite.getBounds().height;
	game.physics.box2d.enable(platformSprite);
	platformSprite.body.static = true;
   // game.add.text(5, 5, 'Different restitution settings.', { fill: '#ffffff', font: '14pt Arial' });
	start();
}

function localCreate(){
	bodies = [];
	new_rec=true;
	chain=[];
	lastX=0;
	lastY=0;
	currentXChain=0;
	currentYChain=0;
	ballSprite;
	answersBoxes=[];
    //game.stage.backgroundColor = '#124184';
	already_hit=false;
	game.physics.box2d.gravity.y = 0;
	for (var i = 0; i < 4; i++){
		var answer1 = game.add.sprite(202+i*131, platformSprite.y-platformSprite_h/2-25, 'answers',i);
		answer1.scale.setTo(0.5, 0.5);
		game.physics.box2d.enable(answer1);
		answer1.body.setCollisionCategory(2);
		answer1.body.answerId = i;
		answersBoxes.push(answer1);
		
		var tower = new Phaser.Physics.Box2D.Body(this.game, null, answer1.x, 
		answer1.y +answer1.getBounds().height/2-15, 0);
		game.physics.box2d.enable(tower);
		tower.setRectangle(5, 16);
		bodies.push(tower);
		tower.static = false;
	}

    // Sprites for dynamic bodies
    ballSprite = game.add.sprite(50+Math.floor(Math.random() * 700), 100, 'ball');
    //  Enable physics. This creates a default rectangular body.
    game.physics.box2d.enable([ ballSprite]);
	ballSprite.body.type=0;
	ballSprite.body.setCircle(ballSprite.width / 2);
	ballSprite.body.setCategoryContactCallback(2, hitTheAnswer, this);
	
	
    
    //  Adjust the gravity scale
    ballSprite.body.restitution = 0.6;
	button = game.add.button(game.world.centerX - 95, 20, 'button', actionOnClick, this, 'down', 'down', 'down');
	button.scale.setTo(0.5, 0.5);
}
function hitTheAnswer(body1, body2, fixture1, fixture2, begin) {

    // This callback is also called for EndContact events, which we are not interested in.
    if (!begin)
    {
        return;
    }
	if(!already_hit && body2.answerId>=0){
		already_hit=true;
		answer(body2.answerId);
		answersBoxes[body2.answerId].destroy();
	}
}

function actionOnClick () {

    game.physics.box2d.gravity.y = 500;

}

function render() {
	for(var i=0;i<bodies.length;i++){
		game.debug.box2dBody(bodies[i]);
	}
}


////////////////////////////////////////////////////questions //////////////////////////////////
var questions = initQuestions();
	
function start(){
	answersBoxes.forEach(function(x){x.destroy();});
	bodies.forEach(function(x){x.destroy();});
	if (ballSprite)
		ballSprite.destroy();
	questions.newQuestion();
	localCreate();
}

function answer(answerNum){
	console.log(answerNum+"   "+ questions.rightAnswerIdx());
	var text;
	if (questions.checkAnswerNum(answerNum)){
	  var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    //  The Text is positioned at 0, 100
    text = game.add.text(game.width/2-70, game.height/2-40, 'Succeed', { fill: '#ffffff', font: '30pt Arial' });
	}
	setTimeout(function() {
		if(text)
			text.destroy()
		start();
	}, 2500);
}

