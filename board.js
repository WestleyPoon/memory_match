class Board {
    constructor(callbacks) {
        this.domElement = null;
        this.cardContainerElement = null;
        this.cards = [];

        this.callbacks = callbacks;

        this.firstCard = null;
        this.canClick = true;
        this.matches = 0;

        this.randomizeCards = this.randomizeCards.bind(this);
        this.checkMatch = this.checkMatch.bind(this);
    }

    randomizeCards() {
        let num, i, temp;

        this.cardContainerElement.empty();
        this.cards = [];

        // generate 9 random numbers, representing pokemon, and add to storage
        const cardNums = [];
        for (i = 0; i < 9; i++) {
            num = Math.floor(Math.random() * 151);
            cardNums.push(num, num);
        }

        // shuffle the numbers inside the storage array
        for (i = cardNums.length - 1; i > 0; i--) {
            num = Math.floor(Math.random() * (i + 1));
            temp = cardNums[i];
            cardNums[i] = cardNums[num];
            cardNums[num] = temp;
        }

        // make the cards and append them to the board
        for (i = 0; i < cardNums.length; i++) {
            this.addCard(cardNums[i]);
        }
    }

    addCard(num) {
        const newCard = new Card(num, {
            playSound: this.callbacks.playSound,
            checkMatch: this.checkMatch
        });
        this.cardContainerElement.append(newCard.render());
        this.cards.push(newCard);
    }

    checkMatch(card) {
        if (this.canClick && !card.revealed) {
            card.flip();

            if (this.firstCard) {
                this.canClick = false;

                if (this.firstCard.num === card.num) {
                    this.canClick = true;
                    if (this.matches === 9) {
                        this.callbacks.win();
                    }

                } else {
                    const firstCard = this.firstCard;
                    setTimeout(() => {
                        card.unflip();
                        firstCard.unflip();
                        this.canClick = true;
                    }, 1500)
                }
                this.firstCard = null;

            } else {
                this.firstCard = card;
            }
        }
    }

    render() {
        this.domElement = $('<div>', {class: 'game-area'});
        this.cardContainerElement = $('<div>', {class: 'card-container'});
        this.domElement.append(this.cardContainerElement);

        this.randomizeCards();

        return this.domElement;
    }
}