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

let consecutiveTimeout;

searchBar.addEventListener('input', function () {
    clearTimeout(consecutiveTimeout)
    consecutiveTimeout = setTimeout(() => {
        let searchBarData = document.querySelector('#searchBar')
        if (searchBarData.value) {
            let data = {
                location: `${searchBarData.value}`
            }
            console.log(data)
            axios.post('/geocoder', data)
                .then(response => {
                    console.log(response.data)
                    for (let location of response.data) {
                        let newItem = document.createElement('li')
                        newItem.textContent = `${location.LocalizedName}, ${location.AdministrativeArea.LocalizedName}, ${location.Country.ID}`
                        searchResults.appendChild(newItem)
                        console.log(searchResults.children[0].textContent)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            searchResults.classList.add('search-results-input')
        } else {
            searchResults.classList.remove('search-results-input')
            setTimeout(function () {
                Array.from(searchResults.children).forEach(child => child.remove())
            }, 500)
        }
    }, 500)

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
        lineOne.classList.remove('line1-effect')
        lineTwo.classList.remove('line2-effect')
        lineThree.classList.remove('line3-effect')
        document.body.classList.remove('no-scroll')
    }
})

// Button glass effect
const locationBtn = document.querySelector('.search-active')
const glassEffect = document.querySelector('.glass')

locationBtn.addEventListener('click', function (event) {
    let left = event.clientX - event.target.getBoundingClientRect().left
    let top = event.clientY - event.target.getBoundingClientRect().top
    console.log(left, top)
    glassEffect.style.left = `${left}px`
    glassEffect.style.top = `${top}px`
    glassEffect.classList.add('glass-animation')
    // setTimeout(() => {
    //     glassEffect.classList.remove('glass-animation')
    // }, 400)
})