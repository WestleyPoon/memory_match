class Card {
    constructor(num, callbacks) {
        this.num = num;
        this.domElement = null;
        this.cardInnerElement = null;

        this.callbacks = callbacks;

        this.revealed = false;

        this.handleClick = this.handleClick.bind(this);
        this.flip = this.flip.bind(this);
        this.unflip = this.unflip.bind(this);
    }

    render() {
        const row = Math.floor(this.num / 28);
        const col = this.num % 28;

        this.domElement = $('<div>', {class: 'card'});
        this.cardInnerElement = $('<div>', {class: 'card-inner'});
        this.cardInnerElement.append(
            $('<div>', {class: 'front'}).css({
                'background-position': `calc((${col} * 320%) / 86.40) calc((${row} * 320%) / 16.00)`
            }),
            $('<div>', {class: 'back'}).append(
                $('<img>', {class: 'grass', src: './images/grass.png'})
            )
        );

        this.domElement.append(this.cardInnerElement);
        this.domElement.on('click', this.handleClick);
        return this.domElement;
    }

    handleClick() {
        this.callbacks.playSound('beep');
        this.callbacks.checkMatch(this);
    }

    flip() {
        this.cardInnerElement.addClass('flipped');
        this.revealed = true;
    }

    unflip() {
        this.cardInnerElement.removeClass('flipped');
        this.revealed = false;
    }
}