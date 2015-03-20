'use strict';

/**
 * util.js
 * little tooltips
 * 
 */

var util = {

  /**
   * Round position values
   * @param  {object} position Position object to round
   * @return {object}          Position object with rounded values
   */
  roundPosition: function (position) {
    position.alpha = position.alpha >> 5;
    position.beta  = position.beta  >> 5;
    position.gamma = position.gamma >> 5;
    return position;
  },

  /**
   * Generate a random position and return it
   * with rounded values
   * 
   * @return {object} Position object
   */
  generateRandomPosition: function () {
    return this.roundPosition({
      alpha: Math.random() * 360,
      beta:  (Math.random() - 0.5) * 360,
      gamma: (Math.random() - 0.5) * 180
    });
  },

  /**
   * Compare to position object to check if they are equal
   * @param  {Object} posA First position object
   * @param  {Object} posB Second position object
   * @return {Boolean}     True if equal
   */
  areEqualPositions: function (posA, posB) {
    return (posA.alpha === posB.alpha &&
            posA.beta  === posB.beta  &&
            posA.gamma === posB.gamma);
  }
};