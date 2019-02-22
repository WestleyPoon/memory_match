var firstCardClicked = null;
var secondCardClicked = null;
var canClick = true;
var total_possible_matches = 2;
var match_counter = 0;

$(document).ready(initializeApp);

function initializeApp() {
    $('.cardHolder').on('click', '.card', cardClicked);
}

function cardClicked() {
    if (canClick){
        $(this).find(".back").fadeOut(350);

        console.log($(this).attr('class'));

        if(firstCardClicked === null) {
            firstCardClicked = $(this);
        } else {
            secondCardClicked = $(this);

            var firstCardClass = firstCardClicked.attr('class');
            var firstCard = firstCardClass.slice(firstCardClass.lastIndexOf(' ') + 1);

            var secondCardClass = secondCardClicked.attr('class');
            var secondCard = secondCardClass.slice(secondCardClass.lastIndexOf(' ') + 1);

            if (firstCard === secondCard) {
                match_counter++;
                firstCardClicked = secondCardClicked = null;
                if (match_counter === total_possible_matches) {
                    alert('win message');
                }

            } else {
                canClick = false;
                setTimeout(function () {
                    firstCardClicked.find('.back').fadeIn(350);
                    secondCardClicked.find('.back').fadeIn(350);
                    canClick = true;
                    firstCardClicked = secondCardClicked = null;
                }, 1500);
            }
        }
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