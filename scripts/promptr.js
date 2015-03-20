'use strict';

/* global QRCode */

/**
 * Prompt
 * The prompt is the display box to give information
 * to users.
 */

/**
 * Constructor
 * The function take the dom element as parameter
 * which will be used as prompter
 * @param {DOMelement} el Promptr view
 */
function Promptr (el) {
  // Set DOM elements in the instance to get a quick access
  this.el = el;
  this.panels = {
    intro:    el.querySelector('.intro'),
    playing:  el.querySelector('.playing'),
    error:    el.querySelector('.error')
  };
  this.qrcode = {
    text:     this.panels.intro.querySelector('.qrcode-url'),
    wrap:     this.panels.intro.querySelector('.qrcode-wrap')
  };
  this.positionDom = {
    alpha:    this.panels.playing.querySelector('.alpha-view'),
    beta:     this.panels.playing.querySelector('.beta-view'),
    gamma:    this.panels.playing.querySelector('.gamma-view')
  };
  this.errorLabelDom = this.panels.error.querySelector('.error-label');

  this.showPanel('intro');
}

/**
 * Show the promptr panel requested.
 * 3 panels are available:
 *  - `intro`:    The homescreen of the app, with instructions and connection url
 *  - `playing`:  With the help and the values to reach
 *  - `error`:    In case of error
 * @param  {String} stateName Name of the panel to display
 * @return {Prompt}           Promptr instance
 */
Promptr.prototype.showPanel = function (stateName) {
  if (this.currentPanel === stateName) {
    return;
  }
  this.currentPanel = stateName;
  for (var i in this.panels) {
    this.panels[i].style.display = (i === stateName) ? 'block' : 'none';
  }
  return this;
};

/**
 * Display a position on the promptr (on the playing panel)
 * @param  {Object} position Position object to display
 * @return {Prompt}          Promptr instance
 */
Promptr.prototype.setPositionToReach = function (position) {
  this.positionDom.alpha.textContent = position.alpha;
  this.positionDom.beta.textContent  = position.beta;
  this.positionDom.gamma.textContent = position.gamma;
  this.showPanel('playing');
  return this;
};

/**
 * Display a url (via QRcode) on the promptr (on the intro panel)
 * @param  {String} url URL to display
 * @return {Prompt}     Promptr instance
 */
Promptr.prototype.setConnectionUrl = function (url) {
  var mordor;
  this.qrcode.wrap.innerHTML = '';
  this.qrcode.text.textContent = url;
  mordor = new QRCode(this.qrcode.wrap, {
    text: url,
    width: 128,
    height: 128
  });
  this.showPanel('intro');
  return this;
};

/**
 * Display an error on the promptr (on the error panel)
 * @param  {String} msg    Error message to display
 * @return {Prompt}        Promptr instance
 */
Promptr.prototype.setError = function (msg) {
  this.errorLabelDom.textContent = msg;
  this.showPanel('error');
  return this;
};