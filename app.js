// Initialisation des éléments du DOM
let nextDom = document.getElementById('next');
let prevDom = document.getElementById('prev');

let carouselDom = document.querySelector('.carousel');
let SliderDom = carouselDom.querySelector('.carousel .list');
let thumbnailBorderDom = document.querySelector('.carousel .thumbnail');
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
let timeDom = document.querySelector('.carousel .time');

// Configuration des durées
let timeRunning = 3000;
let timeAutoNext = 15000;

// Gestion des événements "suivant" et "précédent"
nextDom.onclick = function(){
    showSlider('next');    
}

prevDom.onclick = function(){
    showSlider('prev');    
}

// Changement automatique de l'image
let runTimeOut;
let runNextAuto = setTimeout(() => {
    nextDom.click();
}, timeAutoNext)

// Fonction pour afficher le slider
function showSlider(type){
    let SliderItemsDom = SliderDom.querySelectorAll('.carousel .list .item');
    let thumbnailItemsDom = document.querySelectorAll('.carousel .thumbnail .item');

    // Retirer la classe active de l'élément actuel
    SliderItemsDom.forEach(item => item.classList.remove('active'));
    thumbnailItemsDom.forEach(item => item.classList.remove('active'));

    if(type === 'next'){
        SliderDom.appendChild(SliderItemsDom[0]);
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
    }else{
        SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
        thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
    }

    // Ajouter la classe active au nouvel élément
    SliderItemsDom = SliderDom.querySelectorAll('.carousel .list .item');
    thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
    SliderItemsDom[0].classList.add('active');
    thumbnailItemsDom[0].classList.add('active');

    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        // Les classes 'next' et 'prev' sont supprimées après l'animation
        carouselDom.classList.remove('next');
        carouselDom.classList.remove('prev');
    }, timeRunning);

    clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
        nextDom.click();
    }, timeAutoNext)
}

// Initialiser la première image comme active
document.addEventListener("DOMContentLoaded", () => {
    let SliderItemsDom = SliderDom.querySelectorAll('.carousel .list .item');
    let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
    if (SliderItemsDom.length > 0) {
        SliderItemsDom[0].classList.add('active');
        thumbnailItemsDom[0].classList.add('active');
    }
});
