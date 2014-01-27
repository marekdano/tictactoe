"use strict"

var board = [0,0,0,0,0,0,0,0,0];
// Two players play the game. Player "1" starts first.
var player = 1;
var winning_player = 0;


var check_cell = function(index) {
	return board[index];
};

var move = function(cell, index) {
	if(player === 1) {
		$(cell).addClass("first_player_cell");
	} else {
		$(cell).addClass("second_player_cell");
	}
	
	board[index] = player;
};

var next_turn = function(){
	player = (player === 1) ? 2 : 1;
	console.log("next turn " + player);
};

var end_game = function(result){
	if(typeof result === "number"){
		alert("Player " + winning_player + " win!!! Congratulation!!!");
	}
	if(result === "tie") {
		alert("It's a tie :)");
	}
	location.reload();
};

var check_winner = function() {
	// all winning combinations	
	var WIN_COMB = [[0, 1, 2], [3, 4, 5], [6, 7, 8], // horizonatal
        			[0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
        			[0, 4, 8], [2, 4, 6]]; 			 // diagonal

    for(var i=0; i<WIN_COMB.length; i++) {
    	if(board[WIN_COMB[i][0]] === board[WIN_COMB[i][1]] && board[WIN_COMB[i][0]] === board[WIN_COMB[i][2]] && 
    		board[WIN_COMB[i][1]] === board[WIN_COMB[i][2]] && board[WIN_COMB[i][1]]!== 0){
    		
    		winning_player = player;
    		return end_game(winning_player);
    	}
    }

    // the whole board is filled
    if(board.indexOf(0) === -1){
    	return end_game("tie");
    }
   	// if no winner, continue
    return next_turn();
};

$(document).ready(function(){
	$(".board_cell").hover(function () {
    	$(this).addClass("cell_hovered");
    }, function () {
        $(this).removeClass("cell_hovered");
    });

	$(".board_cell").click(function(){
		var index = parseInt($(this).attr('id'));
		if(check_cell(index) === 0 && winning_player == 0) {
			move(this, index);
			console.log(index);
			//console.log(check_winner());
			check_winner();
			
		}
	});
});