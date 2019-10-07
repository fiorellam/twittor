// Guarda en el cache dinamico
function actualizaCacheDinamico(dynamicCache, request, response){
    if (response.ok){
        return caches.open(dynamicCache).then(cache => {
            cache.put(request, response.clone());
            return response.clone();
        })
    }else { //fallo la red y la respuesta
        return response;
    }
}