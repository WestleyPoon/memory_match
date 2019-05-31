class Board {
    constructor(callbacks) {
        this.domElement = null;
        this.callbacks = callbacks;

        this.randomizeCards = this.randomizeCards.bind(this);
    }

    render() {
        const gameArea = $('<div>', {class: 'game-area'});
        this.domElement = $('<div>', {class: 'cards-container'});
        gameArea.append(this.domElement);

        this.domElement.on('dragstart', '.grass', event => {event.preventDefault()});

        this.randomizeCards();
        return gameArea;
    }

    randomizeCards() {
        let num, i, temp;
        this.domElement.empty();

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
        this.domElement.append(newCard.render());
    }
}