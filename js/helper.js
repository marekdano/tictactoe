"use strict";

// initialize an empty board;
var	board = [0,0,0,0,0,0,0,0,0];
// Two players play the game. Player "1" starts first.
var turn_player = 1;
// variable stores wining player
var	winning_player;
// two players
var	player1, player2;


var Player = function(number){
	this.number = number;
	this.score = 0;
};

Player.prototype.won = function() {
	this.score += 1;
};
	
var	init_new_game = function() {
	player1 = new Player(1);
	player2 = new Player(2);
	$("input[name=player1]").val(player1.score);
	$("input[name=player2]").val(player2.score);
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
	$("input[name=player2]").val(player2.score);
	turn_player = 1;
	winning_player = undefined;
}

// a player move
function move(cell, index) {
	if(turn_player === 1) {
		$(cell).addClass("first_player_cell");
	} else {
		$(cell).addClass("second_player_cell");
	}
		
	// keep record which player moved in particular cell
	board[index] = turn_player;
}

// return next player turn 
function next_turn() {
	turn_player = (turn_player === 1) ? 2 : 1;
}

function end_game(result) {
	if(typeof result === "number"){
		alert("Player " + winning_player + " win!!! Congratulation!!!");
		if (result === 1) {
			player1.won();
		} else if(result === 2){
			player2.won();
		}
	}

	if(result === "tie") {
		alert("It's a tie :)");
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
	    	
	    	winning_player = turn_player;
	        return end_game(winning_player);
	    }
    }

	// the whole board is filled, no more moving available
	if(board.indexOf(0) === -1){
	    return end_game("tie");
	}
   		
   	// if no winner, continue
   	return next_turn();
}

$(document).ready(function(){
	init_new_game();

	// get action when hovering over board cells
	$(".board_cell").hover(function () {
  	$(this).addClass("cell_hovered");
    }, function () {
        $(this).removeClass("cell_hovered");
    });

	// get the appropriate action when the cell is clicked
	$(".board_cell").click(function(){
		var index = parseInt($(this).attr('id'));
		// check if cells are available until someone wins
		if(check_cell(index) === 0 && winning_player === undefined) {
			move(this, index);
			check_winner();
		}
	});
});