// -- Player Object -- //
var Player = function(socket, name)
{
	// Client Socket
	this.socket = socket;
	// Nickname of the player
	this.playerName = name;
	// Total points
	this.score = 0;
};
Player.prototype = 
{

};
module.exports = Player;