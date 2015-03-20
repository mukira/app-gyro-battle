'use strict';

/* global util */

/**
 * Game
 *
 * A position object is a basic JavaScript object
 * containing `alpha`, `beta` and `gamma` attributes.
 * 
 * @param {object} options   Parameters defining the game
 *   {Prompt} promptr   Promptr object to display information
 *   {Number} points    Amount of points to reach per game
 *   {Player} playerOne First player
 *   {Player} playerTwo Second player if necessary [optional]
 */
function Game (options) {
  this.promptr   = options.promptr;
  this.points    = options.points;
  this.players   = options.players;
  this.callback  = options.callback || function () {};
}

/**
 * Controls
 **********************************************************
 */

/**
 * Start the gane
 */
Game.prototype.start = function () {
  // Set up player one
  for (var i = 0; i < this.players.length; i++) {
    this.players[i]
      .resetViews()
      .resetScore()
      .setUI('gyro')
      .onGyro = this.positionChecker.bind(this);
  }

  // Start the game with the first position to find
  this.playNewPosition();
};

/**
 * Generate a new random position for the game.
 * And display it to the users
 */
Game.prototype.playNewPosition = function () {
  this.positionToFind = util.generateRandomPosition();
  this.promptr.setPositionToReach(this.positionToFind);
};

/**
 * Listener for new position from a remote
 * @param  {Player} player   Player object which has triggered the event
 * @param  {Object} position Position object
 */
Game.prototype.positionChecker = function (player, position) {
  util.roundPosition(position);
  player.setPosition(position);
  if (util.areEqualPositions(position, this.positionToFind)) {
    player.addPoint();
    
    // End of game or let's play a new position to find
    if (player.getScore() === this.points) {
      this.endOfGame(player);
    }
    else {
      this.playNewPosition();
    }
  }
};

/**
 * Method triggered when the game is finished.
 * The parameter is the winner player object.
 * This method will execute the callback of
 * this Game instance
 * @param  {Player} winnerPlayer Player object
 */
Game.prototype.endOfGame = function (winnerPlayer) {
  winnerPlayer.showGameResults(true);

  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i] !== winnerPlayer) {
      this.players[i].showGameResults(false);
    }
  }

  // Execute the callback
  this.callback();
};

/**
 * Method to destroy the remote listeners
 * and the current instance
 */
Game.prototype.destroy = function () {
  // Remove listeners
  for (var i = 0; i < this.players.length; i++) {
    this.players[i].onGyro = null;
  }
};