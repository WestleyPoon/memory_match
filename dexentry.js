class DexEntry {
    constructor(num) {
        this.domElement = null;

        this.num = num;
        this.captured = false;
    }

    captureCheck() {
        if (!this.captured) {
            this.captured = true;

            // get placement on 6 x 28 spritesheet based on stored number
            const row = Math.floor(this.num / 28);
            const col = this.num % 28;

            this.domElement.css({
                background: `url("images/pokemon.png") calc((${col} * 320%) / 86.40) calc((${row} * 320%) / 16.00) / 2800% 600%`,
                color: 'var(--text-color)'});

            return true;
        }

        return false;
    }

    render() {
        this.domElement = $('<div>', {class: 'dex-entry', text: `${this.num + 1}`});
        return this.domElement;
    }
}