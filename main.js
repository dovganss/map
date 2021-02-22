let myMap;
let coords;
let objectManager;

let objectId = 0;

let reviews = [];

const STORAGE_KEY = 'REVIEWS_APP';

ymaps.ready(init);

function init() {
    myMap = new ymaps.Map('map', {
        center: [55.75, 37.62],
        zoom: 12,
    });

    objectManager = new ymaps.ObjectManager({
        // Чтобы метки начали кластеризоваться, выставляем опцию.
        clusterize: true,
        // ObjectManager принимает те же опции, что и кластеризатор.
        gridSize: 32,
        clusterDisableClickZoom: true
    });

    myMap.geoObjects.add(objectManager);

    const savedReviews = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (savedReviews){
        savedReviews.forEach(item => {
            let featuresObj = {
                'type': 'Feature',
                'id': item.objectId,
                'geometry': {
                    'type': 'Point',
                    'coordinates': item.coords
                },
            };
            reviews.push({
                objectId: item.objectId,
                coords: item.coords,
                reviews: [...item.reviews]
            });
        
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
        
            objectManager.add({
                'type': 'FeatureCollection',
                'features': [featuresObj]
            });        
        });
    }

    addListeners()
}

function addListeners() {
    myMap.events.add('click', function (event) {
        clearReviews();
        openModal(event);
    });

    objectManager.objects.events.add('click', (event)=>onObjectEvent(event));
    objectManager.clusters.events.add('click', (event)=> onClusterEvent(event));

    const btn = document.getElementById('send');

    btn.addEventListener('click', function (event) {
        event.preventDefault();
        const name = document.getElementById('name');
        const place = document.getElementById('place');
        const review = document.getElementById('review');

        validateForm(name, place, review);
        fillObjectInObjectManager(name, place, review);

        const modal = document.getElementById('modal');
        modal.style.display = 'none';
        document.getElementById('name').value = '';
        document.getElementById('place').value = '';
        document.getElementById('review').value = '';
    });

    const closeModal = document.querySelector(".modal__close-img")
    closeModal.addEventListener('click', (e) => {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
        document.getElementById('name').value = '';
        document.getElementById('place').value = '';
        document.getElementById('review').value = '';
    });

}


function fillObjectInObjectManager(name, place, review){
    let featuresObj = {
        'type': 'Feature',
        'id': objectId,
        'geometry': {
            'type': 'Point',
            'coordinates': coords
        },
    };

    reviews.push({
        objectId: objectId,
        coords: coords,
        reviews: [{
            name: name.value,
            place: place.value,
            review: review.value,
            date: new Date().toLocaleString()
            }]
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));

    objectManager.add({
        'type': 'FeatureCollection',
        'features': [featuresObj]
    });

    objectId++;
}


function validateForm(name, place, review) {
    return name.value && place.value && review.value;
}

function openModal(event) {
    let posX = event.getSourceEvent().originalEvent.domEvent.originalEvent.clientX;
    let posY = event.getSourceEvent().originalEvent.domEvent.originalEvent.clientY;
    coords = event.get('coords');

    const adr = getClickCoords(coords);
    console.log(adr);

    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    modal.style.left = `${posX}px`;
    modal.style.top = `${posY}px`;
}

function getClickCoords(coords) {
    return new Promise((resolve, reject) => {
        ymaps.geocode(coords)
            .then(response => resolve(response.geoObjects.get(0).getAddressLine()))
            .catch(e => reject(e))
    })
}

function onObjectEvent(event) {
    const objectId = event.get('objectId');
    openModal(event);

    clearReviews();
    const reviewsByPlace = reviews.filter(item => item.objectId === objectId);
    if (reviewsByPlace) {
        const reviewsList = document.getElementById('reviewsList');
        reviewsByPlace.forEach(item=> {
            item.reviews.forEach(review =>{
                const reviewItem = document.createElement('div');
                reviewItem.classList.add('review__item');
                reviewItem.innerHTML = `<div class="modal__item-top">` + 
                `<span class="modal__item-name">${review.name}</span>
                <span class="modal__item-place">${review.place}</span>
                <span class="modal__item-place">${review.date}</span>` + 
                `</div>`;
                reviewsList.appendChild(reviewItem);
            });
        })
    }

    // console.log(objectId);

}

function clearReviews(){
    const userReviews = document.querySelector('.modal__list');
    if (userReviews){
        Array.from(userReviews).forEach(item => item.remove());
    }
}


function onClusterEvent(event) {

}