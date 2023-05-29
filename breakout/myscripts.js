const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d");
let canStart = false;
const ballRadius = 10;
const paddleHeight = 10;
let paddleWidth;
let paddleAmount;
let paddleX = (canvas.width - paddleWidth)/2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 3;
let brickColumnCount = 5;
let brickAmount = brickColumnCount * brickRowCount;
const totBricks = brickColumnCount * brickRowCount;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const powerUpAmount = 3;
let whatColor;
let colorTheme = "#0095DD";
let score = 0;
let trueScore;
let paddleMultiplier = 0;
let brickMultiplier = 0;
let lives = 3;
let brickStreak = 0;
let bricksHit = 0;
let doubleBallTrue = false;
let triplePaddleTrue = false;
const multiPaddlePadding = 150;
let leftPaddleX = paddleX - multiPaddlePadding;
let rightPaddleX = paddleX + multiPaddlePadding;
let round = 1;
let randomX;
let randomY;

let bricks = [];
//Create Columns
	for(let c = 0; c < brickColumnCount; c++){
		bricks[c] = [];
		//Create rows for each column
		for(let r = 0; r < brickRowCount; r++){
			//Declare each bricks value
			bricks[c][r] = { x: 0, y: 0, status: true, randomStatus: false};
				
		}
	}	
for(let i = 0; i < 3; i++) {
	let col = Math.floor(Math.random() * brickColumnCount);
	let row = Math.floor(Math.random() * brickRowCount);
	bricks[col][row].randomStatus = true;
}

//There can be multiple balls so an array is needed because javascript doesn't have lists.
let balls = [];
for(let h = 0; h < balls.length; h++){
	//Each ball has it's own x, y and directions.
	balls[h] = { x: canvas.width / 2, y: canvas.height - 30, dx: 2, dy: 2};
}
balls.push({ x: canvas.width / 2, y: canvas.height - 30, dx: 2, dy: 2});

//Get which paddle the user chose and then assigning the corresponding settings
function reply_click(){
	if(event.srcElement.id == "small"){
		paddleWidth = 40;
		paddleMultiplier = 1.5;
		canStart = true;
		
		
	}else if(event.srcElement.id == "normal"){
		paddleWidth = 75;
		paddleMultiplier = 1;
		canStart = true;
		
	}else if(event.srcElement.id == "large"){
		paddleWidth = 125;
		paddleMultiplier = 0.5;
		canStart = true;
		
	}else{
		alert("Something Went Wrong, try reloading the page");
	}
}
//When every preeliminary setting is chosen the game can start
function starting(){
	
	if(canStart === true){
		draw();
	
		
	}else{
		alert("You need to choose a paddle first!");
	}
}
//Get keyboard inputs
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
			
function keyDownHandler(e){
	if(e.key == "Right" || e.key == "ArrowRight"){
		rightPressed = true;
	}
	else if(e.key == "Left" || e.key == "ArrowLeft") {
		leftPressed = true;
	}
}
function keyUpHandler(e){
	if (e.key == "Right" || e.key == "ArrowRight") {
		rightPressed = false;
	} 
	else if (e.key == "Left" || e.key == "ArrowLeft") {
		leftPressed = false;
	}
}
//Mouse movements
function mouseMoveHandler(e) {
	const relativeX = e.clientX - canvas.offsetLeft;
	if(relativeX > 0 && relativeX < canvas.width){
		paddleX = relativeX - paddleWidth / 2;
	}
}
//Which Powerup will be chosen?
function powerUp(){
	
	const typeOfPower = Math.floor(Math.random() * powerUpAmount)
	switch (typeOfPower){
		case 1: slowDown();
		break;
		case 2: doubleBall();
		break;
		case 3: triplePaddle();
		break;
		default: dx = 0;
	}
}
//Half the speed of every ball.
function slowDown(){
	for(let h = 0; h < balls.length; h++){
		let o = balls[h]
		o.dx /= 2;
		o.dy /= 2;
	}
}
function doubleBall(){
	balls.push({ x: canvas.width / 2, y: canvas.height - 30, dx: 2, dy: -2});
}
//Triggers extra paddles through the boolean.
function triplePaddle(){
	triplePaddleTrue = true;
	paddleAmount += 1;
}
function gameOver(){
	lives--;
	//No Lives = No Game
	if(!lives){
		alert("GAME OVER");
		document.location.reload();
	}else{
		//Otherwise it just resets everything to it's standard values.
		for(let h = 0; h < balls.length; h++){
			let o = balls[h];
			o.x = canvas.width / 2;
			o.y = canvas.height -30;
			o.dx = 2;
			o.dy = -2;
		}
		paddleX = (canvas.width - paddleWidth) / 2;
		triplePaddleTrue = false;
	}
}
function collisionDetection() {
	for(let c = 0; c < brickColumnCount; c++){
		for(let r = 0; r < brickRowCount; r++){
			let b = bricks[c][r];
			for(let h = 0; h < balls.length; h++){
				let o = balls[h];
				//If it's an active brick and the ball hits it
				if(b.status === true){			
					if(o.x > b.x && o.x < b.x + brickWidth && o.y > b.y && o.y < b.y + brickHeight){
						
						//Disable Brick
						b.status = false;
					
						//Calc Score
						brickStreak ++;
						bricksHit ++;
						score += paddleMultiplier;
						brickMultiplier = 1 + (brickStreak / 100);
						score *= brickMultiplier;
						
						
						//Change Direction
						o.dx *= 1.05;
						o.dy *= -1.05;
						//Check if powerup
						if(b.randomStatus === true){
							powerUp();
						}
					
						if(bricksHit === brickAmount){
							newRound();
						}
					}
				}
			}
		}
	}
}
function newRound(){
	//Randomize the amount of rows and reset bricks
	let ranRow = Math.floor(Math.random() * 6);
	if(ranRow == 0){
		ranRow = 1;
	}
	brickRowCount = ranRow;
	brickAmount = brickColumnCount * brickRowCount;
	bricksHit = 0;
	round += 1;
	for(let c = 0; c < brickColumnCount; c++){
		for(let r = 0; r < brickRowCount; r++){
			if(bricks[c][r].status == false){
				bricks[c][r].status = true;
			}		
		}
	}
	//Change the game color
	whatColor = Math.floor(Math.random() * 7);
	switch (whatColor){
		case 1: colorTheme = "#D690fc";
		break;
		case 2: colorTheme = "#91fc90";
		break;
		case 3: colorTheme = "#Db22bf";
		break;
		case 4: colorTheme = "#0095DD";
		break;
		case 5: colorTheme = "#3422db";
		break;
		case 6: colorTheme = "#Db9622";
		break;
		case 7: colorTheme = "#22dbd6";
		break;
		default: colorTheme = "#F3fc90";
	}
}
function drawScore(){ //Draw the score
	ctx.font = "16px Arial";
	ctx.fillStyle = colorTheme;
	ctx.fillText(`Score: ${(Math.round(score * 100) / 100).toFixed(2)}`, 8, 20);
}
function drawLives(){ //Draw the current amount of lives
	ctx.font = "16px Arial";
	ctx.fillStyle = colorTheme;
	ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}
