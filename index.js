$(document).ready(init);

let app;

function init() {
    app = new Match($('body'));
    app.start();
}