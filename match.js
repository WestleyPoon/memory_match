class Match {
    constructor(container, matches) {
        this.domElements = {
            container: container,
            statsArea: null,
            gameArea: null,
            dexArea: null
        };

        this.board = null;
        this.dex = null;
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
        this.confirmNewGame = this.confirmNewGame.bind(this);
        this.startGame = this.startGame.bind(this);
        this.checkForSaveData = this.checkForSaveData.bind(this);
        this.saveData = this.saveData.bind(this);
        this.startNewGame = this.startNewGame.bind(this);

        this.start()
    }

    start() {
        this.renderLoadingPage();

        this.sounds = new Sounds();
        this.board = new Board({
            playSound: this.sounds.playSound,
            handleMatchAttempt: this.handleMatchAttempt,
            win: this.win
        });

        this.dex = new Dex();

        setTimeout(() => {
            this.domElements.statsArea = this.renderStats();
            this.domElements.container.append(this.domElements.statsArea);

            this.domElements.gameArea = this.board.render();
            this.domElements.container.append(this.domElements.gameArea);

            this.domElements.dexArea = this.dex.render();
            this.domElements.container.append(this.domElements.dexArea);

            this.addEventListeners();
            this.addAnimations();
        }, 100);
    }

    addEventListeners() {
        $('.new-game-button').on('click', this.confirmNewGame);
        $('.continue-button').on('click', this.checkForSaveData);
        $('.reset-button').on('click', this.handleReshuffleButton);
        $('.bgm-button').on('click', this.handleMusicButton);
    }

    addAnimations() {
        $('header').on('mouseenter', function() {
            $('.logo-area').addClass('furret-jump');
        });

        $('.logo-area').on('webkitAnimationEnd mozAnimationEnd animationend', function () {
            $(this).removeClass('furret-jump');
        });
    }

    confirmNewGame() {
        if (localStorage.getItem('captured')) {
            const modal = new Modal({
                text: 'Starting a new game will overwrite the saved game data. Continue?',
                confirmButton: 'Yes',
                confirmHandler: this.startNewGame,
                rejectButton: 'No'
            });
            this.domElements.container.append(modal.render());
        } else {
            this.startGame();
        }
    }

    checkForSaveData() {
        if (localStorage.getItem('captured')) {
            this.continueGame();
        } else {
            const modal = new Modal({
                text: 'No save data found. Please start a new game.',
                confirmButton: 'OK'
            });
            this.domElements.container.append(modal.render());
        }
    }

    startNewGame() {
        localStorage.removeItem('captured');
        localStorage.removeItem('gamesPlayed');
        this.startGame();
    }
    
    startGame() {
        $('.loading-page').addClass('hidden');
        setTimeout(() => {
            $('.loading-page').remove();
        }, 750)
    }
    
    continueGame() {
        this.loadData();
        this.startGame();
    }

    win() {
        $('.win-text > .label').removeClass('hidden');
    }

    handleReshuffleButton() {
        this.stats.matches = 0;
        this.stats.attempts = 0;
        this.stats.gamesPlayed++;
        this.updateStats();
        localStorage.setItem('gamesPlayed', this.stats.gamesPlayed);
        this.board.randomizeCards();
        $('.win-text > .label').addClass('hidden');
    }

    handleMusicButton() {
        console.log('test');
        this.sounds.sounds.bgm.muted = !this.sounds.sounds.bgm.muted;
        if (this.sounds.sounds.bgm.muted) {
            $('.bgm-button').addClass('disabled');
        } else {
            $('.bgm-button').removeClass('disabled');
        }
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
                    this.sounds.playSound('right');
                    this.canClick = true;
                    this.stats.matches++;
                    this.dex.capture(card.num);

                    if (this.stats.matches === 9) {
                        this.sounds.playSound('fanfare');
                        this.win();
                    }

                } else {
                    this.sounds.playSound('wrong');
                    const firstCard = this.firstCard;
                    setTimeout(() => {
                        card.unflip();
                        firstCard.unflip();
                        this.canClick = true;
                    }, 1250)
                }

                this.firstCard = null;
                this.updateStats();
                this.saveData();

            // otherwise, it's the first card in current match attempt - store it
            } else {
                this.sounds.playSound('beep');
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
                    $('<button>', {class: 'reset-button', text: 'Reshuffle'}),
                    $('<button>', {class: 'bg-button', text: 'Music'})
                )
            );

        return this.domElements.statsArea;
    }

    saveData() {
        localStorage.setItem('captured', JSON.stringify(this.dex.captured))
    }

    loadData() {
        const gamesPlayed = parseInt(localStorage.getItem('gamesPlayed'));
        const captured = JSON.parse(localStorage.getItem('captured'));

        if (gamesPlayed && Array.isArray(captured)) {
            this.stats.gamesPlayed = gamesPlayed;

            for (let i = 0; i < captured.length; i++) {
                if (captured[i]) {
                    this.dex.capture(i, false);
                }
            }

            $('.selected').removeClass('selected');
        }

        this.updateStats();
    }

    renderLoadingPage() {
        this.domElements.container.prepend(
            $('<div>', {class: 'loading-page'}).append(
                $('<div>', {class: 'spinner'}),
                $('<div>', {class: 'loading-page-buttons'}).append(
                    $('<button>', {class: 'new-game-button', text: 'New Game'}),
                    $('<button>', {class: 'continue-button', text: 'Continue'})
                )
            )
        );
    }
}
