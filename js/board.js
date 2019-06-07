class Board {
    constructor(callbacks) {
        this.cards = [];

        this.domElement = null;
        this.callbacks = callbacks;

        this.shuffleCards = this.shuffleCards.bind(this);
    }

    render() {
        const gameArea = $('<div>', {class: 'game-area'});
        this.domElement = $('<div>', {class: 'cards-container'});
        gameArea.append(this.domElement);

        // for Firefox - draggable=false doesn't work
        this.domElement.on('dragstart', '.grass', event => {event.preventDefault()});

        this.generateCards();
        return gameArea;
    }

    shuffleCards() {
        this.fadeOutCards();
        setTimeout(() => {
            this.generateCards();
        }, 50 * this.cards.length);
    }

    generateCards() {
        let num, i, temp;
        this.domElement.empty();
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

        // fade in the new cards
        this.fadeInCards();
    }

    addCard(num) {
        const newCard = new Card(num, this.callbacks);
        this.cards.push(newCard);
        this.domElement.append(newCard.render());
    }

    fadeOutCards() {
        for (let i = 0; i < this.cards.length; i++) {
            setTimeout(() => {
                this.cards[i].fadeOut();
            }, 50 * i)
        }
    }

    fadeInCards() {
        for (let i = 0; i < this.cards.length; i++) {
            setTimeout(() => {
                this.cards[i].fadein();
            }, 50 * i)
        }
    }
}