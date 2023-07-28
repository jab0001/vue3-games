<template>
  <main class="form-signin">
    <form @submit.prevent="submit">
      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

      <div class="form-floating">
        <input
          type="text"
          class="form-control"
          name="login"
          placeholder="name@example.com"
        />
        <label>Email</label>
      </div>

      <div class="form-floating">
        <input
          type="password"
          class="form-control"
          name="password"
          placeholder="Password"
        />
        <label>Password</label>
      </div>

      <button class="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
    </form>
  </main>
</template>

<script>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
import { computed } from "vue";

export default {
  name: "Login",
  setup() {
    const router = useRouter();
    const store = useStore();

    const token = computed(() => {
      return store.state.token;
    });

    const submit = async (e) => {
      const form = new FormData(e.target);

      const inputs = Object.fromEntries(form.entries());

      await store.dispatch("login", inputs);

      console.log("TOKEN", token.value);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;

      await router.push("/");
    };

    return {
      submit,
      token,
    };
  },
};
</script>
