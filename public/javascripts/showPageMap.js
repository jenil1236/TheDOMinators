maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: parking.geometry.coordinates,
    zoom: 10
})

new maptilersdk.Marker()
    .setLngLat(parking.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h5>${parking.name}</h5><p>${parking.location}</p>`
            )
    )
    .addTo(map)