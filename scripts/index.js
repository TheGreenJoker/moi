
//<h1 id="typewriter"></h1>

const message = "Bonjour, monde !";
const typewriter = document.getElementById("typewriter");
let index = 0;

function typeWriter() {
    if (index <= message.length) {
        // On ajoute le texte en cours + le curseur
        typewriter.innerHTML = message.substring(0, index) + '<span class="cursor">_</span>';
        index++;
        setTimeout(typeWriter, 100);
    }
}

typeWriter();