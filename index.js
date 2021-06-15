const emptyStar = "☆"
const fullStar = "★"

const capitalizeFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1)

class Monster {
  constructor (index, url) {
    this.index = index
    this.url = url
    this.favorite = false
  }

  // possible to DRY this up?
  createTags () {
    this.card = document.createElement("div")
    this.card.classList.add("monster-card")
    this.nameTag = document.createElement("h2")
    this.nameTag.classList.add("name")
    this.sizeTag = document.createElement("p")
    this.sizeTag.classList.add("size")
    this.typeTag = document.createElement("p")
    this.typeTag.classList.add("type")
    this.subtypeTag = document.createElement("p")
    this.subtypeTag.classList.add("subtype")
    this.alignmentTag = document.createElement("p")
    this.alignmentTag.classList.add("alignment")
    this.challengeRatingTag = document.createElement("p")
    this.challengeRatingTag.classList.add("challenge-rating")
  }

  createFavoriteButton () {
    this.favoriteButtonDiv = document.createElement("div")
    this.favoriteButtonDiv.className = "favorite-button-container"
    this.favoriteButton = document.createElement("button")
    this.favoriteButton.type = "button"
    this.favoriteButton.innerHTML = `Favorite <span class="empty">${emptyStar}</span>`
    this.favoriteButtonDiv.append(this.favoriteButton)
    this.favoriteButton.addEventListener("click", () => this.handleFavorite())
  }

  handleFavorite () {
    this.favorite = !this.favorite
    this.checkFavorite()
  }

  checkFavorite () {
    if (this.favorite === false) {
      this.favoriteButton.innerHTML = `Favorite <span class="empty">${emptyStar}</span>`
      this.favoritesListItem.remove()
    } else {
      this.favoriteButton.innerHTML = `Favorite <span class="full">${fullStar}</span>`
      this.favoritesListItem = document.createElement("li")
      this.favoritesListItem.innerText = this.name
      document.querySelector("#favorites-list").append(this.favoritesListItem)
    }
  }

  fetchAttributesAndPopulateTags () {
    fetch(`https://www.dnd5eapi.co${this.url}`)
      .then(resp => resp.json())
      .then(attributes => {
        this.name = attributes.name
        this.size = attributes.size
        this.type = attributes.type
        this.subtype = attributes.subtype
        this.alignment = attributes.alignment
        this.challengeRating = attributes.challenge_rating
        this.populateTags() // Should this go here? Avoiding asynch issues
      })
  }

  populateTags () {
    this.card.id = this.index
    this.nameTag.innerHTML = `${this.name}`
    // this.setTagText([this.sizeTag, this.typeTag, this.subtypeTag, this.challengeRatingTag])
    this.sizeTag.innerHTML = `<strong>Size: </strong>${this.size}`
    this.typeTag.innerHTML = `<strong>Type: </strong>${capitalizeFirstLetter(this.type)}`
    if (this.subtype) {
      this.subtypeTag.innerHTML = `<strong>Subtype: </strong>${capitalizeFirstLetter(this.subtype)}`
    } else {
      this.subtypeTag.innerHTML = "<strong>Subtype: </strong>None"
    }
    this.alignmentTag.innerHTML = `<strong>Alignment: </strong>${capitalizeFirstLetter(this.alignment)}`
    this.challengeRatingTag.innerHTML = `<strong>Challenge Rating: </strong>${this.challengeRating}`
  }

  buildCard () {
    this.card.append(this.nameTag)
    this.card.append(this.sizeTag)
    this.card.append(this.typeTag)
    this.card.append(this.subtypeTag)
    this.card.append(this.alignmentTag)
    this.card.append(this.challengeRatingTag)
    this.card.append(this.favoriteButtonDiv)
  }

  addCardToPage () {
    document.querySelector("#monster-list").append(this.card)
  }

  generateAndAppendCard () {
    this.createTags()
    this.fetchAttributesAndPopulateTags()
    this.createFavoriteButton()
    this.buildCard()
    this.addCardToPage()
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const clearCurrentCards = () => {
    allMonsters.forEach(monster => {
      monster.card.classList.add("hidden")
    })
  }

  const currentFavoriteMonsters = () => {
    return allMonsters.filter(monster => monster.favorite === true)
  }

  const displayRequestedMonsters = (requestedMonsters) => {
    clearCurrentCards()
    requestedMonsters.forEach(monster => {
      if (document.querySelector(`#${monster.index}`)) {
        document.querySelector(`#${monster.index}`).classList.remove("hidden")
      } else {
        console.log(`card not found for ${monster.index}`)
      }
    })
  }

  const allMonsters = []
  // GET all the monsters from the api
  fetch("https://www.dnd5eapi.co/api/monsters")
    .then(resp => resp.json())
    .then(monsters => {
      const testMonsters = monsters.results
      console.log(testMonsters)
      const sample = [testMonsters[0], testMonsters[20], testMonsters[50], testMonsters[88], testMonsters[100], testMonsters[138], testMonsters[190]]
      sample.forEach(monster => {
        const monsterObj = new Monster(monster.index, monster.url)
        monsterObj.generateAndAppendCard()
        allMonsters.push(monsterObj)
      })


      // monsters.results.forEach(monster => {
      //   const monsterObj = new Monster(monster.index, monster.url)
      //   monsterObj.generateAndAppendCard()
      //   allMonsters.push(monsterObj)
      // })
    })

  document.querySelector("#alphabetical-filter").addEventListener("change", (event) => {
    if (event.target.value === "all") {
      displayRequestedMonsters(allMonsters)
    } else {
      const requestedMonsters = allMonsters.filter(monster => monster.index.charAt(0) === event.target.value)
      displayRequestedMonsters(requestedMonsters)
    }
  })

  document.querySelector("#search-form").addEventListener("submit", event => {
    event.preventDefault()
    const searchInput = document.querySelector("#search-input")
    // force search term into monster index format for filtering
    const searchTerm = searchInput.value.toLowerCase().trim().replace(" ", "-")
    const requestedMonsters = allMonsters.filter(monster => monster.index.includes(searchTerm))
    if (requestedMonsters.length > 0) {
      displayRequestedMonsters(requestedMonsters)
      searchInput.value = ""
    } else {
      alert("No results found")
    }
  })

  document.querySelector("#show-favorites-button").addEventListener("click", () => {
    displayRequestedMonsters(currentFavoriteMonsters())
  })

  document.querySelector("#clear-favorites").addEventListener("click", () => {
    const confirmed = confirm("Are you sure you want to clear favorites list?")
    if (confirmed) {
      currentFavoriteMonsters().forEach(monster => {
        monster.favorite = false
        monster.checkFavorite()
      })
      document.querySelector("#favorites-list").innerHTML = ""
    }
  })
})
