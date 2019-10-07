//imports
importScripts('/js/sw-utils.js'); 
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

//TODO LO NECESARIO PARA MI APLICACION
const APP_SHELL = [
    '/',
    '/index.html',
    '/css/style.css',
    '/img/favicon.ico',
    '/img/avatars/spiderman.jpg',
    '/img/avatars/hulk.jpg',
    '/img/avatars/ironman.jpg',
    '/img/avatars/thor.jpg',
    '/img/avatars/wolverine.jpg',
    '/js/app.js',
    '/js/sw-utils.js'
];

//TODO LO NECESARIO Y QUE NO SE VA A MODIFICAR
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    '/css/animate.css',
    'js/libs/jquery.js'
]

self.addEventListener('install', e => {
    //ALMACENAR EN EL CACHE EL APP SHELL Y EL INMUTABLE
    const cacheStatic = caches.open(STATIC_CACHE).then( cache => {
        cache.addAll(APP_SHELL);
    })
    const cacheInmutable = caches.open(INMUTABLE_CACHE).then( cache => {
        cache.addAll(APP_SHELL_INMUTABLE);
    })

    e.waitUntil(Promise.all([ cacheStatic, cacheInmutable ]));
});

//Cada vez que yo cambie el service worker, me borre los caches anteriores que ya no me van a servir
self.addEventListener('activate', e => {
    //Si la version del cache del service worker actual es el mismo que esta activo no se hace nada, pero si es diferente, tengo que borrarlo 
    const respuesta = caches.keys().then( keys => {
        // console.log(keys);

        keys.forEach(key => {
            // console.log(key);
            if( key!== STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }
        })
    });
    e.waitUntil(respuesta);
});
self.addEventListener('fetch', e => {

    //Respuesta verificar si en el cache existe el request
    const respuesta = caches.match(e.request).then( res => {
        if(res){
            return res
        } else{ // fetch a ese recurso nuevo
            return fetch(e.request).then( newRes => {
                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes)
            })
        }
    });

    e.respondWith(respuesta);

});