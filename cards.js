﻿var dragSource = null;

function handleDragEnter(e) {
	var id = e.target.getAttribute('id');
	id = (id != null) ? id : e.target.className;
	console.log("You are dragging over the " + id);
}

function handleDragLeave(e) {
	var id = e.target.getAttribute('id');
	id = (id != null) ? id : e.target.className;
	console.log("You left the " + id);
}

function handleDragDrop(e) {
	e.preventDefault();
	if (dragSource != null) {
		var card = $(dragSource).data('card');
		var hand = $(e.target).data('hand');
		dragSource.style.cursor = "default";
		dragSource =  null;
		var id = card.className;
		hand.addCard(card);
		hand.render();
		console.log("You droped " + id + " into " + hand.className);
	}
	droppedIn = true;
}

var droppedIn = false;
var activeEvent = '';
var originalX = '';
var originalY = '';

function handleDragStart(e) {
	var id = e.target.getAttribute('id');
	id = (id != null) ? id : e.target.className;
	dragSource = e.target;
	console.log("Dragging the element " + id);
	e.dataTransfer.dropEffect = "move";
	e.dataTransfer.setData("text", id);
}

function handleDragEnd(e) {
	if (droppedIn == false) {
		var id = e.target.getAttribute('id');
		id = (id != null) ? id : e.target.className;
		console.log("You let the " + id + " go.");
		dragSource = null;
	}
	droppedIn = false;
}

function handleTouchStart(e) {
	var id = e.target.getAttribute('id');
	id = (id != null) ? id : e.target.className;
    console.log("Touch start with element " + id);
	originalX = (e.target.offsetLeft - 10) + "px";
	originalY = (e.target.offsetTop - 10) + "px";
	activeEvent = 'start';
}

function handleTouchMove(e) {
	var touchLocation = e.targetTouches[0];
	var pageX = (touchLocation.pageX - 50) + "px";
	var pageY = (touchLocation.pageY - 50) + "px";
	console.log("Touch=(" + pageX + "," + pageY + ")");
	e.target.style.position = "absolute";
	e.target.style.left = pageX;
	e.target.style.top = pageY;
	activeEvent = 'move';
}

function handleTouchEnd(e) {
	e.preventDefault();
	if (activeEvent === 'move') {
		var pageX = (parseInt(e.target.style.left) - 50);
		var pageY = (parseInt(e.target.style.top) - 50);
		var id = e.target.getAttribute('id');
		id = (id != null) ? id : e.target.className;

		if (detectTouchEnd(dropZone.offsetLeft, dropZone.offsetTop, pageX, pageY, dropZone.offsetWidth, dropZone.offsetHeight)) {
			dropZone.appendChild(e.target);
			e.target.style.position = "initial";
			droppedIn = true;
			console.log("You droped " + id + " into drop zone");
		} else {
			e.target.style.left = originalX;
			e.target.style.top = originalY;
          	console.log("You let the " + id + " go.");
		}
	}
}
	

