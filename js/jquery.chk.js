(function($) {
	/**
	 * A general object for ticking a set of values up or down
	 *
	 * Each tick is done on a unit (e.g. hour / minute / second)
	 * And compared against all the fractions of the unit e.g. seconds are fractions of a minte
	 * Short for chained tick I think of it as 'chuck' rather than 'check', i.e. 'chuck up'
	 * Also see: @link https://en.wikipedia.org/wiki/!!!
	 *
	 * This code was based off https://github.com/kellishaver/stopwatch but pretty much all that is left of that are the zeroPad and hand functions
	 */
	$.fn.chk = function() {
		/**
		 * The checkSum to see if the current unit should tick up or down
		 *
		 * This is the magic to allow all the chaining
		 * It means that a larger unit will only tick when all smaller factions have just 'ticked'
		 * Going up we know that all the values have ticked if they are zero
		 * Going down we know that all the values have ticked if they are one less than the limit e.g. 59 seconds
		 * The default of null means always tick
		 * @type Number
		 */
		this.checkSum = null;

		/**
		 * Stopwatch style tick up
		 * @param  Object unitElement jQuery element
		 * @param  Number limit       The count at which to overflow and cycle back
		 * @return this               Allow for chaining
		 */
		this.up = function(unitElement, limit, func) {
			/**
			 * What to set the value to when it overflows the limit
			 * @type Number
			 */
			var overflow = 0;
			var oldHand = this.hand(unitElement);
			var newHand = this.countUp(oldHand, this.checkSum, limit, overflow);
			this.callback(func, newHand, oldHand);
			this.update(unitElement, newHand, overflow);
			return this;
		};

		/**
		 * Tick up
		 * @param  Number unit     The current value
		 * @param  Number checkSum Whether to tick this value up by one
		 * @param  Number limit    The count of how many units e.g. (gone in) 60 seconds
		 * @param  Number overflow Where to go when you're over the limit (avoiding jail)
		 * @return Number          The ticked unit - this will be the same as unit unless the checkSum is zero
		 */
		this.countUp = function(unit, checkSum, limit, overflow) {
			if (this.check(checkSum)) {
				unit++;
			}
			if (unit >= limit) {
				return overflow;
			}
			return unit;
		};

		/**
		 * Timer style tick down
		 * @param  Object unitElement jQuery element
		 * @param  Number limit       The count at which to overflow and cycle back
		 * @return this               Allow for chaining
		 */
		this.down = function(unitElement, limit, func) {
			/**
			 * What to set the value to when it overflows the limit
			 * @type Number
			 */
			var overflow = limit - 1;
			var oldHand = this.hand(unitElement);
			var newHand = this.countDown(oldHand, this.checkSum, limit, overflow);
			this.callback(func, newHand, oldHand);
			this.update(unitElement, newHand, overflow);
			return this;
		};

		/**
		 * Tick down
		 * @param  Number unit     The current value
		 * @param  Number checkSum Whether to tick this value up by one
		 * @param  Number limit    The count of how many units e.g. (gone in) 60 seconds
		 * @param  Number overflow Where to go when you're over the limit (avoiding jail)
		 * @return Number          The ticked unit - this will be the same as unit unless the checkSum is zero
		 */
		this.countDown = function(unit, checkSum, limit, overflow) {
			// allow people to set the limit to zero as that makes more sense
			if (overflow < 0) {
				overflow = 0;
			}
			if (this.check(checkSum)) {
				unit--;
			}
			if (unit < 0) {
				return overflow;
			}
			return unit;
		};

		this.callback = function(func, newHand, oldHand) {
			if (typeof func == 'function' && newHand != oldHand) {
				try {
					func();
				} catch (e) {
					// bury the chker
				}
			}
		};

		this.check = function(checkSum) {
			return typeof(checkSum) === undefined || checkSum === null || checkSum === 0;
		};

		this.update = function(unitElement, newHand, overflow) {
			unitElement.html(this.zeroPad(newHand));
			// this here is the bit that makes it all tick
			this.checkSum += (newHand - overflow);
		};

		/**
		 * Pad numbers with a single zero for printing
		 *
		 * @todo This needs to be more generic based on the limit e.g. handling 1000ths of a second
		 * @param  Number newHand The new value to print
		 * @return String         01, ..., 09, 10, ...
		 */
		this.zeroPad = function (newHand) {
			return "0".substring(newHand >= 10) + newHand;
		};

		/**
		 * The value of one of the clock 'hands'
		 *
		 * The meaning doesn't apply if you're using values that aren't hours / minutes / seconds
		 * But it's just getting the value for the current unit
		 * Oh just fork it and call it what ever you want
		 * Talk to the hand
		 * @param  Object unitElement jQuery element
		 * @return Number             The integer value
		 */
		this.hand = function(unitElement) {
			// parseInt() doesn't work here...
			return parseFloat(unitElement.text());
		};

		return this;
	};

})(jQuery);