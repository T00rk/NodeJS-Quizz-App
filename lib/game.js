// -- Game Object -- //
var Game = function()
{
	// List of Questions IDs
	this.questions = [];
	// List of Players (Don't know if i'll use it)
	this.players = [];
	// Date of Game start .... (why not)
	this.date = new Date();
	// Index of the current question in this.questions
	this.current = 0;

	this.initGame();
};
Game.prototype = 
{
	initGame : function()
	{
		while(this.questions.length < 4)
		{
			var randomInt = getRandomInt(0, QUESTIONS.length);
			if(this.questions.indexOf(randomInt) < 0)
			{
				this.questions.push(randomInt);
			}
		}

		// Ask First Question in 15 seconds
		IO_.in('game').emit('eGameStart');
		this.timer = setTimeout(this.askQuestion.bind(this), 15000);
	},
	addPlayer : function(player)
	{
		this.players[player.playerName] = player;
		IO_.in('game').emit('ePlayerList', this.getScore());
	},
	askQuestion : function()
	{
		if(this.current < 4)
		{
			var questionId = this.questions[this.current];
			this.questions[this.current] = new QUESTION(questionId, this.current);
			
			// After 20 seconds, correction will be sent
			setTimeout(this.reviewQuestion.bind(this), 20000);

			IO_.in('game').emit('eNewQuestion', this.questions[this.current].getQuestionToText());
		}
		else
		{
			EMITTER.emit('eGameFinished');
			IO_.in('game').emit('eGameFinished', this.getScore());
		}
	},
	reviewQuestion : function()
	{
		var currentQuestion = this.questions[this.current];
		var userScore = currentQuestion.reviewQuestion();

		for(var i in userScore)
		{
			// Update each user score
			this.players[i].score += userScore[i];
			userScore[i] = this.players[i].score;
		}

		var score = this.getScore();
		// Send correct answers ans all users score to each player
		IO_.in('game').emit('eCorrection', { correctAnswers : currentQuestion.getCorrectProps(), scores : score.scores });

		this.current++;

		// We wait 5 seconds before asking next question
		this.timer = setTimeout(this.askQuestion.bind(this), 5000);
	},
	getScore : function()
	{
		var _return = { scores : [], winner : null };

		for(var i in this.players)
		{
			_return.scores[this.players[i].playerName] = this.players[i].score;

			var userScore = { username : this.players[i].playerName, score : this.players[i].score };
			_return.scores.push(userScore);

			if(_return.winner === null || userScore.score > _return.winner.score);
			{
				_return.winner = userScore;
			}
		}

		_return.scores.sort(function(a, b)
		{
			if (a.score > b.score)
				return -1;
			if (a.score < b.score)
				return 1;
			return 0;
		});

		return _return;
	},
	setPlayerAnswer : function(player, answer)
	{
		this.players[player.playerName] = player;
		this.questions[this.current].setAnswerForPlayer(player.playerName, answer);
	}
};
module.exports = Game;