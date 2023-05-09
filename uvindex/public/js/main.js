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

const cityName = document.querySelector('.city-name')
const uvi = document.querySelector('.uvi')
const vitaminStatus = document.querySelector('.vitamin-status')
const tempNumber = document.querySelector('.temp-number')
const precPercent = document.querySelector('.prec-percent')
const windSpeed = document.querySelector('.wind-speed')
const humPercent = document.querySelector('.humidity-percent')

let consecutiveTimeout;

let allListItems;

searchBar.addEventListener('input', function () {
    clearTimeout(consecutiveTimeout)
    consecutiveTimeout = setTimeout(() => {
        let searchBarData = document.querySelector('#searchBar')
        if (searchBarData.value) {
            let data = {
                location: `${searchBarData.value}`
            }
            axios.post('/geocoder', data)
                .then(response => {
                    function updateResults(results) {
                        let listItem;
                        if (results.length !== 0) {
                            if (searchResults.children) {
                                Array.from(searchResults.children).forEach(child => child.remove())
                            }
                            for (let i = 0; i < results.length; i++) {
                                listItem = document.createElement('li')
                                listItem.setAttribute('class', 'listItem')
                                searchResults.appendChild(listItem)
                                listItem.textContent = `${results[i].LocalizedName}, ${results[i].AdministrativeArea.LocalizedName}, ${results[i].Country.ID}`
                                listItem.setAttribute('data-locationkey', `${results[i].Key}`)
                            }
                            searchResults.classList.add('search-results-input')
                        } else {
                            searchResults.classList.remove('search-results-input')
                            setTimeout(function () {
                                Array.from(searchResults.children).forEach(child => child.remove())
                            }, 400)
                        }
                    }
                    updateResults(response.data)


                    allListItems = document.querySelectorAll('.listItem')
                    for (let location of Array.from(allListItems)) {
                        location.addEventListener('click', function () {
                            let keyData = location.getAttribute('data-locationkey')
                            let locationKeyData = {
                                key: `${keyData}`
                            }
                            console.log(locationKeyData)
                            async function callLocation() {
                                await axios.post('/locationAPI', locationKeyData)
                                    .then(response => {
                                        if (response.data) {
                                            cityName.textContent = location.textContent
                                            uvi.textContent = response.data[0].UVIndex


                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    })
                            }
                            callLocation()
                        })
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

// Button glass effect and scroll behavior
const locationBtn = document.querySelector('.search-active')
const glassEffect = document.querySelector('.glass')
const searchBarContainer = document.querySelector('.search-bar-container')

locationBtn.addEventListener('click', function (event) {
    let ripple = document.createElement('span')
    let left = event.clientX - event.target.getBoundingClientRect().left
    let top = event.clientY - event.target.getBoundingClientRect().top
    ripple.style.left = `${left}px`
    ripple.style.top = `${top}px`
    ripple.classList.add('glass')
    locationBtn.appendChild(ripple)
    setTimeout(() => {
        ripple.remove()
    }, 500)
    let offset = searchBarContainer.getBoundingClientRect().top
    setTimeout(() => {
        window.scrollTo({
            top: offset,
            left: 0,
            behavior: "smooth"
        })
        searchBar.focus()
    }, 300)

})


