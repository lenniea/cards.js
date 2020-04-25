//const cards = require('./cards')

var deck;

function makeDecks(players) {

	var d = (parseInt(players) + 1) / 2 + 2;
	var numDecks = Math.trunc(d);

	//Tell the library which element to use for the table
	cards.init({table:'#card-table', cardback:'blue', blackJoker:true, redJoker:true, decks:numDecks});

	//Create a new deck of cards
	deck = new cards.Deck(); 
	//By default it's in the middle of the container, put it slightly to the side
	deck.x -= 130;
	deck.y -= 50;

	// cards.all contains all cards, put them all in the deck
	deck.addCards(cards.all); 
	//deck.addCards(Cards.all);
	//No animation here, just get the deck onto the table.
	deck.render({immediate:true});
}

var lastCard;
var oldBuyClubs;
var oldBuyDiamonds;
var oldBuyHearts;
var oldBuySpades;

var playerhand = [];
var turn;

var x1 = 210;
var x2 = 360;
var xc = 725;
var x3 = 1090;
var x4 = 1240;
var y1 = 55;
var y2 = 285;
var yc = 400;
var y3 = 515;
var y4 = 745;

var xpos4 = [xc,x4,xc,x1];
var ypos4 = [y1,yc,y4,yc];

var xpos5 = [x2,x3,x4,xc,x1]; 
var ypos5 = [y1,y1,yc,y4,yc];

var xpos6 = [xc,x4,x4,xc,x1,x1]; 
var ypos6 = [y1,y2,y3,y4,y3,y2];

var xpos7 = [x2,x3,x4,x4,xc,x1,x1]; 
var ypos7 = [y1,y1,y2,y3,y4,y3,y2];

var xpos8 = [x2,x3,x4,x4,x3,x2,x1,x1]; 
var ypos8 = [y1,y1,y2,y3,y4,y4,y3,y2];

var xpos9 = [x2,x3,x4,x4,x4,xc,x1,x1,x1]; 
var ypos9 = [y1,y1,y2,y3,y4,y4,y4,y3,y2];

var xpos10 = [x1,xc,x4,x4,x4,x4,xc,x1,x1,x1]; 
var ypos10 = [y1,y1,y1,y2,y3,y4,y4,y4,y3,y2];

var xpos = [xpos4,xpos5,xpos6,xpos7,xpos8,xpos9,xpos10];
var ypos = [ypos4,ypos5,ypos6,ypos7,ypos8,ypos9,ypos10];

function makeHands(players) {
	//Lets add a oldBuy pile
	lastCard = new cards.Deck({faceUp:true});
	lastCard.x -= 130;
	lastCard.y += 50;
	var xoldBuy = 850;
	var yoldBuy = 250;

	// Create oldBuy piles (per suit)
	oldBuySpades = new cards.Hand({faceUp:true, x:xoldBuy, y:yoldBuy, max:13});
	oldBuyHearts = new cards.Hand({faceUp:true, x:xoldBuy, y:yoldBuy+100, max:13});
	oldBuyClubs = new cards.Hand({faceUp:true, x:xoldBuy, y:yoldBuy+200, max:13});
	oldBuyDiamonds = new cards.Hand({faceUp:true, x:xoldBuy, y:yoldBuy+300, max:13});

	for (var i=0; i < players; i++) {
		var xp = xpos[players-4][i];
		var yp = ypos[players-4][i];
		playerhand[i] = new cards.Hand({faceUp:true, x:xp, y:yp, max:30});
	}
	
	var t = (parseInt(players)+1)/2;
	turn = Math.trunc(t);

	//When you click on the top card of a deck, a card is added
	//to your playerhand
	deck.click(function(card){
		if (card === deck.topCard()) {
			playerhand[turn].addCard(deck.topCard());
			playerhand[turn].render();
		}
	});

	// When you click on the oldBuy pile card is added to your playerhand
	lastCard.click(function(card) {
		if (card == lastCard.topCard()) {
			playerhand[turn].addCard(lastCard.topCard());
			playerhand[turn].render();
		}
	});

	oldBuyClubs.click(function(card) {
		playerhand[turn].addCard(card);
		playerhand[turn].render();
	});

	oldBuyDiamonds.click(function(card) {
		playerhand[turn].addCard(card);
		playerhand[turn].render();
	});

	oldBuyHearts.click(function(card) {
		playerhand[turn].addCard(card);
		playerhand[turn].render();
	});

	oldBuySpades.click(function(card) {
		playerhand[turn].addCard(card);
		playerhand[turn].render();
	});

	// Finally, when you click a card in your playerhand
	// discard it
	playerhand[turn].click(function(card){
		var deck = card.container;
		if (deck && deck.select(card)) {
			if (lastCard.length > 0) {
				var oldBuy = lastCard.topCard();
				var suit = oldBuy.suit;
				if (suit == 's') {
					oldBuySpades.addCard(oldBuy);
					oldBuySpades.render();
				} else if (suit == 'h') {
					oldBuyHearts.addCard(oldBuy)
					oldBuyHearts.render();
				} else if (suit == 'd') {
					oldBuyDiamonds.addCard(oldBuy);
					oldBuyDiamonds.render();
				} else {
					oldBuyClubs.addCard(oldBuy);
					oldBuyClubs.render();
				}
			}
			lastCard.addCard(card);
			lastCard.render();
			playerhand[turn].render();
		}
	});
}

//Let's deal when the Deal button is pressed:
$('#deal').click(function() {
	//Deck has a built in method to deal to hands.
	players = document.getElementById("players").value;
	makeDecks(players);
	makeHands(players);
	
	$("#players").hide();
	$('#deal').hide();
	deck.deal(19, playerhand, 50, function() {
		//This is a callback function, called when the dealing
		//is done.
		lastCard.addCard(deck.topCard());
		lastCard.render();
	});
});

//So, that should give you some idea about how to render a card game.
//Now you just need to write some logic around who can play when etc...
//Good luck :)
