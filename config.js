module.exports = {
  footer: () => {
    let array = ["Made with ❤️ by developers", " © Pokelusion Development"]
    return array[Math.floor(Math.random() * array.length)]
  },
channels: {
  blacklist: '726420421724864532'
},
  token: "NzIxNjQyNDI1NzkzMTE4MjE4.XuXf4Q._2zM7OfgQftWcYDgmTKTjkuhlKs",
  prefix: "p!",
  banAppeal: "https://forms.gle/oPJeWG61ZfiPnkPd7",
  specials: ["448755552831406091", "707268508379250811", "712276770216476684","437570660441784320", "436184825423069194", "525322591796199445", "420525168381657090", "738700839916535828"],
  owners: ["712276770216476684","437570660441784320", "436184825423069194", "525322591796199445", "420525168381657090", "738700839916535828"],
  helpers: ["418370982181339137", "712276770216476684", "481356808871608320"],
  dbdevs: ["547221828360470528", "448755552831406091", "692341119572508732", "707268508379250811"],
  osdev: ["692341119572508732"],
  fd: ["566851016910438400"],
  td: ["334463847324844034"],
  mongo_atlas: {
      username: "pokebot",
      password: "pokebot1234",
      cluster: "Pokemon!",
      shard: {
          one: "pokebotdatabase-shard-00-00-gf1oy.mongodb.net:27017",
          two: "pokebotdatabase-shard-00-01-gf1oy.mongodb.net:27017",
          three: "pokebotdatabase-shard-00-02-gf1oy.mongodb.net:27017" 
      }
  },
cooldown: 3000
}