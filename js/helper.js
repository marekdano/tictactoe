class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
  }

  won() {
    this.score += 1;
  }
}

const Game = {
  // initialize an empty board;
  board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  // all winning combinations 
  WIN_COMBS: [[0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
              [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
              [0, 4, 8], [2, 4, 6]],        // diagonal
  //best moves in order
  BEST_MOVES: [4, 0, 2, 6, 8, 1, 3, 5, 7],
  // winning player of the game
  winningPlayer: null,
  // Two players play the game. First player starts first.
  turnPlayer: null,
  // two players or player against computer
  player1: null, 
  player2: null, 
  computer: null,

  // check the cell if it's empty (with value O)
  checkCell: function(index) {
    return this.board[index];
  },

  getWinningPlayer: function() {
    return this.winningPlayer;
  },

  getComputer: function() {
    return this.computer;
  },

  move: function(cell, index) {
   	if(this.turnPlayer === this.player1) {
      cell.classList.add('first_player_cell') 
    } else if(this.turnPlayer === this.player2) {
      cell.classList.add('second_player_cell') 
    } 
    // assign a player to the cell
    this.board[index] = this.turnPlayer;
  },

  /**
   * Check for the best computer move.  
   * First add a computer move to empty field and check if computer can win. 
   * If yes, move computer there.
   * Second add a human move to empty field and check if human can win. 
   * If yes, move computer there.
   * If no move in the combination of moves for computer and human is found, 
   * move computer in one of the best moves. 
   */
  computerMove: function() {
    let isCellSelected = false;
    // find if player or computer can win by pretending a player move
    function getCellByPlayer(player) {
      for(let i=0; i<this.board.length; i++) {
        if(this.board[i] === 0) {
          this.board[i] = player;
          if(this.checkMove(this.board)) {
            this.board[i] = this.turnPlayer;
            document.querySelector(`.board_cell[id="${i}"]`).classList.add('second_player_cell') 
            isCellSelected = true;
            return
          }
          this.board[i] = 0;
        }
      } 
    }
    
    getCellByPlayer.call(this, this.computer);
    !isCellSelected && getCellByPlayer.call(this, this.player1);
    
    if (!isCellSelected) {
      // move computer in one of the best moves
      for (let k=0; k<this.BEST_MOVES.length; k++) {
        if(this.board[this.BEST_MOVES[k]] === 0) {
          this.board[this.BEST_MOVES[k]] = this.turnPlayer;
          document.querySelector(`.board_cell[id="${this.BEST_MOVES[k]}"]`).classList.add('second_player_cell')   
          return;
        }
      }
    }
  },

  // check if a new move is the winning
  checkMove: function(board) {
    const WIN_COMBS = this.WIN_COMBS;
    for(let i=0; i<WIN_COMBS.length; i++) {
      if(board[WIN_COMBS[i][0]] === board[WIN_COMBS[i][1]] && board[WIN_COMBS[i][0]] === board[WIN_COMBS[i][2]] && 
        board[WIN_COMBS[i][1]] === board[WIN_COMBS[i][2]] && board[WIN_COMBS[i][1]]!== 0) {
        
        return true;
      }
    }
    return false;
  },

  // return next player turn 
  nextPlayer: function() {
    // if computer is defined, game between computer and human
    if (this.computer) {
     	this.turnPlayer = (this.turnPlayer === this.player1) ? this.computer : this.player1;
    } else {
     	this.turnPlayer = (this.turnPlayer === this.player1) ? this.player2 : this.player1;
    } 
  },

  /**
   * Check if there is a winner:
   * If yes, return true. If not, return false
   * If there is no winner and there is no more moves available, return the string tie.
   */
  checkWinner: function() {
    if(this.checkMove(this.board)) return true;

    // the whole board is filled, no more moving available
    if(this.board.indexOf(0) === -1) return "tie";
    
    // no winner found
    return false;
  },

  /**
   * Displays the result of the game (winner name, tie) and set up a new game
   * @param {string} result 
   */
  end: function(result) {
    if (result !== "tie") {
      this.winningPlayer = this.turnPlayer;
      confirm(this.winningPlayer['name'] + " wins!!! Congratulation!!! Do you want to continue?");
      this.winningPlayer.won();
      this.nextGame();
      return;
    }
    confirm(`It's a tie :)! Do you want to continue?`);
    this.nextGame();
  },

  resetBoard: function() {
  	for(let i=0; i<this.board.length; i++) {
      document.querySelector(`.board_cell[id="${i}"]`).classList.remove('first_player_cell', 'second_player_cell')
      this.board[i] = 0;
    }
    
    // set winning player to null
    this.winningPlayer = null;
    // first player always starts the game as first
    this.turnPlayer = this.player1;
  },

  /**
   * Reset the board, update score, set first move for player1, set winningPlayer to null
   */
  nextGame: function() {
  	this.resetBoard();
    // update the score
    document.querySelector('input[name=playerOne]').value = this.player1.score;
    // if player2 is defined, the player2 score is displayed
    if (this.player2) document.querySelector('input[name=playerTwo]').value = this.player2.score;
    // if computer is defined, the player2 score is displayed
    if (this.computer) document.querySelector('input[name=playerTwo]').value = this.computer.score;
    // set winning player to null
    this.winningPlayer = null;
    // first player starts the game first
    this.turnPlayer = this.player1;
  },

  /**
   * Initialize a new game every time when the page is loaded or the buttons 
   * (two players or computer) are hit
   * @param {string} button 
   */
  initNew: function(button) { 
  	if (button === "btn-two_players") {
     	this.player2 = new Player("Second player");
      document.querySelector('h3#second_player').innerHTML = 'Player 2';
      document.querySelector('h1#main_heading').innerHTML = 'tic tac toe for 2';
     	this.computer = null;
    } else if (button === "btn-computer") {
     	this.computer = new Player("Computer");
      document.querySelector('h1#main_heading').innerHTML = 'tic tac toe against computer';
      document.querySelector('h3#second_player').innerHTML = 'Computer';
     	this.player2 = null;
    }
    this.player1 = new Player("First player");
    
    return this.nextGame();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // initialize a new game when the page is loaded
  Game.initNew("btn-two_players");

  // listen for hovering over board cells
  document.querySelector('#board').addEventListener('mouseover', (e) => {
    const div = e.target
    if (+div.id >=0 && +div.id < 9) e.target.classList.add('cell_hovered')
  })
  document.querySelector('#board').addEventListener('mouseout', (e) => {
    const div = e.target
    if (+div.id >=0 && +div.id < 9) e.target.classList.remove('cell_hovered')
  })
  
  // if one of two buttons are hit initialize a new game 
  document.querySelector('#action-btns').addEventListener('click', (e) => {
    const buttonName = e.target.id;
    (buttonName === "btn-reset") ? Game.resetBoard() : Game.initNew(buttonName); 
  });
  
  // get the appropriate action when the cell is clicked
  document.querySelector('#board').addEventListener('click', function(e) {
    const attrValue = e.target.id;
    const index = parseInt(attrValue);
    // check if cells are available until someone wins
    if(Game.checkCell(index) === 0 && Game.getWinningPlayer() === null) {
      Game.move(e.target, index);
      let result = Game.checkWinner();
      if (result || result === "tie") {
        setTimeout(() => Game.end(result), 0);
      } else {
        Game.nextPlayer();
        if(Game.getComputer()) {
          Game.computerMove();
          result = Game.checkWinner();
          if (result || result === "tie") {
            setTimeout(() => Game.end(result), 0);
            return
          }
          Game.nextPlayer();
        }
      }
    }
  });
});
