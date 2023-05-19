// Search results list effect
const searchBar = document.querySelector('#searchBar')
const searchResults = document.querySelector('.search-results')

const navMenu = document.querySelector('.menu')
const dataContainer = document.querySelector('.data-container')

const cityName = document.querySelector('.city-name')
const uvi = document.querySelector('.uvi')
const vitaminStatus = document.querySelector('.vitamin-status')
const actualDay = document.querySelector('.day')
const tempNumber = document.querySelector('.temp-number')
const precPercent = document.querySelector('.prec-percent')
const windSpeed = document.querySelector('.wind-speed')
const humPercent = document.querySelector('.humidity-percent')


// Function for skin color and timing based on UVI level
const veryFairSkin = document.querySelector('.very-fair-color')
const fairSkin = document.querySelector('.fair-color')
const mediumSkin = document.querySelector('.medium-color')
const oliveSkin = document.querySelector('.olive-color')
const darkSkin = document.querySelector('.dark-color')
const veryDarkSkin = document.querySelector('.very-dark-color')

const timingUvi = function (uvindex) {
    if (uvindex < 3) {
        veryFairSkin.textContent = '30'
        fairSkin.textContent = '45'
        mediumSkin.textContent = '60'
        oliveSkin.textContent = '90'
        darkSkin.textContent = '120'
        veryDarkSkin.textContent = '150'
    } else if (uvindex >= 3 && uvindex < 6) {
        veryFairSkin.textContent = '15'
        fairSkin.textContent = '20'
        mediumSkin.textContent = '30'
        oliveSkin.textContent = '40'
        darkSkin.textContent = '60'
        veryDarkSkin.textContent = '75'
    } else if (uvindex >= 6 && uvindex < 8) {
        veryFairSkin.textContent = '10'
        fairSkin.textContent = '15'
        mediumSkin.textContent = '20'
        oliveSkin.textContent = '30'
        darkSkin.textContent = '45'
        veryDarkSkin.textContent = '60'
    } else if (uvindex >= 8 && uvindex < 11) {
        veryFairSkin.textContent = '5'
        fairSkin.textContent = '10'
        mediumSkin.textContent = '15'
        oliveSkin.textContent = '20'
        darkSkin.textContent = '30'
        veryDarkSkin.textContent = '40'
    } else {
        veryFairSkin.textContent = '0'
        fairSkin.textContent = '0'
        mediumSkin.textContent = '0'
        oliveSkin.textContent = '0'
        darkSkin.textContent = '0'
        veryDarkSkin.textContent = '0'
    }
}

// Slider function for selecting metric or imperial
const slider = document.querySelector('.setting-slider')
const ball = document.querySelector('.ball')
const metric = document.querySelector('.metric')
const imperial = document.querySelector('.imperial')

slider.addEventListener('click', function () {
    axios.get('/slider-setting')
        .then((response) => {
            console.log(response.data)
            if (response.data === "Metric") {
                ball.classList.toggle('imperial-ball')
                metric.classList.add('metric-color')
                imperial.classList.remove('imperial-color')
            } else {
                ball.classList.toggle('imperial-ball')
                imperial.classList.add('imperial-color')
                metric.classList.remove('metric-color')
            }
        })
        .catch((err) => {
            console.log(err)
        })
})




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
                                await axios.post('/weatherAPI', locationKeyData)
                                    .then(response => {
                                        if (response.data) {
                                            console.log(response.data)

                                            timingUvi(response.data[0].UVIndex)

                                            const dataParameter = dataContainer.getBoundingClientRect().top - navMenu.getBoundingClientRect().height - 10
                                            window.scrollTo({
                                                top: dataParameter,
                                                left: 0,
                                                behavior: 'smooth'
                                            })

                                            searchResults.classList.remove('search-results-input')
                                            setTimeout(function () {
                                                Array.from(searchResults.children).forEach(child => child.remove())
                                            }, 400)
                                            searchBar.value = ""
                                            cityName.textContent = location.textContent
                                            uvi.textContent = response.data[0].UVIndex
                                            const newDate = new Date()
                                            const numberedDay = newDate.getDay()
                                            const arrayOfDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                                            actualDay.textContent = arrayOfDays[numberedDay]
                                            let weatherNumber = Math.round(response.data[0].Temperature.Metric.Value)
                                            tempNumber.textContent = `${weatherNumber}C`
                                            let rainfall = response.data[0].Precip1hr.Metric.Value
                                            precPercent.textContent = `${rainfall}mm`
                                            let windValue = Math.round(response.data[0].Wind.Speed.Metric.Value)
                                            windSpeed.textContent = `${windValue}km/h`
                                            let airHumidity = response.data[0].RelativeHumidity
                                            humPercent.textContent = `${airHumidity}%`
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


