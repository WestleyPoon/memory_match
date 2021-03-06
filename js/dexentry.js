class DexEntry {
    constructor(num, callbacks) {
        this.num = num;
        this.captured = false;
        this.showInfo = callbacks.show;

        this.domElement = null;
        this.textElement = null;
        this.imageElement = null;

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        // // get placement on 6 x 28 spritesheet based on stored number
        const row = Math.floor(this.num / 28);
        const col = this.num % 28;

        this.domElement = $('<div>', {class: 'dex-entry'}).on('click', this.handleClick);
        this.imageElement = $('<div>', {class: 'dex-image hidden', css: {
                background: `url("images/pokemon.png") calc((${col} * 320%) / 86.40) calc((${row} * 320%) / 16.00) / 2800% 600%`}});
        this.textElement = $('<span>', {class: 'dex-num', text: `${this.num + 1}`});

        this.domElement.append(this.imageElement, this.textElement);

        return this.domElement;
    }

    captureCheck() {
        if (!this.captured) {
            this.captured = true;
            this.textElement.css({color: 'var(--text-color)'});
            this.imageElement.removeClass('hidden');
            return true;
        }
        return false;
    }

    handleClick() {
        this.select();
        this.showInfo(this.num);
    }

    select() {
        $('.selected').removeClass('selected');
        this.domElement.addClass('selected');
    }

    captureFlash() {
        this.select();
        this.domElement.addClass('blink');
        setTimeout(() => {
            this.domElement.removeClass('blink');
        }, 1500);
    }
}