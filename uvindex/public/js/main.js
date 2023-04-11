// window.addEventListener('load', function () {
//     navigator.geolocation.getCurrentPosition(onSuccess, onError)
// })

// function onSuccess(position) {
//     console.log(position)
// }

// function onError(error) {
//     console.log(error)
// }


// Search results list effect
const searchBar = document.querySelector('#searchBar')
const searchResults = document.querySelector('.search-results')

searchBar.addEventListener('input', function () {
    searchResults.classList.add('search-results-input')
})


// Mobile menu
const hamburger = document.querySelector('.hamburger-menu')
const mobileMenu = document.querySelector('.mobile-menu')
const lineOne = document.querySelector('.line1')
const lineTwo = document.querySelector('.line2')
const lineThree = document.querySelector('.line3')

let menuStatus = false

hamburger.addEventListener('click', function () {
    if (menuStatus === false) {
        menuStatus = true
        mobileMenu.classList.add('mobile-menu-true')
        lineOne.classList.add('line1-effect')
        lineTwo.classList.add('line2-effect')
        lineThree.classList.add('line3-effect')
        document.body.classList.add('no-scroll')
    } else {
        menuStatus = false
        mobileMenu.classList.remove('mobile-menu-true')
        document.body.classList.remove('no-scroll')
    }
})