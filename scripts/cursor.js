let cursor = document.querySelector('#cursor');
let body = document.querySelector('body');

document.onmousemove = function(e) {
    //move cursor
    cursor.style.top = e.pageY + 'px';
    cursor.style.left = e.pageX + 'px';

    //body code here

    let element = document.createElement('div');
    element.className = 'element';
    body.prepend(element);


    element.style.left = cursor.getBoundingClientRect().x + window.scrollX + 'px';
    element.style.top = cursor.getBoundingClientRect().y + window.scrollY + 'px';


    setTimeout(function() {
        let text = document.querySelectorAll('.element')[0],
        directionX = Math.random() < .5 ? -1 : 1,
        directionY = Math.random() < .5 ? -1 : 1

        text.style.left = parseInt(text.style.left) - (directionX * (Math.random() * 200)) + 'px';
        text.style.top = parseInt(text.style.top) - (directionY * (Math.random() * 200)) + 'px';
        text.style.opacity = 0;
        text.style.transform = 'scale(0.25)';
        text.innerHTML = randomLetter()

        //remove element
        setTimeout(function() {
            element.remove()
        }, 1000)
    }, 10)
}

function randomLetter() {
    var text = ("abcdefghijklmnopqrstuvwxyz1234567890").split("");
    letter = text[Math.floor(Math.random() * text.length)];
    return letter
}
