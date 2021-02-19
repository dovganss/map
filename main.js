let myMap;
let coords;
let objectManager;

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

  addListeners()
}

function addListeners(){
  myMap.events.add('click', function (event) {
    openModal(event);
  });

  objectManager.objects.events.add(['mouseenter', 'mouseleave'], onObjectEvent);
  objectManager.clusters.events.add(['mouseenter', 'mouseleave'], onClusterEvent);

  const btn = document.getElementById('send');

  btn.addEventListener('click', function(event) {
    event.preventDefault();
    validateForm()
    myplacemark = new ymaps.Placemark(coords, {
      balloonContentHeader: "Балун метки",
      balloonContentBody: "Содержимое <em>балуна</em> метки",
      balloonContentFooter: "Подвал",
      hintContent: "Хинт метки"
     });
     myMap.geoObjects.add(myplacemark);
     objectManager.add(myplacemark);

     const modal = document.getElementById('modal');
     modal.style.display = 'none';
  });
}

const closeModal = document.querySelector(".modal__close-img")
closeModal.addEventListener('click', (e) => {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
});

function validateForm() {
  const name = document.getElementById('name')
}

function openModal(event){
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

function onObjectEvent(){

}


function onClusterEvent(){

}