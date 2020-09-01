 /* basic format
    {     
      name: "",
      type: "",
      url: ".png",
      hp: 0,
      atk: 0,
      def: 0,
      spatk: 0,
      spdef: 0,
      speed: 0
    },*/
var forms = [
{     
      name: "white-kyurem",
      type: "Dragon | Ice",
      url: "https://imgur.com/LkuEWIC.png",
      hp: 120,
      atk: 125,
      def: 90,
      spatk: 170,
      spdef: 100,
      speed: 95
    },
  {     
      name: "kyurem-white",
      type: "Dragon | Ice",
      url: "https://imgur.com/LkuEWIC.png",
      hp: 120,
      atk: 125,
      def: 90,
      spatk: 170,
      spdef: 100,
      speed: 95
    },
  {     
      name: "black-kyurem",
      type: "Dragon | Ice",
      url: "https://imgur.com/NOGtsSl.png",
      hp: 125,
      atk: 170,
      def: 100,
      spatk: 120,
      spdef: 90,
      speed: 95
    },
  {     
      name: "kyurem-black",
      type: "Dragon | Ice",
      url: "https://imgur.com/NOGtsSl.png",
      hp: 125,
      atk: 170,
      def: 100,
      spatk: 120,
      spdef: 90,
      speed: 95
    },
  {     
      name: "hoopa-unbound",
      type: "psychic | dark",
      url: "https://imgur.com/ESCuItm.png",
      hp: 80,
      atk: 160,
      def: 60,
      spatk: 170,
      spdef: 130,
      speed: 80
    },
  {     
      name: "xerneas-neutral",
      type: "Psychic | Dark",
      url: "https://imgur.com/3VPHbzA.png",
      hp: 126,
      atk: 131,
      def: 95,
      spatk: 131,
      spdef: 98,
      speed: 99
    },
  {     
      name: "shaymin-sky",
      type: "Grass | Flying",
      url: "https://imgur.com/JUlfen0.png",
      hp: 100,
      atk: 103,
      def: 75,
      spatk: 120,
      spdef: 75,
      speed: 127
    },
  {     
      name: "keldeo-resolute",
      type: "Water | Fighting",
      url: "https://imgur.com/dbOTGzD.png",
      hp: 91,
      atk: 72,
      def: 90,
      spatk: 129,
      spdef: 90,
      speed: 108
    },
  {     
      name: "tornadus-therian",
      type: "Flying",
      url: "https://imgur.com/2U1loRp.png",
      hp: 79,
      atk: 100,
      def: 80,
      spatk: 110,
      spdef: 90,
      speed: 121
    },
  {     
      name: "thundurus-therian",
      type: "Electric | Flying",
      url: "https://imgur.com/GY3G6ty.png",
      hp: 79,
      atk: 105,
      def: 70,
      spatk: 145,
      spdef: 80,
      speed: 101
    },
  {     
      name: "landorus-therian",
      type: "Ground | Flying",
      url: "https://imgur.com/IV4ntlY.png",
      hp: 89,
      atk: 145,
      def: 90,
      spatk: 105,
      spdef: 80,
      speed: 91
    },
  {     
      name: "meloetta-pirouette",
      type: "Normal | Fighting",
      url: "https://imgur.com/lp7wJMX.png",
      hp: 100,
      atk: 128,
      def: 90,
      spatk: 77,
      spdef: 77,
      speed: 128
    },
  {     
      name: "zygarde-10%",
      type: "dragon | ground",
      url: "https://imgur.com/Bj1KWVj.png",
      hp: 54,
      atk: 100,
      def: 71,
      spatk: 61,
      spdef: 85,
      speed: 115
    },
  {     
      name: "complete-zygarde",
      type: "Dragon | Ground",
      url: "https://imgur.com/PnSxBaO.png",
      hp: 216,
      atk: 100,
      def: 121,
      spatk: 91,
      spdef: 95,
      speed: 85
    },
  {     
      name: "dusk-mane-necrozma",
      type: "Psychic | Steel",
      url: "https://imgur.com/tsiB5VW.png",
      hp: 97,
      atk: 157,
      def: 127,
      spatk: 133,
      spdef: 109,
      speed: 77
    },
  {     
      name: "dawn-wings-necrozma",
      type: "Psychic | Ghost",
      url: "https://imgur.com/uCaVa6Z.png",
      hp: 97,
      atk: 133,
      def: 109,
      spatk: 157,
      spdef: 127,
      speed: 77
    },
  {     
      name: "ultra-necrozma",
      type: "Psychic | Steel",
      url: "https://imgur.com/7QjygwM.png",
      hp: 97,
      atk: 167,
      def: 97,
      spatk: 167,
      spdef: 97,
      speed: 129
    },
  {     
      name: "crowned-sword-zacian",
      type: "Fairy | Steel",
      url: "https://imgur.com/8OgG6gm.png",
      hp: 92,
      atk: 170,
      def: 115,
      spatk: 80,
      spdef: 115,
      speed: 148
    },
  {     
      name: "crowned-shield-zamazenta",
      type: "Fighting | Steel",
      url: "https://imgur.com/wk9wDPz.png",
      hp: 92,
      atk: 130,
      def: 145,
      spatk: 80,
      spdef: 145,
      speed: 128
    },
  {     
      name: "rapid-strike-urshifu",
      type: "Fighting | Water",
      url: "https://imgur.com/U4mPb41.png",
      hp: 100,
      atk: 130,
      def: 100,
      spatk: 63,
      spdef: 60,
      speed: 97
    }, 
  {
      name: "deoxys-attack-form",
      type: "Psychic",
      url: "https://imgur.com/bO6ysYZ.png",
      hp: 50,
      atk: 180,
      def: 20,
      spatk: 180,
      spdef: 20,
      speed: 150
    },
  {
      name: "deoxys-defense-form",
      type: "Psychic",
      url: "https://imgur.com/gyYlhVU.png",
      hp: 50,
      atk: 70,
      def :160,
      spatk: 70,
      spdef: 160,
      speed: 90
    },
  {
      name: "deoxys-speed-form",
      type: "Psychic",
      url: "https://imgur.com/TjQ8hEa.png",
      hp: 50,
      atk: 95,
      def: 90,
      spatk: 95,
      spdef: 90,
      speed: 180
    },

  ]
module.exports = forms;
