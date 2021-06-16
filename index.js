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
    this.favoriteButton.className = "favorite-button"
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
      this.favoriteButton.classList.remove("favorited")
      this.favoritesListItem.remove()
    } else {
      this.favoriteButton.innerHTML = `Favorite <span class="full">${fullStar}</span>`
      this.favoriteButton.classList.add("favorited")
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
        this.xp = attributes.xp
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

class Player {
  constructor (level) {
    this.level = level
  }
}

class Encounter {
  constructor () {
    this.players = []
    this.monsters = []
    this.xpThresholdsPerLevel = {
      1: { easy: 25, medium: 50, hard: 75, deadly: 100 },
      2: { easy: 50, medium: 100, hard: 150, deadly: 200 },
      3: { easy: 75, medium: 150, hard: 225, deadly: 400 },
      4: { easy: 125, medium: 250, hard: 375, deadly: 500 },
      5: { easy: 250, medium: 500, hard: 750, deadly: 1100 },
      6: { easy: 300, medium: 600, hard: 900, deadly: 1400 },
      7: { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
      8: { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
      9: { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
      10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
      11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
      12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
      13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
      14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
      15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
      16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
      17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
      18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
      19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
      20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700 }
    }
    this.monsterQuantityMultiplierBreakpoints = {
      1: 1,
      2: 1.5,
      3: 2,
      7: 2.5,
      11: 3,
      15: 4
    }
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

  document.querySelector("#alphabetical-filter").addEventListener("mouseup", (event) => {
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

// start with 1 player
// can be incremented and decremented. Bottom out at 1
// user can add or remove li's
// user can add monsters to the encounter
// add a counter next to each monster default and bottom out at 1
// can be incremented
// can remove monster
// when calculate is clicked
// - calculate xp budget per character and add them all together
// - save the xp thresholds for those characters
// - calculate xp of all monsters
// - calculate number of monsters and apply modifier to xp total
// - determine which threshold the enounter lands in
