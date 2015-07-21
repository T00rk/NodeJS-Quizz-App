'use strict';

var EXPRESS 	= require('express');
var HTTP 		= require('http');
var PATH		= require('path');
var IO 			= require('socket.io');

var APP 		= EXPRESS();

require('./config/globals.js');

// Route for index.html
APP.get('/', function (req, res)
{
  	res.sendFile(PATH.join(__dirname, 'public/index.html'));
});
APP.use(EXPRESS.static('public'));

// Create server
var SERVER = HTTP.Server(APP);
SERVER.listen(3000, function()
{
  	var host = SERVER.address().address;
  	var port = SERVER.address().port;

  	console.log('Example app listening at http://%s:%s', host, port);

  	EMITTER.on('eGameFinished', function()
  	{
  		CURRENTGAME = new GAME();
  	});
  	CURRENTGAME = new GAME();
});

IO_ = IO(SERVER);
IO_.on('connection', function(socket)
{	
	socket.on('error', function(e)
	{
		console.log(e);
	});
	socket.on('eLogin', function(l)
	{
		PLAYERS[socket.id] = new PLAYER(socket, l);

		socket.join('game');
		CURRENTGAME.addPlayer(PLAYERS[socket.id]);
	});
	socket.on('eAnswer', function(id)
	{
		CURRENTGAME.setPlayerAnswer(PLAYERS[socket.id], id);
	});
	socket.on('disconnect', function()
	{
		delete PLAYERS[socket.id];
	});
	socket.emit('eWelcome', 'Hello');
});