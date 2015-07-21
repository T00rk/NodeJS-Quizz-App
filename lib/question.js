// -- Question Object -- //
var Question = function(id, i)
{
	// Text of the question
	this.text = null;
	// List of Propositions
	this.propositions = [];
	// List of Answers
	this.answers = [];
	// Question Number
	this.number = i;

	this.loadQuestion(id);
};
Question.prototype =
{
	loadQuestion : function(id)
	{
		if(id < QUESTIONS.length)
		{
			var currentQuestion = QUESTIONS[id];

			this.text = currentQuestion.text;
			this.propositions = currentQuestion.propositions;
		}
	},
	setAnswerForPlayer : function(playerName, answer)
	{
		if(typeof(this.answers[playerName]) === 'undefined')
			this.answers[playerName] = [];

		this.answers[playerName].push(answer);
	},
	getQuestionToText : function()
	{
		var _return = { number : (this.number + 1), text : this.text, props : [] };
		for(var i = 0; i < this.propositions.length; i++)
		{
			_return.props.push(this.propositions[i].text);
		}
		return _return;
	},
	getCorrectProps : function()
	{
		var _return = [];

		for(var i = 0; i < this.propositions.length; i++)
		{
			if(this.propositions[i].correct)
			{
				_return.push(i);
			}
		}

		return _return;
	},
	reviewQuestion : function()
	{
		var _return = {};

		var correctProps = this.getCorrectProps();
		for(var i in this.answers)
		{
			_return[i] = 0;
			for(var x = 0; x < this.answers[i].length; x++)
			{
				if(correctProps.indexOf(this.answers[i][x]) > -1)
				{
					// 1 pt for each correct answer
					_return[i] ++;
				}
				else
				{
					// -1 pt for each bad answer
					_return[i] --;
				}
			}
		}

		return _return;
	}
};
module.exports = Question;