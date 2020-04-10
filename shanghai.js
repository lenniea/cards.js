
//Tell the library which element to use for the table
//cards.init({table:'#card-table', cardSize: {width:46,height:62, padding:12}, cardsUrl : 'img/cards-sm.png', cardback:'blue', blackJoker:true, redJoker:true, decks:4});
cards.init({table:'#card-table', cardback:'blue', blackJoker:true, redJoker:true, decks:4});

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

//Now lets create a couple of hands, one face down, one face up.
var x1 = 210;
var x2 = 310;
var xc = 625;
var x3 = 940;
var x4 = 1040;
var y1 = 50;
var y2 = 240;
var yc = 335;
var y3 = 430;
var y4 = 620;

var players = 7;

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

var xpos = [xpos4,xpos5,xpos6,xpos7,xpos8];
var ypos = [ypos4,ypos5,ypos6,ypos7,ypos8];

var playerhand = [];

for (var i=0; i < players; i++) {
	var xp = xpos[players-4][i];
	var yp = ypos[players-4][i];
	playerhand[i] = new cards.Hand({faceUp:true, x:xp, y:yp});
}

turn = Math.trunc((players + 1)/2);

//Lets add a oldBuy pile
lastCard = new cards.Deck({faceUp:true});
lastCard.x -= 130;
lastCard.y += 50;
var xoldBuy = 650;
var yoldBuy = 200;

// Create oldBuy piles (per suit)
oldBuySpades = new cards.Hand({faceUp:true, x:xoldBuy, y:yoldBuy});
oldBuyHearts = new cards.Hand({faceUp:true, x:xoldBuy, y:yoldBuy+100});
oldBuyClubs = new cards.Hand({faceUp:true, x:xoldBuy, y:yoldBuy+200});
oldBuyDiamonds = new cards.Hand({faceUp:true, x:xoldBuy, y:yoldBuy+300});

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