var cards = (function() {
	//The global options
	var opt = {
		cardSize : {width:69,height:94, padding:18},
		animationSpeed : 500,
		table : 'body',
		cardback : 'red',
		acesHigh : false,
		cardsUrl : 'img/cards.png',
		blackJoker : false,
		redJoker : false,
		decks : 1
	};
	var zIndexCounter = 1;
	var all = []; //All the cards created.
	
	function mouseEvent(ev) {
		var card = $(this).data('card');
		if (card.container) {
			var handler = card.container._click;
			if (handler) {
				handler.func.call(handler.context||window, card, ev);
			}
		}
	}
	
	function init(options) {
		if (options) {
			for (var i in options) {
				if (opt.hasOwnProperty(i)) {
					opt[i] = options[i];
				}
			}
		}
		for (var d = 0; d < opt.decks; ++d) {
			var start = opt.acesHigh ? 2 : 1;
			var end = start + 12;
			opt.table = $(opt.table)[0];
			if ($(opt.table).css('position') == 'static') {
				$(opt.table).css('position', 'relative');
			}
			for (var i = start; i <= end; i++) {
				all.push(new Card('h', i, opt.table));
				all.push(new Card('s', i, opt.table));
				all.push(new Card('d', i, opt.table));
				all.push(new Card('c', i, opt.table));
			}
			if (opt.blackJoker) {
				all.push(new Card('bj', 0, opt.table));
			}
			if (opt.redJoker) {
				all.push(new Card('rj', 0, opt.table));
			}
		}
		
		$('.card').click(mouseEvent);
		shuffle(all);
	}

    function shuffle(deck) {
        //Fisher yates shuffle
        var i = deck.length;
        if (i == 0) return;
        while (--i) {
            var j = Math.floor(Math.random() * (i + 1));
            var tempi = deck[i];
            var tempj = deck[j];
            deck[i] = tempj;
            deck[j] = tempi;
        }
    }
	
	function Card(suit, rank, table) {
		this.init(suit, rank, table);
	}

	Card.prototype = {
		init: function (suit, rank, table) {
			this.shortName = suit + rank;
			this.suit = suit;
			this.rank = rank;
			this.name = suit.toUpperCase()+rank;
			this.faceUp = false;
			this.el = $('<div draggable="true"><div/>').css({
				width:opt.cardSize.width,
				height:opt.cardSize.height,
				"background-image":'url('+ opt.cardsUrl + ')',
				position:'absolute',
				cursor:'pointer'
			}).addClass('card').data('card', this).appendTo($(table));
			this.showCard(0);
			this.moveToFront();
		},

		// Return card sort index: alternating colors: diamonds (lowest), clubs, hearts, spades (highest)
		sortIndex : function() {
			if (this.suit == 'd') {
				return this.rank;
			} else if (this.suit == 'c') {
				return this.rank + 14;
			} else if (this.suit == 'h') {
				return this.rank + 28;
			} else if (this.suit == 's') {
				return this.rank + 42;
			} else {
				return this.rank + 56;
			}
		},

		toString: function () {
			return this.name;
		},

		moveTo : function(x, y, speed, callback) {
			var props = {top:y-(opt.cardSize.height/2),left:x-(opt.cardSize.width/2)};
			$(this.el).animate(props, speed || opt.animationSpeed, callback);
		},
		
		rotate : function(angle) {
			$(this.el)
				.css('-webkit-transform', 'rotate(' + angle + 'deg)')
				.css('-moz-transform', 'rotate(' + angle + 'deg)')
				.css('-ms-transform', 'rotate(' + angle + 'deg)')
				.css('transform', 'rotate(' + angle + 'deg)')
				.css('-o-transform', 'rotate(' + angle + 'deg)');
		},
		
		showCard : function(angle) {
			var offsets = { "c": 0, "d": 1, "h": 2, "s": 3, "rj": 2, "bj": 3 };
			var xpos, ypos;
			var rank = this.rank;
			if (rank == 14) {
				rank = 1; //Aces high must work as well.
			}
			xpos = -rank * opt.cardSize.width;
			ypos = -offsets[this.suit] * opt.cardSize.height;
			this.rotate(angle);
			$(this.el).css('background-position', xpos + 'px ' + ypos + 'px');
		},

		hideCard : function(position) {
			var y = opt.cardback == 'red' ? 0*opt.cardSize.height : -1*opt.cardSize.height;
			$(this.el).css('background-position', '0px ' + y + 'px');
			this.rotate(0);
		},
		
		moveToFront : function() {
			$(this.el).css('z-index', zIndexCounter++);
		}		
	};
	
	function Container(angle) {
		this.angle = angle;
	
	}

	Container.prototype = new Array();
	Container.prototype.extend = function(obj) {
		for (var prop in obj) {
			this[prop] = obj[prop];
		}
	}
	Container.prototype.extend({
		addCard : function(card) {
			this.addCards([card]);
		},
		
		addCards : function(cards) {
			for (var i = 0; i < cards.length;i++) {
				var card = cards[i];
				if (card.container) {
					card.container.removeCard(card);
				}
				this.push(card);
				card.container = this;
			}
		},


		sortBySuit : function() {
			// Simple bubble sort for now
			for (var i = 0; i < this.length-1; i++) {
				for (var j = i+1; j < this.length; j++) {
					var c1 = this[i];
					var c2 = this[j];
					if (c1.sortIndex() > c2.sortIndex()) {
						// Swap cards if out of order
						this[i] = c2;
						this[j] = c1;
					}
				}
			}
		},
		
		removeCard : function(card) {
			for (var i=0; i< this.length;i++) {
				if (this[i] == card) {
					this.splice(i, 1);
					return true;
				}
			}
			return false;
		},

		init : function(options) {
			options = options || {};
			this.x = options.x || $(opt.table).width()/2;
			this.y = options.y || $(opt.table).height()/2;
			this.faceUp = options.faceUp;
		},

		click : function(func, context) {
			this._click = {func:func,context:context};
		},

		mousedown : function(func, context) {
			this._mousedown = {func:func,context:context};
		},
		
		mouseup : function(func, context) {
			this._mouseup = {func:func,context:context};
		},

		find(card) {
			for (var i=0; i<this.length;i++) {
				if (this[i] == card) {
					return i;
				}
			}
			return -1;
		},

		select(card) {
			var f = this.find(card);
			if (f == this.selected) {
				this.selected = -1;
				return true;		// true: Card already selected
			}
			this.selected = f;
			this.render();
			return false;			// false: New card selected
		},
		
		render : function(options) {
			options = options || {};
			var speed = options.speed || opt.animationSpeed;
			this.calcPosition(options);
			for (var i=0;i<this.length;i++) {
				var card = this[i];
				zIndexCounter++;
				card.moveToFront();
				var offset = (this.selected == i) ? 50 : 0;
				var top = parseInt($(card.el).css('top'));
				var left = parseInt($(card.el).css('left'));
				if (top != card.targetTop - offset || left != card.targetLeft) {
					var props = {top:card.targetTop - offset, left:card.targetLeft, queue:false};
					if (options.immediate) {
						$(card.el).css(props);
					} else {
						$(card.el).animate(props, speed);
					}
				}
			}
			var me = this;
			var flip = function(){
				for (var i=0;i<me.length;i++) {
					if (me.faceUp) {
						me[i].showCard(me.angle);
					} else {
						me[i].hideCard();
					}
				}
			}
			if (options.immediate) {
				flip();
			} else {
				setTimeout(flip, speed /2);
			}
			
			if (options.callback) {
				setTimeout(options.callback, speed);
			}
		},
		
		topCard : function() {
			return this[this.length-1];
		},
		
		toString: function() {
			return 'Container';
		}
	});
	
	function Deck(options) {
		this.init(options);
	}
	
	Deck.prototype = new Container();
	Deck.prototype.extend({
		calcPosition : function(options) {
			options = options || {};
			var left = Math.round(this.x-opt.cardSize.width/2, 0);
			var top = Math.round(this.y-opt.cardSize.height/2, 0);
			var condenseCount = 6;
			for (var i=0;i<this.length;i++) {
				if (i > 0 && i % condenseCount == 0) {
					top-=1;
					left-=1;
				}
				this[i].targetTop = top;
				this[i].targetLeft = left;
			}
		},
		
		toString : function() {
			return 'Deck';
		},
		
		deal : function(count, hands, speed, callback) {
			var me = this;
			var i = 0;
			var num = hands.length;
			var totalCount = count*num;
			function dealOne() {
				if (me.length == 0 || i == totalCount) {
					if (callback) {
						callback();
					}
					return;
				}
				var handno = i % num;
				hands[handno].addCard(me.topCard());
				if (i >= totalCount - num) {
					// If last round sort hand by suit for convenience
					hands[handno].sortBySuit();
				}
				hands[handno].render({callback:dealOne, speed:speed});
				i++;
			}
			dealOne();
		}
	});

	function Hand(options) {
		this.init(options);
		// Create css object for Hand
		var table = opt.table;
		if (table) {
			var maxwidth = opt.cardSize.width + opt.cardSize.padding * options.max;
			var height = opt.cardSize.height;
			var x = options.x - maxwidth / 2;
			var y = options.y - height / 2;
			var html = options.buttons ? options.buttons : "";
			this.el = $("<div/>").html(html).css({
				width:maxwidth,
				height:height,
				left:x,
				top:y,
				position:'absolute',
				cursor:'pointer'	
			}).addClass('hand').data('hand', this).appendTo($(table));
		}
	}
	Hand.prototype = new Container(0);
	Hand.prototype.extend({
		addCard : function(card) {
			// Add card to Hand
			this.addCards([card]);
			// derived from: https://javascript.info/mouse-drag-and-drop
			var css = card.el[0];
			css.ondragstart = function() {
				return false;
			}
			css.onmousedownX = function(event) {
				// (1) start the process
				var rect = css.getBoundingClientRect();
				var shiftX = event.clientX - rect.left;
				var shiftY = event.clientY - rect.top;			  
			
				// (2) prepare to moving: make absolute and on top by z-index
				css.style.position = 'absolute';
				css.style.zIndex = zIndexCounter++;
				// move it out of any current parents directly into body
				// to make it positioned relative to the body
				document.body.append(css);
				// ...and put that absolutely positioned object under the pointer
			  
				moveAt(event.pageX, event.pageY);
			  
				// centers the ball at (pageX, pageY) coordinates
				function moveAt(x, y) {
				  css.style.left = x - shiftX + 'px';
				  css.style.top = y - shiftY + 'px';
				}
			  
				function onMouseMove(event) {
				  moveAt(event.pageX, event.pageY);
				}
			  
				// (3) move the ball on mousemove
				document.addEventListener('mousemove', onMouseMove);
			  
				// (4) drop the ball, remove unneeded handlers
				css.onmouseup = function() {
				  document.removeEventListener('mousemove', onMouseMove);
				  css.onmouseup = null;
				};
			  
			  };
			
		},

		calcPosition : function(options) {
			options = options || {};
			if (this.angle == 0) {
				// Horizontal hand
				var width = opt.cardSize.width + (this.length-1)*opt.cardSize.padding;
				var left = Math.round(this.x - width/2);
				var top = Math.round(this.y-opt.cardSize.height/2);
				for (var i=0;i<this.length;i++) {
					this[i].targetTop = top;
					this[i].targetLeft = left+i*opt.cardSize.padding;
				}
			} else {
				// Vertical hand
				var sign = (this.angle == 90) ? +1 : -1;
				var height = opt.cardSize.width*sign + (this.length-1)*opt.cardSize.padding;
				var left = Math.round(this.x-opt.cardSize.height/2);
				var pos = Math.round(this.y-sign*height/2);
				for (var i=0;i<this.length;i++) {
					this[i].targetTop = pos+i*sign*opt.cardSize.padding;
					this[i].targetLeft = left;
				}
			}
		},
		
		toString : function() {
			return 'Hand';
		}
	});
	
	function Pile(options) {
		this.init(options);
	}
	
	Pile.prototype = new Container();
	Pile.prototype.extend({
		calcPosition : function(options) {
			options = options || {};
		},
		
		toString : function() {
			return 'Pile';
		},
		
		deal : function(count, hands) {
			if (!this.dealCounter) {
				this.dealCounter = count * hands.length;
			}
		}
	});
	

	return {
		init : init,
		all : all,
		options : opt,
		SIZE : opt.cardSize,
		Card : Card,
		Container : Container,
		Deck : Deck,
		Hand : Hand,
		Pile : Pile,
		shuffle: shuffle
	};
})();

if (typeof module !== 'undefined') {
	module.exports = cards;
	
    module.exports = handleDragEnter;
    module.exports = handleDragLeave;
	module.exports = handleDragDrop;

	module.exports = handleDragStart;
	module.exports = handleDragEnd;

    module.exports = handleTouchStart;
    module.exports = handleTouchMove;
	module.exports = handleTouchEnd;
}

