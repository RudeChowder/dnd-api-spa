const emptyStar = "☆"
const fullStar = "★"

class Monster {
  constructor (index, url) {
    this.index = index
    this.url = url
  }

  // possible to DRY this up?
  createTags () {
    this.card = document.createElement("div")
    this.card.classList.add("monster-card")
    this.nameTag = document.createElement("h2")
    this.nameTag.classList.add("name")
    this.sizeTag = document.createElement("p")
    this.nameTag.classList.add("size")
    this.typeTag = document.createElement("p")
    this.nameTag.classList.add("type")
    this.subtypeTag = document.createElement("p")
    this.nameTag.classList.add("subtype")
    this.challengeRatingTag = document.createElement("p")
    this.nameTag.classList.add("challenge-rating")
  }

  createFavoriteButton () {
    this.favoriteButton = document.createElement("button")
    this.favoriteButton.type = "button"
    this.favoriteButton.innerHTML = `Favorite <span class="empty">${emptyStar}</span>`
    this.favoriteButton.addEventListener("click", () => this.handleFavorite())
  }

  handleFavorite () {
    if (favoriteMonsters.includes(this)) {
      this.favoriteButton.innerHTML = `Favorite <span class="empty">${emptyStar}</span>`
      const location = favoriteMonsters.indexOf(this)
      favoriteMonsters.splice(location, 1)
      console.log(favoriteMonsters)
      this.favoritesListItem.remove()
    } else {
      favoriteMonsters.push(this)
      this.favoriteButton.innerHTML = `Favorite <span class="full">${fullStar}</span>`
      this.favoritesListItem = document.createElement("li")
      this.favoritesListItem.innerText = this.name
      document.querySelector("#favorites-list").append(this.favoritesListItem)
      console.log(favoriteMonsters)
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
        this.challengeRating = attributes.challenge_rating
        this.populateTags() // Should this go here? Avoiding asynch issues
      })
  }

  populateTags () {
    this.card.id = this.index
    this.nameTag.innerHTML = `${this.name}`
    // this.setTagText([this.sizeTag, this.typeTag, this.subtypeTag, this.challengeRatingTag])
    this.sizeTag.innerHTML = `<strong>Size: </strong>${this.size}`
    this.typeTag.innerHTML = `<strong>Type: </strong>${this.type}`
    this.subtypeTag.innerHTML = `<strong>Subtype: </strong>${this.subtype}`
    this.challengeRatingTag.innerHTML = `<strong>Challenge Rating: </strong>${this.challengeRating}`
  }

  buildCard () {
    this.card.append(this.nameTag)
    this.card.append(this.sizeTag)
    this.card.append(this.typeTag)
    this.card.append(this.subtypeTag)
    this.card.append(this.challengeRatingTag)
    this.card.append(this.favoriteButton)
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

const favoriteMonsters = []
document.addEventListener("DOMContentLoaded", () => {
  const clearCurrentCards = () => {
    allMonsters.forEach(monster => {
      monster.card.classList.add("hidden")
    })
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

  let allMonsters = []
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
    } else {
      alert("No results found")
    }
    searchInput.value = ""
  })

  document.querySelector("#show-favorites-button").addEventListener("click", () => {
    displayRequestedMonsters(favoriteMonsters)
  })
})
