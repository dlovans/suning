// window.addEventListener('load', function () {
//     navigator.geolocation.getCurrentPosition(onSuccess, onError)
// })

// function onSuccess(position) {
//     console.log(position)
// }

// function onError(error) {
//     console.log(error)
// }

const searchBar = document.querySelector('#searchBar')
const searchResults = document.querySelector('.search-results')

searchBar.addEventListener('input', function () {
    searchResults.classList.add('search-results-input')
})