var firstCardClicked = null;
var secondCardClicked = null;
var canClick = true;

var total_possible_matches = 9;
var match_counter = null;
var attempts = null;
var accuracy = null;
var gamesPlayed = 0;

var noCaught = 0;
var pokemonCaught = [];
var boardState = [];

/* audio */
var fanfare = new Audio('sounds/fanfare.mp3');
var beep = new Audio('sounds/beep.mp3');
var right = new Audio('sounds/right.mp3');
var wrong = new Audio('sounds/wrong.mp3');
var bgLoop = new Audio('sounds/azalea.mp3');

fanfare.volume = .35;
beep.volume = .5;
right.volume = .7;
wrong.volume = .5;
bgLoop.volume = .25;

$(document).ready(initializeApp);

function initializeApp() {
    setTimeout(function(){
        // Hide the address bar!
        window.scrollTo(0, 1);
    }, 0);
    $('.start').on('click', startGame);
    $('.cardHolder').on('click', '.card', cardClicked);
    fillDex();
}

function startGame() {
    beep.play();
    $('.reset').on('click', resetGame);

    /* replay bgm when it ends */
    bgLoop.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    $('.start').fadeOut(500);

    /* start the bgm */
    setTimeout(function () {
        bgLoop.play();
    }, 500);

    /* set up mute button */
    $('.bgmusic').on('click', function () {
       if (bgLoop.muted) {
           $('.bgmusic').css({color: 'rgb(255, 203, 0)', 'border-color': 'rgb(255, 203, 0)'});
           bgLoop.muted = false;
       } else {
           $('.bgmusic').css({color: 'gray', 'border-color': 'gray'});
           bgLoop.muted = true;
       }
    });

    /* generate the cards */
    setTimeout(function () {
        $('.startGameButton').remove();
        boardState = loadCards();
    }, 500);

    resetStats();
}

function fillDex() {
    var newEntry;
    var actualNum;

    /* generate empty dex entries */
    for (var i = 0; i < 151; i++) {
        actualNum = i + 1;
        newEntry = $('<div>', {class: i + ' entry'});
        $('.dexHolder').append(newEntry);
        $('.dexHolder > div:last-child').text(actualNum);
    }
}

function loadCards() {
    var board = [];
    var gennedNum;
    var temp;

    /* generate 9 random pokemon and put them in an array */
    for (var i = 0; i < 9; i++) {
        gennedNum = Math.floor(Math.random() * 151);
        board.push(gennedNum, gennedNum);
    }

    /* hat shuffle */
    for (i = board.length - 1; i > 0; i--) {
        gennedNum = Math.floor(Math.random() * (i + 1));
        temp = board[i];
        board[i] = board[gennedNum];
        board[gennedNum] = temp;
    }

    /* add each card to the cardHolder */
    for (i = 0; i < board.length; i++) {
        addCard(board[i]);
    }

    return board;
}

function cardClicked() {

    /* check to prevent players from flipping a third card after a wrong attempt */
    if (canClick){
        if($(this).hasClass('revealed')) {
            return;
        }

        /* flip the card */
        beep.play();
        $(this).find('.cardContents').addClass('flip');

        /* first card */
        if(firstCardClicked === null) {
            firstCardClicked = $(this);
            firstCardClicked.addClass('revealed');
        } else {
            /* second card */
            attempts++;
            secondCardClicked = $(this);
            secondCardClicked.addClass('revealed');

            /* pokemon info is embedded in class as dex number */
            var firstCardClass = firstCardClicked.attr('class');
            var firstCard = firstCardClass.slice(0, firstCardClass.indexOf(' '));

            var secondCardClass = secondCardClicked.attr('class');
            var secondCard = secondCardClass.slice(0, secondCardClass.indexOf(' '));

            if (firstCard === secondCard) {
                match_counter++;
                noCaught++;
                firstCardClicked = secondCardClicked = null;

                /* add to dex if player hasn't caught one before */
                if (!pokemonCaught[firstCard]) {
                    pokemonCaught[firstCard] = true;
                    addDexEntry(firstCard);
                }

                if (match_counter === total_possible_matches) {
                    $('.winText').text("You win! Click on reshuffle for more.");

                    /* pause bgm and play fanfare*/
                    bgLoop.pause();
                    fanfare.play();
                    setTimeout(function () {
                        bgLoop.play();
                    }, 5000);
                } else {
                    /* play correct attempt sound */
                    right.play();
                }

            } else {
                /* shake the cards if wrong attempt */
                setTimeout(function () {
                    wrong.play();
                    firstCardClicked.addClass('shake');
                    secondCardClicked.addClass('shake');
                }, 400);
                canClick = false;

                /* flip the revealed cards and remove animation class after 1.5s */
                setTimeout(function () {
                    firstCardClicked.removeClass('revealed shake').children('.cardContents').removeClass('flip');
                    secondCardClicked.removeClass('revealed shake').children('.cardContents').removeClass('flip');
                    canClick = true;
                    firstCardClicked = secondCardClicked = null;
                }, 1500);
            }
        }
        displayStats();
    }

}

function addDexEntry(num) {
    var row = Math.floor(num / 28);
    var col = num % 28;

    /* change picture based on dex no. and placement in 28x6 sprite sheet */
    $('.' + num + '.entry').css({
        'background':
            ' url("images/pokemon.png") calc((' + col + ' * 320%) / 86.40) calc((' + row + ' * 320%) / 16.00)',
        'background-size':
            '2800% 600%',
        color:
            'rgb(255, 203, 0)'
    });
}

function addCard (num) {
    var card = $('<div>', {class: num + ' card'});
    var innerCardDiv = $('<div>', {class: 'cardContents'});
    var front = $('<div>', {class: 'front'});
    var back = $('<div>', {class: 'back'});
    var backImg = $('<img>', {src: 'images/grass.png'});

    var row = Math.floor(num / 28);
    var col = num % 28;

    /* change picture based on dex no. and placement in 28 x 6 sprite sheet */
    front.prop('id', 'front').css({'background-position':
        'calc((' + col + ' * 320%) / 86.40) calc((' + row + ' * 320%) / 16.00)'});

    back.append(backImg);
    innerCardDiv.append(front, back);
    card.append(innerCardDiv);
    $('.cardHolder').append(card);
}

function displayStats() {
    $('.dexNo').text(noCaught);
    $('.gamesPlayed .value').text(gamesPlayed);
    $('.attempts .value').text(attempts);
    if (attempts) {
        accuracy = match_counter / attempts * 100;
    } else {
        accuracy = 0;
    }
    $('.accuracy .value').text(accuracy.toFixed(2) + '%');
}

function resetStats() {
    accuracy = 0;
    match_counter = 0;
    attempts = 0;
    displayStats();
}

function resetGame() {
    if (attempts !== null) {
        gamesPlayed++;
    }
    $('.winText').text('');
    resetStats();

    $('.cardHolder').empty();
    boardState = loadCards();
}