<template>
  <div class="h-screen cont">
    <UserDropdown />
    <div class="m-auto transform translate-y-20">
      <img class="object-contain h-48 w-full" src="../assets/images/logo.png" />
      <div id="gameContainer" class="m-auto rounded-lg flex mt-10">
        <div
          id="carouselContainer"
          class="ml-3 bg-gray-300 text-red-800 inline-block"
        >
          <splide :options="options" @splide:moved="moved" :slides="slides">
            <splide-slide v-for="slide in slides" :key="slide.src">
              <img
                id="slideImg"
                :src="slide.src"
                alt="slide.alt"
                height="500"
                width="500"
                style="width: 100%; height: 480px;"
              />
            </splide-slide>
          </splide>
        </div>
        <div
          id="gameInfoContainer"
          class="inline-block m-auto w/-64 h-64 flex-column"
        >
          <div>
            <div
              id="owner"
              class="m-auto mb-4 tex-center text-red-800 font-bold font-Nunito text-lg"
            >
              {{ partner[0] }}
            </div>
            <div class="flex mt-3 mb-3">
              <label
                for="Todos"
                class="ml-auto mr-2 flex justify-start items-start"
              >
                <div
                  class="bg-white border-2 rounded border-gray-900 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 mb-2"
                >
                  <input
                    checked="true"
                    disabled="true"
                    type="checkbox"
                    id="checkbutton1"
                    class="opacity-0 absolute"
                    @click="gamesCheck"
                  />
                  <svg
                    class="fill-current hidden w-4 h-4 text-red-800 pointer-events-none"
                    viewBox="0 0 20 20"
                  >
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                </div>
                <div class="select-none">Juegos propios</div>
              </label>
              <label
                for="Todos"
                class="mr-auto ml-2 flex justify-start items-start"
              >
                <div
                  class="bg-white border-2 rounded border-gray-900 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 mb-2"
                >
                  <input
                    type="checkbox"
                    id="checkbutton2"
                    class="opacity-0 absolute"
                    @click="borrowedGamesCheck"
                  />
                  <svg
                    class="fill-current hidden w-4 h-4 text-red-800 pointer-events-none"
                    viewBox="0 0 20 20"
                  >
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                </div>
                <div class="select-none">Juegos ajenos</div>
              </label>
            </div>
            <a id="gameInfo" class="text-center block text-red-800 font-bold"
              >Juego
              {{ !borrowed ? "" : "prestado" }}
              :
              <span class="text-black font-semibold">{{
                currentGames[gameIndex] ? currentGames[gameIndex].game_name : ""
              }}</span></a
            >
            <a id="gameInfo" class="text-center block text-red-800 font-bold"
              >Rating:
              <span>{{ this.getRatingGames() }}</span>
            </a>
            <a
              v-if="borrowed"
              id="gameInfo"
              class="text-center block text-red-800 font-bold"
              >Fecha de préstamo:
              <span class="text-black font-semibold">{{
                currentGames[gameIndex].borrowDate
              }}</span></a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UserDropdown from "../components/userDropdown/UserDropdown";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import { getGames } from "../domain/services/gamesServices";
import { getPartners } from "../domain/services/partnersServices";
import { getBorrowedGames } from "../domain/services/borrowedGamesServices";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
export default {
  name: "Partner",
  components: {
    UserDropdown,
    Splide,
    SplideSlide
  },
  data() {
    return {
      borrowed: false,
      currentGames: [],
      allGames: [],
      allBorrowedGames: [],
      games: [],
      borrowedGames: [],
      borrowedGamesIds: [],
      gameIndex: "0",
      partners: [],
      partner: [],
      options: {
        rewind: true,
        gap: "1rem",
        heightRatio: 1
      },
      slides: [],
      rating: 0
    };
  },
  props: ["value"],
  methods: {
    moved(splide, newIndex) {
      this.gameIndex = newIndex;
      console.log(this.gameIndex);
      this.getBorrowedGamesId();
    },
    getRatingGames() {
      let stars = "";
      if (this.currentGames[this.gameIndex] != undefined) {
        for (
          let index = 0;
          index < Math.floor(this.currentGames[this.gameIndex].rating) / 2;
          index++
        ) {
          stars = stars + "⭐";
        }
      }
      return stars;
    },
    gamesCheck() {
      document.getElementById("checkbutton1").disabled = true;
      document.getElementById("checkbutton2").disabled = false;
      document.getElementById("checkbutton2").checked = false;
      this.$emit("input", 1);
      this.currentGames = this.games;
      this.borrowed = false;
      this.gameSlides(false);
    },
    borrowedGamesCheck() {
      document.getElementById("checkbutton2").disabled = true;
      document.getElementById("checkbutton1").disabled = false;
      document.getElementById("checkbutton1").checked = false;
      this.$emit("input", 2);
      this.currentGames = this.borrowedGames;
      this.borrowed = true;
      this.gameSlides(true);
    },
    getOwnGames: function() {
      const id = parseInt(this.$route.query.id);
      this.games = this.allGames
        .filter(game => id === game.id_owner)
        .map(game => game);
    },
    gameSlides: function(borrowed) {
      const id = parseInt(this.$route.query.id);
      const games = borrowed
        ? this.currentGames
        : this.currentGames.filter(game => id === game.id_owner);
      const gameImages = games.map(game => game.game_image);
      this.slides = gameImages.map((url, index) => {
        return {
          src: `${url}?sig=${index}`,
          alt: `Image ${index}`
        };
      });
    },
    partnerName: function() {
      const id = parseInt(this.$route.query.id);
      this.partner = this.partners
        .filter(partner => id === partner.id)
        .map(partner => partner.partner_name);
    },
    getBorrowedGamesId: function() {
      const id = parseInt(this.$route.query.id);
      this.borrowedGamesIds = this.allBorrowedGames
        .filter(borrowedGame => id === borrowedGame.id_borrower)
        .map(borrowedGame => borrowedGame.id_game);
    },
    getMyBorrowedGames: function() {
      this.borrowedGames = this.borrowedGamesIds
        .map(borrowedGameId => {
          return this.allGames.find(game => game.id === borrowedGameId);
        })
        .map(game => {
          const borrowDate = this.allBorrowedGames.find(
            borrowGame => borrowGame.id_game === game.id
          ).borrow_date;
          return { ...game, borrowDate };
        });
    }
  },
  computed: {},
  beforeMount: function() {
    getGames().then(res => {
      if (res.status === 200) {
        this.allGames = res.data;
        this.getOwnGames();
        this.currentGames = this.games;
        this.gameSlides(false);
        getBorrowedGames().then(res => {
          if (res.status === 200) {
            this.allBorrowedGames = res.data;
            this.getBorrowedGamesId();
            this.getMyBorrowedGames();
          }
        });
        getPartners().then(res => {
          if (res.status === 200) {
            this.partners = res.data;
            this.partnerName();
          }
        });
      }
    });
  }
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap");
.cont {
  background-image: url("../assets/images/wave.svg");
  background-repeat: no-repeat;
  background-position: top;
}
#gameContainer {
  width: 900px;
  height: 665px;
}
#carouselContainer {
  width: 500px;
  height: 500px;
  box-shadow: 3px 3px 10px #000;
  border: 11px outset #a42417;
  border-radius: 23px;
}
input:checked + svg {
  display: block;
}
#partnerName {
  transform: translateY(20px);
}
#owner {
  justify-content: center;
  text-align: center;
}
#game {
  transform: translateX(40px);
}
a {
  margin-top: 3%;
}
</style>
