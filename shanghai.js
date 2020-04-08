
//Tell the library which element to use for the table
cards.init({table:'#card-table', cardSize: {width:46,height:62, padding:12}, cardsUrl : 'img/cards-sm.png', cardback:'blue', blackJoker:true, redJoker:true, decks:4});

//Create a new deck of cards
deck = new cards.Deck(); 
//By default it's in the middle of the container, put it slightly to the side
deck.x -= 100;

// cards.all contains all cards, put them all in the deck
deck.addCards(cards.all); 
//deck.addCards(Cards.all);
//No animation here, just get the deck onto the table.
deck.render({immediate:true});

//Now lets create a couple of hands, one face down, one face up.
var x1 = 180;
var x2 = 550;
var x3 = 920;
var y1 = 50;
var y2 = 550;

hand1 = new cards.Hand({faceUp:true, x:x1, y:y1});
hand2 = new cards.Hand({faceUp:true, x:x2, y:y1});
hand3 = new cards.Hand({faceUp:true, x:x3, y:y1});
hand4 = new cards.Hand({faceUp:true, x:1060, y:300});
hand5 = new cards.Hand({faceUp:true, x:x3, y:y2});
hand6 = new cards.Hand({faceUp:true, x:x2, y:y2});
hand7 = new cards.Hand({faceUp:true, x:x1, y:y2});
hand8 = new cards.Hand({faceUp:true, x:50, y:300});

hand4.angle = 270;
hand8.angle = 90;

//Lets add a oldBuy pile
lastCard = new cards.Deck({faceUp:true});
lastCard.x -= 200;
var xoldBuy = 650;
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
	deck.deal(19, [hand1, hand2, hand3, hand4, hand5, hand6, hand7, hand8], 50, function() {
		//This is a callback function, called when the dealing
		//is done.
		lastCard.addCard(deck.topCard());
		lastCard.render();
	});
});


//When you click on the top card of a deck, a card is added
//to your hand
deck.click(function(card){
	if (card === deck.topCard()) {
		hand6.addCard(deck.topCard());
		hand6.render();
	}
});

// When you click on the oldBuy pile card is added to your hand
lastCard.click(function(card) {
	if (card == lastCard.topCard()) {
		hand6.addCard(lastCard.topCard());
		hand6.render();
	}
});

oldBuyClubs.click(function(card) {
	hand6.addCard(card);
	hand6.render();
});

oldBuyDiamonds.click(function(card) {
	hand6.addCard(card);
	hand6.render();
});

oldBuyHearts.click(function(card) {
	hand6.addCard(card);
	hand6.render();
});

oldBuySpades.click(function(card) {
	hand6.addCard(card);
	hand6.render();
});

//Finally, when you click a card in your hand, if it's
//the same suit or rank as the top card of the oldBuy pile
//then it's added to it
hand6.click(function(card){
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
	hand6.render();
});


//So, that should give you some idea about how to render a card game.
//Now you just need to write some logic around who can play when etc...
//Good luck :)
