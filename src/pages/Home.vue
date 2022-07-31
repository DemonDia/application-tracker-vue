<template>
  <div v-if="this.currentUser != null">
    <h1>Welcome, {{ this.currentUser.displayName }}</h1>
    <AddApplication :user_id="this.currentUser.uid" />
    <ApplicationTable :applications="applications" :user="this.currentUser" />
  </div>
</template>
<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import ApplicationTable from "../components/ApplicationTable.vue";
import AddApplication from "../components/AddApplication.vue";
import { db } from "../firebase";
export default {
  name: "Home",
  components: {
    ApplicationTable,
    AddApplication,
  },
  methods: {
    // =========================helpers=========================
    // get current user
    getCurrentUser: function () {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user == null) {
          window.location.href = "/auth";
        } else {
          this.currentUser = user;
        }
      });
    },
    getApplicationRealTimeUpadtes: async function () {
      onSnapshot(collection(db, "applications"), (res) => {
        const applicationData = [];
        res.forEach((doc) => {
          var tempData = { ...doc.data(), id: doc.id };
          applicationData.push(tempData);
        });
        this.applications = applicationData.filter(
          (application) => application.user_id == this.currentUser.uid
        );
      });
    },

    // get all applications based on user
  },
  onMounted() {
    this.getApplicationRealTimeUpadtes();

  },

  beforeMount() {
    // =========================if not logged in, redirect to authenticate page=========================
    this.getCurrentUser();
    this.getApplicationRealTimeUpadtes();

    // add realtime update for database
  },
  data() {
    return {
      applications: [],
      currentUser: null,
    };
  },
};
</script>
