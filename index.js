class Monster {
  constructor (index, url) {
    this.index = index
    this.url = url
  }
  
  // possible to DRY this up?
  createTags () {
    this.div = document.createElement("div")
    this.div.classList.add("monster-card")
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
    this.div.id = this.index
    this.nameTag.innerHTML = `${this.name}`
    // this.setTagText([this.sizeTag, this.typeTag, this.subtypeTag, this.challengeRatingTag])
    this.sizeTag.innerHTML = `<strong>Size: </strong>${this.size}`
    this.typeTag.innerHTML = `<strong>Type: </strong>${this.type}`
    this.subtypeTag.innerHTML = `<strong>Subtype: </strong>${this.subtype}`
    this.challengeRatingTag.innerHTML = `<strong>Challenge Rating: </strong>${this.challengeRating}`
  }

  buildCard () {
    this.div.append(this.nameTag)
    this.div.append(this.sizeTag)
    this.div.append(this.typeTag)
    this.div.append(this.subtypeTag)
    this.div.append(this.challengeRatingTag)
  }

  addCardToPage () {
    document.querySelector("#monster-list").append(this.div)
  }

  generateAndAppendCard () {
    this.createTags()
    this.fetchAttributesAndPopulateTags()
    this.buildCard()
    this.addCardToPage()
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // GET all the monsters from the api

  fetch("https://www.dnd5eapi.co/api/monsters")
    .then(resp => resp.json())
    .then(monsters => {
      const monster = monsters.results[0]
      const monsterObj = new Monster(monster.index, monster.url)
      monsterObj.generateAndAppendCard()
    })
  // GET the info for each monster
  // create a monster-card for each monster
  // fill in info into the correct elements
  // attach the elements to the card
  // attach the card to the monster container
})
