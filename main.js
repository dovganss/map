let myMap;
let coords;
let objectManager;

let objectId = 0;

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

    addListeners()
}

function addListeners() {
    myMap.events.add('click', function (event) {
        openModal(event);
    });

    objectManager.objects.events.add('click', (event)=>onObjectEvent(event));
    objectManager.clusters.events.add('click', (event)=> onClusterEvent(event));

    const btn = document.getElementById('send');

    btn.addEventListener('click', function (event) {
        event.preventDefault();
        validateForm();
        fillObjectInObjectManager();
        // myplacemark = new ymaps.Placemark(coords, {
        //     balloonContentHeader: "Балун метки",
        //     balloonContentBody: "Содержимое <em>балуна</em> метки",
        //     balloonContentFooter: "Подвал",
        //     hintContent: "Хинт метки"
        // });
        // myMap.geoObjects.add(myplacemark);
        // objectManager.add(myplacemark);

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


function fillObjectInObjectManager(){
    let featuresObj = {
        'type': 'Feature',
        'id': objectId,
        'geometry': {
            'type': 'Point',
            'coordinates': coords
        },
        // 'properties': {
        //     'balloonContentHeader': `<b>${place}</b>`,
        //     'balloonContentBody': `<a href="#" class="slider__link">${name}</a>
        //                             <p>${review}</p>`,
        //     'balloonContentFooter': `${Date.now().toLocaleString()}`,
        // }
    };

    objectManager.add({
        'type': 'FeatureCollection',
        'features': [featuresObj]
    });

    objectId++;
}


function validateForm() {
    const name = document.getElementById('name')
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
    // console.log(objectId);

}


function onClusterEvent(event) {

}