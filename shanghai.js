
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

hand4.angle = 90;
hand8.angle = 270;

//Lets add a discard pile
discardPile = new cards.Deck({faceUp:true});
discardPile.x -= 200;
var xdiscard = 650;
var ydiscard = 200;

// Create discard piles (per suit)
discardSpades = new cards.Hand({faceUp:true, x:xdiscard, y:ydiscard});
discardHearts = new cards.Hand({faceUp:true, x:xdiscard, y:ydiscard + 75});
discardDiamonds = new cards.Hand({faceUp:true, x:xdiscard, y:ydiscard+150});
discardClubs = new cards.Hand({faceUp:true, x:xdiscard, y:ydiscard+225});

//Let's deal when the Deal button is pressed:
$('#deal').click(function() {
	//Deck has a built in method to deal to hands.
	$('#deal').hide();
	deck.deal(19, [hand1, hand2, hand3, hand4, hand5, hand6, hand7, hand8], 50, function() {
		//This is a callback function, called when the dealing
		//is done.
		discardPile.addCard(deck.topCard());
		discardPile.render();
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

// When you click on the discard pile card is added to your hand
discardPile.click(function(card) {
	if (card == discardPile.topCard()) {
		hand6.addCard(discardPile.topCard());
		hand6.render();
	}
});

//Finally, when you click a card in your hand, if it's
//the same suit or rank as the top card of the discard pile
//then it's added to it
hand6.click(function(card){
	if (discardPile.length > 0) {
		var discard = discardPile.topCard();
		var suit = discard.suit;
		if (suit == 's') {
			discardSpades.addCard(discard);
			discardSpades.render();
		} else if (suit == 'h') {
			discardHearts.addCard(discard)
			discardHearts.render();
		} else if (suit == 'd') {
			discardDiamonds.addCard(discard);
			discardDiamonds.render();
		} else {
			discardClubs.addCard(discard);
			discardClubs.render();
		}
	}
	discardPile.addCard(card);
	discardPile.render();
	hand6.render();
});


//So, that should give you some idea about how to render a card game.
//Now you just need to write some logic around who can play when etc...
//Good luck :)
