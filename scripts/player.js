'use strict';

/**
 * Player
 *
 * An instance of this class represent a player, by
 * the combinaison of a Remote object and a view.
 * 
 * @param {Remote}      remote Liwe remote object
 * @param {DOMelement}  el     Player view
 */
function Player (remote, el) {
  this.remote  = remote;
  this.el      = el;

  this.el.style.background = '#' + remote.config.color;
  this.el.classList.add('active');
  
  this.initViews();
  this.resetScore();
  this.listenEvents();
}

/**
 * Get the view elements in the Player view
 * 
 */
Player.prototype.initViews = function () {
  // Set DOM elements in the instance to get a quick access
  this.title    = this.el.querySelector('.headline');
  this.info     = this.el.querySelector('.info');
  this.position = this.el.querySelector('.position-view');
  this.positionDom = {
    alpha:    this.position.querySelector('.alpha-view'),
    beta:     this.position.querySelector('.beta-view'),
    gamma:    this.position.querySelector('.gamma-view')
  };
  return this.resetViews();
};

/**
 * Reset the player view
 * @return {Player} Player instance
 */
Player.prototype.resetViews = function () {
  return this.setContent();
};

/**
 * Listen the remote event
 * 
 */
Player.prototype.listenEvents = function () {
  var self = this;

  this.remote.off('gyro');
  this.remote.off('button');

  this.remote.on('gyro', function (e) {
    if (self.onGyro) {
      self.onGyro(self, e);
    }
  });
  this.remote.on('button', function (e) {
    if (self.onButton) {
      self.onButton(self, e);
    }
  });
};


/**
 * Score 
 **********************************************************
 */

/**
 * Increment the score by one point
 * @return {Player} Player instance
 */
Player.prototype.addPoint = function () {
  this.pointCounter++;
  return this.updateScoreView();
};

/**
 * Get the score
 * @return {Number} Current score
 */
Player.prototype.getScore = function () {
  return this.pointCounter;
};

/**
 * Reset score
 * @return {Player} Player instance
 */
Player.prototype.resetScore = function () {
  this.pointCounter = 0;
  return this.updateScoreView();
};

/**
 * Update score view
 * @return {Player} Player instance
 */
Player.prototype.updateScoreView = function () {
  return this.setContent('Your score: ' + this.pointCounter, '', true);
};


/**
 * Remote 
 **********************************************************
 */

/**
 * Wrapper for the `setUI` method of the
 * remote instance of this Player object
 * @param  {string}   uiName   UI name to set up on the remote
 * @return {Player}            Player instance
 */
Player.prototype.setUI = function (uiName) {
  this.remote.setUI(uiName);
  return this;
};


/**
 * Controls 
 **********************************************************
 */

/**
 * Display the results on the player view when a
 * game finishes.
 * @param  {Boolean} isWinner True if the player is the winner
 * @return {Player}           Player instance
 */
Player.prototype.showGameResults = function (isWinner) {
  return this.setContent(isWinner ? 'You WIN!' : 'Sorry Bud');
};

/**
 * Set the content in the player view
 * @param {String}  headline     View title
 * @param {String}  info         View info
 * @param {Boolean} showPosition Show/hide position view
 */
Player.prototype.setContent = function (headline, info, showPosition) {
  this.title.textContent      = headline || '';
  this.info.textContent       = info ||  '';
  this.position.style.display = showPosition ? 'block' : 'none';
  return this;
};

/**
 * Display a position on the player view
 * @param  {Object} position Position object to display
 * @return {Player}          Player instance
 */
Player.prototype.setPosition = function (position) {
  this.positionDom.alpha.textContent = position.alpha;
  this.positionDom.beta.textContent  = position.beta;
  this.positionDom.gamma.textContent = position.gamma;
  return this;
};

/**
 * Wrapper for the `on` method of the
 * remote instance of this Player object
 * @param  {string}   name     Name of the event to listen
 * @param  {function} listener Listener function for the event
 * @return {Player}            Player instance
 */
Player.prototype.remove = function () {
  this.el.classList.remove('active');
  this.remote = null;
  this.el     = null;
};
