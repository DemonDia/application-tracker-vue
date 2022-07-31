<template>
  <el-card
    v-if="mode == 'login'"
    class="box-card"
    style="width: 250px; margin: 10px auto"
  >
    <template #header>
      <div class="card-header">
        <h3>Login</h3>
      </div>
    </template>
    <div class="text item">
      <span>Email:</span>
      <el-input v-model="email" type="email" placeholder="Enter your email" />
      <br />
      <span>Password:</span>
      <el-input
        v-model="password"
        type="password"
        placeholder="Enter your password"
      />
      <br />
      <el-button @click="loginExistingUser" type="primary">Login</el-button>
    </div>
    <div>
      Don't have an account? Sign up
      <a @click="toggleLoginAndRegister">here</a>
    </div>
  </el-card>
  <el-card v-else class="box-card" style="width: 250px; margin: 10px auto">
    <template #header>
      <div class="card-header">
        <h3>Register</h3>
      </div>
    </template>
    <div class="text item">
      <span>Name:</span>
      <el-input v-model="name" placeholder="Enter your name" />
      <br />
      <span>Email:</span>
      <el-input v-model="email" type="email" placeholder="Enter your email" />
      <br />
      <span>Password:</span>
      <el-input
        v-model="password"
        type="password"
        placeholder="Enter your password"
      />
      <br />
      <span>Confirm Password:</span>
      <el-input
        v-model="confirmPassword"
        type="password"
        placeholder="Re-enter your password"
      />
      <br />
      <el-button @click="registerNewUser" type="primary">Register</el-button>
    </div>
    <div>
      <label
        >Already have an account? Login
        <a @click="toggleLoginAndRegister">here</a></label
      >
    </div>
  </el-card>

  <el-alert
    title="Login failed"
    v-if="this.haveError == true && mode == 'login'"
    type="error alert"
  />
  <el-alert
    title="Registration failed"
    v-if="this.haveError == true && mode == 'register'"
    type="error alert"
  />

  <el-alert
    title="Successfully logged in"
    v-if="this.success == true && mode == 'login'"
    type="success alert"
  />
  <el-alert
    title="Successfully registered"
    v-if="this.success == true && mode == 'register'"
    type="success alert"
  />
</template>
<script>
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
export default {
  name: "Authenticate",
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      mode: "login",
      errorMessages: [],
      haveError: false,
      success: false,
    };
  },
  methods: {
    // =========================login=========================
    loginExistingUser: function () {
      this.loginHelper();
    },

    // =========================register=========================
    registerNewUser: function () {
      var emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
      if (this.name.length == 0) {
        this.errorMessages.push("Name cannot be empty");
      }
      if (!emailPattern.test(this.email)) {
        this.errorMessages.push("Invalid email address");
      }
      if (this.password.length < 8) {
        this.errorMessages.push("Password must be at least 8 characters long");
      } else if (this.password !== this.confirmPassword) {
        this.errorMessages.push("Passwords do not match");
      }

      if (this.errorMessages.length > 0) {
        this.errorMessages = [];
        this.success = false;
        this.haveError = true;
      } else {
        // create new user
        this.registerHelper();
      }
    },

    // =========================helper=========================
    // register helper
    registerHelper: function () {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then(async () => {
          // Signed in
          this.updateUserProfile();
          this.success = true;
          this.haveError = false;
          window.location.href = "/";
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          this.success = false;
          this.haveError = true;
          console.log(errorCode);
          console.log(errorMessage);
          // ..
        });
    },

    // login helper
    loginHelper: function () {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          // Signed in
          this.success = true;
          this.haveError = false;
          window.location.href = "/home";
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          this.success = false;
          this.haveError = true;
        });
    },

    // update profile
    updateUserProfile: function () {
      const auth = getAuth();
      updateProfile(auth.currentUser, {
        displayName: this.name,
      })
        .then(() => {
          //   console.log(auth.currentUser.displayName);
          // Profile updated!
          // ...
        })
        .catch((error) => {
          // An error occurred
          console.log(error);
          // ...
        });
    },

    // clear
    clearInputs: function () {
      this.name = "";
      this.email = "";
      this.password = "";
      this.confirmPassword = "";
      this.success = false;
      this.haveError = false;
    },

    // toggle
    toggleLoginAndRegister: function () {
      if (this.mode == "login") {
        this.mode = "register";
      } else {
        this.mode = "login";
      }
      this.clearInputs();
    },

    // check if logged in
    // check if logged in
    checkIfLoggedIn: function () {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user != null) {
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
<style scoped>
span {
  display: flex;
  margin: 5px;
}
h3 {
  margin: 5px;
}
.el-input {
  margin: 5px;
}
</style>
