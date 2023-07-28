<template>
  <div class="container mt-5 text-center">
    <div class="main">
      <div class="main__sidebar">
        <h3 class="main__title">Balance:</h3>
        <ul class="main__list main__list-balances">
          <li
            class="main__item"
            v-for="(balance, index) in balances"
            :key="balance.id"
          >
            <h4 class="main__item-title">{{ balanceTitles[index] }}</h4>
            <p class="main__item-count">{{ balance.attributes.available }}</p>
          </li>
        </ul>
      </div>
      <div class="main__content">
        <h3 class="main__title">Games:</h3>
        <ul class="main__list main__list-games">
          <li
            class="main__item-game"
            v-for="(game, index) in games"
            :key="index"
          >
            <img
              :src="game.attributes.image"
              width="250"
              height="200"
              alt="Game Image"
            />
            <h4>{{ game.attributes.title }}</h4>
            <button @click="playDemo(game.id)">Play Demo</button>
          </li>
        </ul>
      </div>
    </div>

    <a href="javascript:void(0)" class="btn btn-lg btn-primary" @click="logout"
      >Logout</a
    >
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
/* import axios from "axios"; */
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  name: "Home",
  setup() {
    const router = useRouter();
    const store = useStore();
    const balances = ref([]);
    const games = ref([]);
    const balanceTitles = ["Total balance", "Real balance", "Bonus balance"];

    const fetchBalance = async () => {
      try {
        const response = await store.dispatch("fetchBalance");
        balances.value = response.data;
      } catch (error) {
        console.log(error);
      }
    };

    const fetchGames = async () => {
      try {
        const response = await store.dispatch("fetchGames");
        games.value = response.data;
      } catch (error) {
        console.log(error);
      }
    };

    const playDemo = async (gameId) => {
      try {
        const response = await store.dispatch("playDemo", gameId);
        const gameUrl =
          response.data[0].attributes["launch-options"]["game-url"];
        window.open(gameUrl, "_blank");
      } catch (error) {
        console.log(error);
      }
    };

    onMounted(async () => {
      try {
        fetchBalance();
        fetchGames();

        setInterval(fetchBalance, 30000);
      } catch (e) {
        await router.push("/login");
      }
    });

    const logout = async () => {
      if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
      }
      await router.push("/login");
    };

    return {
      balances,
      games,
      balanceTitles,
      playDemo,
      logout,
    };
  },
};
</script>

<style scoped>
.main {
  display: flex;
}

.main__sidebar {
  min-width: 20%;
  max-height: 80vh;
  border: 1px solid grey;
  border-radius: 26px;
}

.main__content {
  flex-grow: 1;
}

.main__title {
  text-align: center;
}

.main__item-game {
  border: 1px solid grey;
  border-radius: 25px;
  padding: 10px;
  width: 31%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

img {
  width: 100%;
  height: auto;
}

.main__list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: center;
}
.main__list-games {
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px 0;
}
</style>