function drawRound(){ //Draw the current round
	ctx.font = "16px Arial";
	ctx.fillStyle = colorTheme;
	ctx.fillText(`Round: ${round}`, (canvas.width / 2)-20, 20);
}
function drawBall() { //Draw each ball in the array
	for(let h = 0; h < balls.length; h++){
		ctx.beginPath();
		let o = balls[h];
		console.log(balls.length);
		ctx.arc(o.x, o.y, ballRadius, 0, Math.PI * 2);
		ctx.fillStyle = colorTheme;
		ctx.fill();
		ctx.closePath();
	}
}
function drawPaddle(){ //Draw the paddle and if the boolean is true, draw the other ones too
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	if(triplePaddleTrue === true){
		//for(let p = 1; p <= paddleAmount; p++){
		//	multiPaddlePadding *= p;
			ctx.rect(paddleX - multiPaddlePadding, canvas.height - paddleHeight, paddleWidth, paddleHeight);
			ctx.rect(paddleX + multiPaddlePadding, canvas.height - paddleHeight, paddleWidth, paddleHeight);
		
	}
	ctx.fillStyle = colorTheme;
	ctx.fill();
	ctx.closePath();
}
function drawBricks(){ // Draw the bricks
	for(let c = 0; c < brickColumnCount; c++){
		for(let r = 0; r < brickRowCount; r++){
			//If the brick hasn't been hit
			if(bricks[c][r].status === true){
				
			
			//Each of the bricks x and y values
			const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
			const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
			bricks[c][r].x = brickX;
			bricks[c][r].y = brickY;
			
			//Draw every brick
			ctx.beginPath();
			ctx.rect(brickX, brickY, brickWidth, brickHeight);
			if(bricks[c][r].randomStatus){			
				ctx.fillStyle = "#D53a51";			
			}else{			
				ctx.fillStyle = colorTheme;	
			}
			ctx.fill();
			ctx.closePath();
			}
		}
	}
}	

function draw() { //Trigger everything, basically main
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();
	drawRound();
	collisionDetection();
	
	//Balls bouncing of each other
	for(let h = 0; h < balls.length; h++){	
		let o = balls[h]
		for(let j = 0; j < balls.length; j++){	
			let u = balls[j]
			if(o.x == u.x && o.y == u.y){
				o.dy = o.dy*-1;
				u.dy = u.dy*-1;
			}
		}
		//Ball bouncing off the walls
		if( o.x + o.dx > canvas.width - ballRadius || o.x + o.dx < ballRadius){
			o.dx = o.dx * -1;
		}
		if (o.y + o.dy < ballRadius) {
			o.dy = o.dy * -1;
		
		} else if (o.y + o.dy > canvas.height - ballRadius) {
			//Bounce ball from paddles, if there's multiple
			if(triplePaddleTrue){
				if((o.x > paddleX && o.x < paddleX + paddleWidth) || (o.x > paddleX - multiPaddlePadding && o.x < paddleX + paddleWidth - multiPaddlePadding) || (o.x > paddleX + multiPaddlePadding && o.x < paddleX + paddleWidth + multiPaddlePadding)){
					o.dy = o.dy * -1;
					brickStreak = 0;
				}//Otherwise game over
				else{
					gameOver();
				}//Bounce ball from single paddle
			}else if(o.x > paddleX && o.x < paddleX + paddleWidth){
				o.dy = o.dy * -1;
				brickStreak = 0;
			//Otherwise game over
			}else{
				gameOver();
			}
		}
	}
	if(rightPressed) {//Move paddle right but limiting at the edge of the screen
		paddleX += 7;
		if (paddleX + paddleWidth > canvas.width){
			paddleX = canvas.width - paddleWidth;
		}
	}
	else if(leftPressed) {//Move paddle left but limiting at the edge of the screen
		paddleX -= 7;
		if (paddleX < 0){
			paddleX = 0;
		}
	}
	for(let h = 0; h < balls.length; h++){//Move the balls
		let o = balls[h]
		o.x += o.dx;
		o.y += o.dy;
	}//Call the function again, creating an infinite loop
	requestAnimationFrame(draw);
}