class Match {
    constructor(container) {
        this.domElements = {
            container: container,
            statsArea: null,
            gameArea: null,
            dexArea: null
        };

        this.board = null;
        this.sounds = null;

        this.win = this.win.bind(this);
    }

    start() {
        this.sounds = new Sounds();
        this.board = new Board({
            playSound: this.sounds.playSound,
            win: this.win
        });

        this.domElements.statsArea = this.renderStats();
        this.domElements.container.append(this.domElements.statsArea);

        this.domElements.gameArea = this.board.render();
        this.domElements.container.append(this.domElements.gameArea);
    }

    win() {
        console.log('win!');
    }

    renderStats() {
        this.domElements.statsArea =
            $('<div>', {class: 'stats-area'}).append(
                $('<div>', {class: 'stats-inner'}).append(
                    $('<div>', {class: 'games-played'}).append(
                        $('<div>', {class: 'label', text: 'Games Played'}),
                        $('<div>', {class: 'value', text: '0'})),
                    $('<div>', {class: 'attempts'}).append(
                        $('<div>', {class: 'label', text: 'Attempts'}),
                        $('<div>', {class: 'value', text: '0'})),
                    $('<div>', {class: 'accuracy'}).append(
                        $('<div>', {class: 'label', text: 'Accuracy'}),
                        $('<div>', {class: 'value', text: '00.00%'})),
                    $('<div>', {class: 'win-text'}).append(
                        $('<div>', {class: 'label', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, molestias?'})),
                    $('<button>', {class: 'reset-button', text: 'Reshuffle'}).on('click', this.board.randomizeCards),
                    $('<button>', {class: 'bg-button', text: 'Music'}).on('click', this.sounds.toggleBGM)
                )
            );

        return this.domElements.statsArea;
    }
}