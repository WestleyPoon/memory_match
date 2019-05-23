class Dex {
    constructor() {
        this.domElement = null;
        this.dexHolderElement = null;

        this.dex = [];
    }

    render() {
        this.domElement = $('<div>', {class: 'dex-area'})

        const dexInner = $('<div>', {class: 'dex-inner'}).append(
            $('<div>', {class: 'dex-header'}).append(
                $('<span>', {class: 'label', text: 'PokeDex:'}),
                $('<span>', {class: 'dex-num', text: '0'})
            )
        );

        this.dexHolderElement = $('<div>', {class: 'dex-holder'});

        let newEntry;
        for (let i = 0; i < 151; i++) {
            newEntry = $('<div>', {class: 'dex-entry', text: `${i + 1}`});
            this.dex.push(newEntry);
            this.dexHolderElement.append(newEntry);
        }

        dexInner.append(this.dexHolderElement);
        this.domElement.append(dexInner);

        return this.domElement;
    }
}