var firstCardClicked = null;
var secondCardClicked = null;
var canClick = true;
var total_possible_matches = 9;
var match_counter = null;
var attempts = null;
var accuracy = null;
var gamesPlayed = 0;

$(document).ready(initializeApp);

function initializeApp() {
    $('.cardHolder').on('click', '.card', cardClicked);
    $('.reset').on('click', resetGame);
    resetGame();
}

function cardClicked() {
    if (canClick){
        if($(this).hasClass('revealed')) {
            return;
        }

        $(this).find(".back").fadeOut(350);


        if(firstCardClicked === null) {
            firstCardClicked = $(this);
            firstCardClicked.addClass('revealed');
        } else {
            attempts++;
            secondCardClicked = $(this);
            secondCardClicked.addClass('revealed');

            var firstCardClass = firstCardClicked.attr('class');
            var firstCard = firstCardClass.slice(0, firstCardClass.indexOf(' '));

            var secondCardClass = secondCardClicked.attr('class');
            var secondCard = secondCardClass.slice(0, secondCardClass.indexOf(' '));

            if (firstCard === secondCard) {
                match_counter++;
                firstCardClicked = secondCardClicked = null;
                if (match_counter === total_possible_matches) {
                    console.log('win message');
                }

            } else {
                canClick = false;
                setTimeout(function () {
                    firstCardClicked.find('.back').fadeIn(350);
                    secondCardClicked.find('.back').fadeIn(350);
                    firstCardClicked.removeClass('revealed');
                    secondCardClicked.removeClass('revealed');
                    canClick = true;
                    firstCardClicked = secondCardClicked = null;
                }, 1500);
            }
        }
        displayStats();
    }

}

function addCard () {
    var type = 'masterBall';

    var newCard = $('<div>',{class: 'card ' + type});
    var newFront = $('<div>', {class: 'front'});
    var newBack = $('<div>', {class: 'back'});

    var frontImg = $('<img>', {src: 'images/' + type + '.png'});
    var backImg = $('<img>', {src: 'images/testImage.png'});

    newFront.append(frontImg);
    newBack.append(backImg);
    newCard.append(newFront).append(newBack);

    $('.cardHolder').append(newCard);
}

function displayStats() {
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

    resetStats();
    $('.card').find('.back').fadeIn(350);
    $('.card').removeClass('revealed');
}