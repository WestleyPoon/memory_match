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

        this.stats = {
            matches: 0,
            gamesPlayed: 0,
            attempts: 0,
        };

        this.firstCard = null;
        this.canClick = true;

        this.win = this.win.bind(this);
        this.handleMusicButton = this.handleMusicButton.bind(this);
        this.handleReshuffleButton = this.handleReshuffleButton.bind(this);
        this.handleMatchAttempt = this.handleMatchAttempt.bind(this);
    }

    start() {
        this.sounds = new Sounds();
        this.board = new Board({
            playSound: this.sounds.playSound,
            handleMatchAttempt: this.handleMatchAttempt,
            win: this.win
        });

        this.domElements.statsArea = this.renderStats();
        this.domElements.container.append(this.domElements.statsArea);

        this.domElements.gameArea = this.board.render();
        this.domElements.container.append(this.domElements.gameArea);
    }

    win() {
        $('.win-text > .label').removeClass('hidden');
    }

    handleReshuffleButton() {
        this.stats.matches = 0;
        this.stats.attempts = 0;
        this.stats.gamesPlayed++;
        this.updateStats();
        this.board.randomizeCards();
        $('.win-text > .label').addClass('hidden');
    }

    handleMusicButton() {
        this.sounds.sounds.bgm.muted = !this.sounds.sounds.bgm.muted;
    }

    updateStats() {
        const {gamesPlayed, attempts, matches} = this.stats;
        $('.games-played > .value').text(gamesPlayed);
        $('.attempts > .value').text(attempts);
        $('.accuracy > .value').text(`${(matches ? matches / attempts * 100 : 0).toFixed(2)}%`);
    }

    handleMatchAttempt(card) {
        // canClick prevents match attempts during 1.5s before cards flip back on incorrect match
        // card.revealed prevents clicking again on card that has already been clicked
        if (this.canClick && !card.revealed) {
            card.flip();

            // check if a card has already been revealed
            if (this.firstCard) {
                this.canClick = false;
                this.stats.attempts++;

                // if both cards match
                if (this.firstCard.num === card.num) {
                    this.canClick = true;
                    this.stats.matches++;

                    if (this.stats.matches === 9) {
                        this.win();
                    }

                } else {
                    const firstCard = this.firstCard;
                    setTimeout(() => {
                        card.unflip();
                        firstCard.unflip();
                        this.canClick = true;
                    }, 1500)
                }

                this.firstCard = null;
                this.updateStats();

            // otherwise, it's the first card in current match attempt - store it
            } else {
                this.firstCard = card;
            }
        }
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
                        $('<div>', {class: 'value', text: '0.00%'})),
                    $('<div>', {class: 'win-text'}).append(
                        $('<div>', {class: 'label hidden', text: 'You win! Click on reshuffle for more.'})),
                    $('<button>', {class: 'reset-button', text: 'Reshuffle'}).on('click', this.handleReshuffleButton),
                    $('<button>', {class: 'bg-button', text: 'Music'}).on('click', this.handleMusicButton)
                )
            );

        return this.domElements.statsArea;
    }
}