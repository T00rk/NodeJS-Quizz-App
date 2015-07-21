// LIBS
global.EVENTS = require('events');

// Include list of questions 
global.QUESTIONS = require('./questions.js');

// Include Objects
global.GAME = require('./../lib/game.js');
global.PLAYER = require('./../lib/player.js');
global.QUESTION = require('./../lib/question.js');

// Application values
global.PLAYERS = [];
global.CURRENTGAME = null;
global.IO_ = null;
global.EMITTER = new EVENTS.EventEmitter();

global.getPlayerList = function()
{
	var _return = { scores : [] };

	for(var i in PLAYERS)
	{
		_return.scores[PLAYERS[i].playerName] = PLAYERS[i].score;
	}

	return _return;
}

global.getRandomInt = function(min, max)
{
  	return Math.floor(Math.random() * (max - min)) + min;
}