
//Tell the library which element to use for the table
cards.init({table:'#card-table', cardSize: {width:46,height:62, padding:12}, cardsUrl : 'img/cards-sm.png', cardback:'blue', blackJoker:true, redJoker:true, decks:4});

//Create a new deck of cards
deck = new cards.Deck(); 
//By default it's in the middle of the container, put it slightly to the side
deck.x -= 120;

// cards.all contains all cards, put them all in the deck
deck.addCards(cards.all); 
//deck.addCards(Cards.all);
//No animation here, just get the deck onto the table.
deck.render({immediate:true});

//Now lets create a couple of hands, one face down, one face up.
var x1 = 150;
var x2 = 370;
var x3 = 720;
var x4 = 940;
var y1 = 50;
var y2 = 210;
var y3 = 370;
var y4 = 530;

var players = 8;

var playerhand = [];

playerhand[0] = new cards.Hand({faceUp:true, x:x2, y:y1});
playerhand[1] = new cards.Hand({faceUp:true, x:x3, y:y1});
playerhand[2] = new cards.Hand({faceUp:true, x:x4, y:y2});
playerhand[3] = new cards.Hand({faceUp:true, x:x4, y:y3});
playerhand[4] = new cards.Hand({faceUp:true, x:x3, y:y4});
playerhand[5] = new cards.Hand({faceUp:true, x:x2, y:y4});
playerhand[6] = new cards.Hand({faceUp:true, x:x1, y:y3});
playerhand[7] = new cards.Hand({faceUp:true, x:x1, y:y2});

turn = 5;

//Lets add a oldBuy pile
lastCard = new cards.Deck({faceUp:true});
lastCard.x -= 200;
var xoldBuy = 600;
var yoldBuy = 200;

// Create oldBuy piles (per suit)
oldBuySpades = new cards.Hand({faceUp:true, x:xoldBuy, y:yoldBuy});
oldBuyHearts = new cards.Hand({faceUp:true, x:xoldBuy, y:yoldBuy + 75});
oldBuyClubs = new cards.Hand({faceUp:true, x:xoldBuy, y:yoldBuy+150});
oldBuyDiamonds = new cards.Hand({faceUp:true, x:xoldBuy, y:yoldBuy+225});

//Let's deal when the Deal button is pressed:
$('#deal').click(function() {
	//Deck has a built in method to deal to hands.
	$('#deal').hide();
	deck.deal(19, playerhand, 50, function() {
		//This is a callback function, called when the dealing
		//is done.
		lastCard.addCard(deck.topCard());
		lastCard.render();
	});
});


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

//Finally, when you click a card in your playerhand, if it's
//the same suit or rank as the top card of the oldBuy pile
//then it's added to it
playerhand[turn].click(function(card){
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
});


//So, that should give you some idea about how to render a card game.
//Now you just need to write some logic around who can play when etc...
//Good luck :)
