class Dex {
    constructor() {
        this.dex = [];
        this.captured = [];
        this.numCaptured = 0;

        this.domElement = null;
        this.dexEntriesHolderElement = null;
    }

    render() {
        this.domElement = $('<div>', {class: 'dex-area'});

        const dexPanel = $('<div>', {class: 'dex-panel'}).append(
            $('<div>', {class: 'dex-header'}).append(
                $('<span>', {class: 'label', text: 'PokeDex:'}),
                $('<span>', {class: 'dex-counter', text: '0'})
            )
        );

        this.dexEntriesHolderElement = $('<div>', {class: 'dex-entries-holder'});

        let newEntry;
        for (let i = 0; i < 151; i++) {
            newEntry = new DexEntry(i);
            this.dex.push(newEntry);
            this.dexEntriesHolderElement.append(newEntry.render());
        }

        this.domElement.append(
            dexPanel.append(
                this.dexEntriesHolderElement
            )
        );

        return this.domElement;
    }

    capture(num, scroll = true) {
        this.captured[num] = 1;

        if (this.dex[num].captureCheck()) {
            this.numCaptured++;

            if (scroll) {
                // top and bottom offsets of inner dex element
                const dex = this.dexEntriesHolderElement[0];
                const dexTop = dex.scrollTop;
                const dexBottom = dexTop + dex.clientHeight;

                // top and bottom offsets of the specific dex entry
                const entryTop = this.dex[num].domElement[0].offsetTop - this.dex[0].domElement[0].offsetTop;
                const entryBottom = entryTop + this.dex[num].domElement[0].clientHeight;

                const isVisible = (entryTop >= dexTop) && (entryBottom <= dexBottom);
                console.log(`thing is${isVisible ? '' : ' not'} in view`);

                if (!isVisible) {
                    // get the size of the dex entries holder and subtract the viewable height from it
                    const scrollRange = dex.scrollHeight - dex.clientHeight;

                    // using the scroll range, calculate the point to scroll to based on the pokemon caught
                    // dex is currently 4 columns wide, so divide by 4
                    const scrollTo = scrollRange / Math.floor(151 / 4) * Math.floor(num / 4);

                    // change the duration of the scroll animation based on distance to scroll
                    const scrollDuration = Math.abs(scrollTo - this.dexEntriesHolderElement[0].scrollTop) / 2;

                    this.dexEntriesHolderElement.animate({
                        scrollTop: scrollTo
                    }, {
                        duration: 1000 + scrollDuration,
                        queue: true
                    });
                }
            }
        }

        this.updateStats();
    }

    updateStats() {
        $('.dex-counter').text(this.numCaptured);
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