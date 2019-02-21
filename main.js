var firstCardClicked = null;
var secondCardClicked = null;
var canClick = true;
var total_possible_matches = 2;
var match_counter = 0;

$(document).ready(initializeApp);

function initializeApp() {
    $('.card').click(cardClicked);
}

function cardClicked() {
    if (canClick){
        $(this).find(".back").fadeOut(500);

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
                    console.log("WIN");
                }

            } else {
                canClick = false;
                setTimeout(function () {
                    firstCardClicked.find('.back').fadeIn(500);
                    secondCardClicked.find('.back').fadeIn(500);
                    canClick = true;
                    firstCardClicked = secondCardClicked = null;
                }, 2000);
            }
        }
    }

}