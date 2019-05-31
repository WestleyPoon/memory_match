class Dex {
    constructor() {
        this.domElement = null;
        this.dexEntryHolderElement = null;

        this.dex = [];
        this.captured = [];
        this.numCaptured = 0;
    }

    render() {
        this.domElement = $('<div>', {class: 'dex-area'});

        const dexInner = $('<div>', {class: 'dex-panel'}).append(
            $('<div>', {class: 'dex-header'}).append(
                $('<span>', {class: 'label', text: 'PokeDex:'}),
                $('<span>', {class: 'dex-counter', text: '0'})
            )
        );

        this.dexEntryHolderElement = $('<div>', {class: 'dex-entries-holder'});

        let newEntry;
        for (let i = 0; i < 151; i++) {
            newEntry = new DexEntry(i);
            this.dex.push(newEntry);
            this.dexEntryHolderElement.append(newEntry.render());
        }

        dexInner.append(this.dexEntryHolderElement);
        this.domElement.append(dexInner);

        return this.domElement;
    }

    capture(num, scroll = true) {
        this.captured[num] = 1;
        if (this.dex[num].captureCheck()) {
            this.numCaptured++;

            if (scroll) {
                // get the height of the dex area, and calculate the pokemon's position
                const scrollTo = this.domElement.height() / (151 / 6) * Math.floor(num / 6);
                // change the duration of the scroll animation based on distance to scroll
                const scrollDuration = Math.abs(scrollTo - this.dexEntryHolderElement.scrollTop());

                this.dexEntryHolderElement.animate({
                    scrollTop: scrollTo
                }, 1000 + scrollDuration);
            }
        }
        this.updateStats();
    }

    updateStats() {
        $('.dex-counter').text(this.numCaptured);
    }
}