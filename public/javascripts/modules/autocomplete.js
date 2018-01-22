function autocomplete(input, lat, lng) {
    if (!input) {
        return
    }

    const dropdown = new google.maps.places.Autocomplete(input)

    dropdown.addListener('place_changed', () => {
        const place = dropdown.getPlace()
        lat.value = place.geometry.location.lat()
        lng.value = place.geometry.location.lng()
    })

    input.on('keydown', (evt) => {
        if (evt.keyCode === 13) {
            evt.preventDefault()
        }
    })
}

export default autocomplete