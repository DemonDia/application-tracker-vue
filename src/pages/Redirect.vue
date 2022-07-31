<template>
  <h3>Redirecting ...</h3>
</template>
<script>
// import { getAuth } from "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: "Redirect",
  methods: {
    // check if logged in
    checkIfLoggedIn: function () {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user == null) {
          window.location.href = "/auth";
        } else {
          window.location.href = "/home";
        }
      });
    },
  },
  beforeMount() {
    this.checkIfLoggedIn();
  },
};
</script>
