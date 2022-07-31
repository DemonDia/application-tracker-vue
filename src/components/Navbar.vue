<template>
  <el-menu class="el-menu-demo" mode="horizontal">
    <el-menu-item index="1" v-if="this.logged" @click="logoutUser"
      >Logout</el-menu-item
    >
    <el-menu-item index="1" v-else>Login</el-menu-item>
  </el-menu>
</template>
<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
export default {
  name: "Navbar",
  data() {
    return {
      logged: false,
    };
  },
  methods: {
    // check if logged in
    checkIfLoggedIn: function () {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        this.logged = user != null;
      });
    },

    // logout user
    logoutUser: function () {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          window.location.href = "/auth";
        })
        .catch((error) => {
          console.log(error);
          // An error happened.
        });
    },
  },
  beforeMount() {
    this.checkIfLoggedIn();
  },
};
</script>
