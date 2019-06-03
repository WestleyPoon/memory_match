class Card {
    constructor(num, callbacks) {
        this.num = num;
        this.revealed = false;

        this.domElement = null;
        this.callbacks = {
            playSound: callbacks.playSound,
            handleMatchAttempt: callbacks.handleMatchAttempt
        };

        this.handleClick = this.handleClick.bind(this);
        this.flip = this.flip.bind(this);
        this.unflip = this.unflip.bind(this);
    }

    render() {
        // get placement on 6 x 28 spritesheet based on stored number
        const row = Math.floor(this.num / 28);
        const col = this.num % 28;

        const card = $('<div>', {class: 'card'});
        this.domElement = $('<div>', {class: 'card-inner'});

        // each sprite is 320x320, entire spritesheet is 8960 x 1920
        const front = $('<div>', {class: 'front', css: {
                'background-position': `calc((${col} * 320%) / 86.40) calc((${row} * 320%) / 16.00)`
        }});

        const back = $('<div>', {class: 'back'}).append(
            $('<img>', {class: 'grass', src: './images/grass.png', draggable: false})
        );

        card.append(
            this.domElement.append(
                front,
                back
            )
        );

        card.on('click', this.handleClick);
        return card;
    }

    handleClick() {
        this.callbacks.handleMatchAttempt(this);
    }

    flip() {
        this.domElement.addClass('flipped');
        this.revealed = true;
    }

    unflip() {
        this.domElement.removeClass('flipped');
        this.revealed = false;
    }

    fadeOut() {

    }
}