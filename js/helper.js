"use strict";

// initialize an empty board;
var	board = [0,0,0,0,0,0,0,0,0];
// winning player of the game
var winning_player;
// Two players play the game. First player starts first.
var turn_player;
// two players
var	player1, player2, computer;


var Player = function(name) {
	this.name = name,
	this.score = 0
};

Player.prototype.won = function() {
	this.score += 1
};

// check the cell if it's empty (with value O)
function check_cell(index) {
	return board[index];
}

// reset the board, update score, set first move for player 1, winning player is undefined
function next_game() {
	for(var i=0; i<board.length; i++) {
		$(".board_cell[id=" + i + "]").removeClass("first_player_cell second_player_cell");
		board[i] = 0;
	}

	$("input[name=player1]").val(player1.score);
	if (player2 !== undefined) {
		$("input[name=player2]").val(player2.score);	
	} else if (computer !== undefined) {
		$("input[name=player2]").val(computer.score);
	} 
	// set winning player to undefined
	winning_player = undefined;
	// first player starts the game first
	turn_player = player1;
}

// a player move
function move(cell, index) {
	if(turn_player === player1) {
		$(cell).addClass("first_player_cell");
	} else if(turn_player === player2 || turn_player === computer) {
		$(cell).addClass("second_player_cell");
	} 
		
	// keep record which player moved in particular cell
	board[index] = turn_player;

	if (computer !== undefined) {
		return computer_move();
	}
}

/*
function computer_move() {
	var help_board = board;
	// find if computer can win
	for (var i=0; i<help_board.length; i++) {
		help_board = computer;
		if()
	}
}
*/
// return next player turn 
function next_turn() {
	if (computer !== undefined) {
		turn_player = (turn_player === player1) ? computer : player1;
	} else {
		turn_player = (turn_player === player1) ? player2 : player1;
	}	
}

function end_game(result) {
	
	if (result !== "tie") {
		winning_player = result;
		alert(winning_player['name'] + " win!!! Congratulation!!!");
		winning_player.won();
	} else {
		alert("It's a tie! :)");
	}
	
	return next_game();
}

function check_winner() {
	// all winning combinations	
	var WIN_COMB = [[0, 1, 2], [3, 4, 5], [6, 7, 8], // horizonatal
	                [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
	        		[0, 4, 8], [2, 4, 6]]; 			 // diagonal

	for(var i=0; i<WIN_COMB.length; i++) {
	    if(board[WIN_COMB[i][0]] === board[WIN_COMB[i][1]] && board[WIN_COMB[i][0]] === board[WIN_COMB[i][2]] && 
	    	board[WIN_COMB[i][1]] === board[WIN_COMB[i][2]] && board[WIN_COMB[i][1]]!== 0) {
	    	
	        return end_game(turn_player);
	    }
    }

	// the whole board is filled, no more moving available
	if(board.indexOf(0) === -1){
	    return end_game("tie");
	}
   		
   	// if no winner, continue
   	return next_turn();
}
	
var	init_new_game = function(button) {	
	if (button === "btn-two_players") {
		player2 = new Player("Second player");
		$("h3#second_player").html("Player 2")
		$("h1#main_heading").html("tic tac toe for 2");
		computer = undefined;
		console.log(player2['name']);
	} else if (button === "btn-computer") {
		computer = new Player("Computer");
		$("h1#main_heading").html("tic tac toe against computer");
		$("h3#second_player").html("Computer");
		player2 = undefined;
		console.log(computer['name']);
	}
	player1 = new Player("First player");
	$("input[name=player1]").val(player1.score);
	if (player2 !== undefined) {
		$("input[name=player2]").val(player2.score);
	} else if (computer !== undefined) {
		$("input[name=player2]").val(computer.score);	
	}
	
	next_game();
};

$(document).ready(function() {
	// 
	init_new_game("btn-two_players");

	// get action when hovering over board cells
	$(".board_cell").hover(function () {
  	$(this).addClass("cell_hovered");
    }, function () {
        $(this).removeClass("cell_hovered");
    });

    $("button").click(function() {
    	var button = $(this).attr('id');
    	init_new_game(button);	
    });

	// get the appropriate action when the cell is clicked
	$(".board_cell").click(function() {
		var index = parseInt($(this).attr('id'));
		// check if cells are available until someone wins
		if(check_cell(index) === 0 && winning_player === undefined) {
			move(this, index);
			check_winner();
		}
	});
});