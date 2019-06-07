class Dex {
    constructor() {
        this.dex = [];
        this.captured = [];
        this.numCaptured = 0;

        this.domElement = null;
        this.dexEntriesHolderElement = null;
        this.dexInfoElement = null;
        this.dexInfoInnerElement = null;

        this.showInfo = this.showInfo.bind(this);
        this.hideInfo = this.hideInfo.bind(this);
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
        this.dexInfoElement = $('<div>', {class: 'dex-info collapsed hidden'});
        this.dexInfoInnerElement = $('<div>', {class: 'dex-info-inner'});
        this.dexInfoInnerElement.on('click', this.hideInfo);

        let newEntry;
        for (let i = 0; i < 151; i++) {
            newEntry = new DexEntry(i, {show: this.showInfo});
            this.dex.push(newEntry);
            this.dexEntriesHolderElement.append(newEntry.render());
        }

        this.domElement.append(
            dexPanel.append(
                this.dexEntriesHolderElement,
                this.dexInfoElement.append(
                    this.dexInfoInnerElement
                )
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
                        queue: true,
                        complete: () => {this.dex[num].captureFlash()}
                    });

                } else {
                    this.dex[num].captureFlash()
                }
            }
        }

        this.updateStats();
    }

    updateStats() {
        $('.dex-counter').text(this.numCaptured);
    }

    showInfo(num) {
        if (this.captured[num]) {
            const row = Math.floor(num / 28);
            const col = num % 28;

            this.dexInfoInnerElement.css('background-position', `calc((${col} * 320%) / 86.40) calc((${row} * 320%) / 16.00)`);

            this.dexInfoElement.removeClass('collapsed');
            this.dexInfoElement.removeClass('hidden');
        }
    }

    hideInfo() {
        this.dexInfoElement.addClass('hidden');
        setTimeout(() => {
            this.dexInfoElement.addClass('collapsed');
        }, 425);
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