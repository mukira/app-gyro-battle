'use strict';

/* global Liwe, Game, Player, Promptr, console */

/**
 * GyroBattle contructor
 * @param {[type]} liweParams [description]
 */
function GyroBattle (liweParams) {

  // Force maximum 2 simultaneous remote connected
  liweParams.maxRemoteConn = 2;

  // Create object
  this.players = {};
  this.promptr = new Promptr(document.getElementById('promptr'));
  this.liwe    = new Liwe(liweParams);

  this.liwe.on('connect',    this.onConnect.bind(this));
  this.liwe.on('error',      this.onError.bind(this));
  this.liwe.on('new_remote', this.onNewRemote.bind(this));

  // Let's start the magic
  this.liwe.connect();
}

/**
 * Consts
 **********************************************************
 */

/**
 * Amount of point to win a game
 * @type {Number}
 */
GyroBattle.prototype.POINTS_PER_GAME = 5;

/**
 * Countdown duration before start
 * a game. In seconds.
 * @type {Number}
 */
GyroBattle.prototype.COUNTDOWN_BEFORE_START = 3;


/**
 * Liwe listeners
 **********************************************************
 */

/**
 * Listener when Liwe connection is established
 * @param  {object} info Liwe connection info object
 */
GyroBattle.prototype.onConnect = function (info) {
  this.showInstructions(info);
};

/**
 * Listener when Liwe encounter an error
 * @param  {string} error Error message
 */
GyroBattle.prototype.onError = function (error) {
  console.log('%cGyroBattle [error]', 'background:red; color:white; font-weight:bold;', error);

  if (this.game) {
    this.game.destroy();
  }
  this.promptr.setError('Ouch, something bad happen, sorry.');
};

/**
 * Listener when Liwe get a new remote
 * @param {Remote} remote Remote object
 */
GyroBattle.prototype.onNewRemote = function (remote) {
  
  // Build a Player from this remote
  var playerIndex = !this.players.one ? 'one' : 'two',
      myPlayer    = new Player(remote, document.getElementById('player-' + playerIndex));

  this.players[playerIndex] = myPlayer;
  
  // Set up the button UI
  myPlayer
    .setContent('Player ' + playerIndex + ' connected', 'Press the button your smartphone to start')
    .setUI('button');

  // Listen the 'press_button' event to update the
  // animation
  myPlayer.onButton = function (remote, e) {
    if (e.type !== 'press' || this.game) {
      return;
    }

    // Generate the array of players
    var players = [];
    if (this.players.one) {
      players.push(this.players.one);
    }
    if (this.players.two) {
      players.push(this.players.two);
    }

    // Start a new GAME
    this.game = new Game({
      promptr:   this.promptr,
      points:    this.POINTS_PER_GAME,
      players:   players,
      callback:  this.destroyCurrentGame.bind(this)
    });
    this.game.start();
  }.bind(this);

  // Listen the remote disconnection event to show
  // back connection url
  myPlayer.remote.on('disconnect', function () {
    this.destroyCurrentGame();
    myPlayer.remove();
    this.players[playerIndex] = null;
  }.bind(this));
};


/**
 * Utils
 **********************************************************
 */

/**
 * Display instruction on the Prompt instance
 * to help the user.
 * Shows instructions with connection URL when the
 * current amount of connected remotes hasn't reach the maximum
 * and just instructions otherwise.
 * @param  {object} info Liwe connection info object [optional]
 */
GyroBattle.prototype.showInstructions = function (info) {
  var url = (info && info.url) || (this.liwe && this.liwe.info && this.liwe.info.url);
  if (url) {
    this.promptr.setConnectionUrl(url);
  }
};

/**
 * Destroy current game by destroying the instance,
 * redisplaying instructions on the prompt and
 * set the button UI on connected remotes.
 */
GyroBattle.prototype.destroyCurrentGame = function () {
  if (this.game) {
    this.game.destroy();
    this.game = null;
  }
  this.promptr.showPanel('intro');
  if (this.players.one) {
    this.players.one.setUI('button');
  }
  if (this.players.two) {
    this.players.two.setUI('button');
  }
};