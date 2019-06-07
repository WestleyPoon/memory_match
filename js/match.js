class Match {
    constructor(container) {
        this.board = null;
        this.dex = null;
        this.sounds = null;
        this.firstCard = null;
        this.canClick = true;
        this.canShuffle = true;
        this.stats = {
            matches: 0,
            gamesPlayed: 0,
            attempts: 0
        };

        this.domElement = container;

        this.confirmNewGame = this.confirmNewGame.bind(this);
        this.startNewGame = this.startNewGame.bind(this);
        this.continueGame = this.continueGame.bind(this);
        this.startGame = this.startGame.bind(this);
        this.handleReshuffleButton = this.handleReshuffleButton.bind(this);
        this.handleMusicButton = this.handleMusicButton.bind(this);
        this.handleMatchAttempt = this.handleMatchAttempt.bind(this);
        this.saveData = this.saveData.bind(this);
        this.win = this.win.bind(this);

        this.initialize()
    }

    initialize() {
        this.sounds = new Sounds();
        this.board = new Board({
            handleMatchAttempt: this.handleMatchAttempt,
            playSound: this.sounds.playSound,
            win: this.win
        });
        this.dex = new Dex();

        this.makeLandingPage();

        setTimeout(() => {
            this.domElement.append(this.renderStats());
            this.domElement.append(this.board.render());
            this.domElement.append(this.dex.render());

            this.addEventListeners();
            this.addAnimations();
        }, 500);
    }

    makeLandingPage() {
        this.domElement.prepend(
            $('<div>', {class: 'landing-page'}).append(
                $('<div>', {class: 'spinner'}),
                $('<div>', {class: 'landing-page-buttons'}).append(
                    $('<button>', {id: 'new-game-button', text: 'New Game'}),
                    $('<button>', {id: 'continue-button', text: 'Continue'})
                )
            )
        );
    }

    renderStats() {
        const statsArea =
            $('<div>', {class: 'stats-area'}).append(
                $('<div>', {class: 'stats-panel'}).append(
                    $('<div>', {class: 'games-played'}).append(
                        $('<div>', {class: 'label', text: 'Games Played'}),
                        $('<div>', {class: 'value', text: '0'})),
                    $('<div>', {class: 'attempts'}).append(
                        $('<div>', {class: 'label', text: 'Attempts'}),
                        $('<div>', {class: 'value', text: '0'})),
                    $('<div>', {class: 'accuracy'}).append(
                        $('<div>', {class: 'label', text: 'Accuracy'}),
                        $('<div>', {class: 'value', text: '0.00%'})),
                    $('<button>', {id: 'reset-button', text: 'Reshuffle', class: 'stats-button'}),
                    $('<button>', {id: 'bgm-button', text: 'Music', class: 'stats-button'})
                )
            );
        return statsArea;
    }

    addEventListeners() {
        $('#new-game-button').on('click', () => {
            this.sounds.playSound('beep');
            this.confirmNewGame();
        });
        $('#continue-button').on('click', () => {
            this.sounds.playSound('beep');
            this.continueGame();
        });
        $('#reset-button').on('click', () => {
            this.sounds.playSound('flee');
            this.handleReshuffleButton();
        });
        $('#bgm-button').on('click', () => {
            this.sounds.playSound('beep');
            this.handleMusicButton();
        });
        // $('button').on('click', () => {this.sounds.playSound('beep')});
        $(this.domElement).on('click', '.modal-button', () => {this.sounds.playSound('beep2')});
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
            this.domElement.append(modal.render());
            modal.show();

        } else {
            this.startNewGame();
        }
    }

    startNewGame() {
        this.sounds.playSound('beep');
        localStorage.removeItem('captured');
        localStorage.removeItem('gamesPlayed');
        this.startGame();
    }

    continueGame() {
        if (localStorage.getItem('captured')) {
            this.sounds.playSound('beep');
            this.loadData();
            this.startGame();
        } else {
            const modal = new Modal({
                text: 'No save data found. Please start a new game.',
                confirmButton: 'OK'
            });
            this.domElement.append(modal.render());
            modal.show();
        }
    }

    loadData() {
        const gamesPlayed = parseInt(localStorage.getItem('gamesPlayed'));
        const captured = JSON.parse(localStorage.getItem('captured'));

        if (Array.isArray(captured)) {
            this.stats.gamesPlayed = gamesPlayed ? gamesPlayed : 0;

            for (let i = 0; i < captured.length; i++) {
                if (captured[i]) {
                    this.dex.capture(i, false);
                }
            }
            $('.selected').removeClass('selected');
        }

        this.updateStats();
    }
    
    startGame() {
        $('.landing-page').addClass('hidden');
        this.sounds.startBGM();
        setTimeout(() => {
            $('.landing-page').remove();
        }, 500)
    }

    handleReshuffleButton() {
        if (this.canShuffle) {
            this.canShuffle = false;

            this.stats.matches = 0;
            this.stats.attempts = 0;
            this.stats.gamesPlayed++;
            this.firstCard = null;
            this.updateStats();
            localStorage.setItem('gamesPlayed', this.stats.gamesPlayed);

            // reenable the shuffle button
            setTimeout(() => {
                this.canShuffle = true;
            }, 50 * this.board.cards.length * 2);
            this.board.shuffleCards();
        }
    }

    handleMusicButton() {
        const muted = this.sounds.toggleBGM();
        if (muted) {
            $('#bgm-button').addClass('disabled');
        } else {
            $('#bgm-button').removeClass('disabled');
        }
    }

    handleMatchAttempt(card) {
        // canClick prevents match attempts during 1.25s before cards flip back on incorrect match
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
                        this.sounds.playFanfare();
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
                this.sounds.playSound('beep2');
                this.firstCard = card;
            }
        }
    }

    updateStats() {
        const {gamesPlayed, attempts, matches} = this.stats;
        $('.games-played > .value').text(gamesPlayed);
        $('.attempts > .value').text(attempts);
        $('.accuracy > .value').text(`${(matches ? matches / attempts * 100 : 0).toFixed(2)}%`);
    }

    saveData() {
        localStorage.setItem('captured', JSON.stringify(this.dex.captured))
    }

    win() {
        const modal = new Modal({
            text: 'You win! Reshuffle board and continue?',
            confirmButton: 'Continue',
            confirmHandler: this.handleReshuffleButton,
            rejectButton: 'View Board'
        });
        this.domElement.append(modal.render());
        modal.show();
    }
}
