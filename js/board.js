class Board {
    constructor(callbacks) {
        this.cards = [];

        this.domElement = null;
        this.cardContainerElement = null;
        this.callbacks = callbacks;

        this.randomizeCards = this.randomizeCards.bind(this);
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
        const newCard = new Card(num, this.callbacks);
        this.cardContainerElement.append(newCard.render());
        this.cards.push(newCard);
    }

    render() {
        this.domElement = $('<div>', {class: 'game-area'});
        this.cardContainerElement = $('<div>', {class: 'cards-container'});
        this.domElement.append(this.cardContainerElement);

        this.randomizeCards();

        return this.domElement;
    }

    testReveal() {
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].flip();
        }
    }
}