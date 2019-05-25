class Dex {
    constructor() {
        this.domElement = null;
        this.dexEntryHolderElement = null;

        this.dex = [];
        this.numCaptured = 0;
        this.lastCaptured = null;
    }

    capture(num) {
        if (this.dex[num].captureCheck()) {
            this.numCaptured++;

            // get the height of the dex area, and calculate the pokemon's position
            const scrollTo = this.domElement.height() / (151 / 6) * Math.floor(num / 6);
            // change the duration of the scroll animation based on distance to scroll
            const scrollDuration = Math.abs(scrollTo - this.dexEntryHolderElement.scrollTop());

            this.dexEntryHolderElement.animate({
                scrollTop: scrollTo
            }, 1000 + scrollDuration);
        }
        this.updateStats();
    }

    updateStats() {
        $('.dex-counter').text(this.numCaptured);
    }

    render() {
        this.domElement = $('<div>', {class: 'dex-area'});

        const dexInner = $('<div>', {class: 'dex-inner'}).append(
            $('<div>', {class: 'dex-header'}).append(
                $('<span>', {class: 'label', text: 'PokeDex:'}),
                $('<span>', {class: 'dex-counter', text: '0'})
            )
        );

        this.dexEntryHolderElement = $('<div>', {class: 'dex-holder'});

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

    testFill() {
        for (let i = 0; i < this.dex.length; i++) {
            if (this.dex[i].captureCheck()) {
                this.numCaptured++;
            }
        }
        this.updateStats();
    }
}