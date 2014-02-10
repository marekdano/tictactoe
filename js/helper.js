"use strict";

// initialize an empty board;
var board = [0,0,0,0,0,0,0,0,0];
// all winning combinations 
var WIN_COMBS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
		  [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
		  [0, 4, 8], [2, 4, 6]];        // diagonal
// best moves in order
var BEST_MOVES = [4, 0, 2, 6, 8, 1, 3, 5, 7];
// winning player of the game
var winningPlayer;
// Two players play the game. First player starts first.
var turnPlayer;
 // two players or player against computer
var player1, player2, computer;

var Player = function(name) {
	this.name = name;
  	this.score = 0;
};

Player.prototype.won = function() {
	this.score += 1;
};

// check the cell if it's empty (with value O)
var checkCell = function(index) {
	return board[index];
};

var getWinningPlayer = function() {
	return winningPlayer;
};

// a player move
var move = function(cell, index) {
 	if(turnPlayer === player1) {
   		$(cell).addClass("first_player_cell");
  	} else if(turnPlayer === player2) {
   		$(cell).addClass("second_player_cell");
  	} 
   
	// keep record which player moved in particular cell
	board[index] = turnPlayer;
};

// Check for the best computer move  
// First add a computer move to empty field and check if computer can win. 
// If yes, move computer there.
// Second add a human move to empty field and check if human can win . If yes, 
// move computer there.
// If no move in the combination of moves for computer and human is found, 
// move computer in one of the best moves.   
var computerMove = function() {
	var help_board = board;
  
  	// find if computer can win by pretending a computer move
  	for(var i=0; i<help_board.length; i++) {
   		if(help_board[i] === 0) {
			// checking if computer can win
			help_board[i] = computer;
			if(checkMove(help_board)) {
	 			board[i] = turnPlayer;
	 			$(".board_cell[id=" + i + "]").addClass("second_player_cell");
	 			return;
			}
			help_board[i] = 0;
   		}
  	} 

  	// find if human can win by pretending a player1 (human) move
  	for(var j=0; j<help_board.length; j++) {
   		if(help_board[j] === 0) {
		// checking if player1 (human) can win
			help_board[j] = player1;
			if(checkMove(help_board)) {
		 		board[j] = turnPlayer;
		 		$(".board_cell[id=" + j + "]").addClass("second_player_cell");
		 		return;
			}
			help_board[j] = 0;
   		}
  	} 

  	// move computer in one of the best moves
  	for (var k=0; k<BEST_MOVES.length; k++) {
   		if(board[BEST_MOVES[k]] === 0) {
			board[BEST_MOVES[k]] = turnPlayer;
			$(".board_cell[id=" + BEST_MOVES[k] + "]").addClass("second_player_cell");
			//console.log(turnPlayer['name']);
			return;
   		}
  	}
 };


// check if a new move is the winning
var checkMove = function(board) {
	for(var i=0; i<WIN_COMBS.length; i++) {
	   	if(board[WIN_COMBS[i][0]] === board[WIN_COMBS[i][1]] && board[WIN_COMBS[i][0]] === board[WIN_COMBS[i][2]] && 
			board[WIN_COMBS[i][1]] === board[WIN_COMBS[i][2]] && board[WIN_COMBS[i][1]]!== 0) {
		
		return true;
	   	}
	}
	return false;
};

// return next player turn 
var nextPlayer = function() {
  	if (computer !== undefined) {
   		turnPlayer = (turnPlayer === player1) ? computer : player1;
  	} else {
   		turnPlayer = (turnPlayer === player1) ? player2 : player1;
  	} 
};

// Check if there is a winner
// If yes, return true. If not, return false
// If there is no winner and there is no more moves available,
// return the string tie.
var checkWinner = function(board) {
	if(checkMove(board)) {
		return true;
	}

  	// the whole board is filled, no more moving available
  	if(board.indexOf(0) === -1){
	  	return "tie";
  	}

  	// no winner found
  	return false;
};

// Displays the result of the game (winner name, tie) and set up a new game
var endGame = function(result) {
	if (result !== "tie") {
   		winningPlayer = turnPlayer;
   		alert(winningPlayer['name'] + " win!!! Congratulation!!!");
   		winningPlayer.won();
  	} else {
   		alert("It's a tie! :)");
  	}

  	return nextGame();
};

// reset the board
var resetBoard = function() {
	for(var i=0; i<board.length; i++) {
   		$(".board_cell[id=" + i + "]").removeClass("first_player_cell second_player_cell");
   		board[i] = 0;
  }
  
  // first player starts the game first
    turnPlayer = player1;
};

// reset the board, update score, set first move for player1, winning player is undefined
var nextGame = function() {
	resetBoard();
  	// update the score
  	$("input[name=player1]").val(player1.score);
  	if (player2 !== undefined) { 
   		$("input[name=player2]").val(player2.score); 
  	} else if (computer !== undefined) {
   		$("input[name=player2]").val(computer.score);
  	} 
  	// set winning player to undefined
  	winningPlayer = undefined;
  	// first player starts the game first
  	turnPlayer = player1;
};

// Initialize a new game every time when the page is loaded or the buttons 
// (two players or computer) are hit 
var initNewGame = function(button) { 
	if (button === "btn-two_players") {
   		player2 = new Player("Second player");
   		$("h3#second_player").html("Player 2")
   		$("h1#main_heading").html("tic tac toe for 2");
   		computer = undefined;
  	} else if (button === "btn-computer") {
   		computer = new Player("Computer");
   		$("h1#main_heading").html("tic tac toe against computer");
   		$("h3#second_player").html("Computer");
   		player2 = undefined;
  	}
  	player1 = new Player("First player");
  	$("input[name=player1]").val(player1.score);
  	if (player2 !== undefined) {
   		$("input[name=player2]").val(player2.score);
  	} else if (computer !== undefined) {
   		$("input[name=player2]").val(computer.score); 
  	}
  
  	return nextGame();
};


$(document).ready(function() {

 	initNewGame("btn-two_players");

 	// get action when hovering over board cells
 	$(".board_cell").hover(function () {
   		$(this).addClass("cell_hovered");
	}, function () {
		$(this).removeClass("cell_hovered");
	});

 	// if one of two buttons are hit initialize a new game 
	$("button").click(function() {
		var buttonName = $(this).attr('id');
	 	(buttonName === "btn-reset") ? resetBoard() : initNewGame(buttonName); 
	});

 	// get the appropriate action when the cell is clicked
	$(".board_cell").click(function() {
  		var index = parseInt($(this).attr('id'));
  		// check if cells are available until someone wins
  		if(checkCell(index) === 0 && getWinningPlayer() === undefined) {
   			move(this, index);
   			var result = checkWinner(board);
   			if (result || result === "tie") {
				return endGame(result);
   			} else {
				nextPlayer();
				if(computer !== undefined) {
	 				computerMove();
	 				result = checkWinner(board);
	 				if (result || result === "tie") {
	  					return endGame(result);
	 				}
	 				nextPlayer();
				}
   			}
  		}
 	});
});
