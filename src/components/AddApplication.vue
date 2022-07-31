<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <span>Company name:</span>
        <el-input
          v-model="this.company_name"
          placeholder="Set a company name"
        />
      </el-col>
      <el-col :span="12">
        <span>Role name:</span>
        <el-input v-model="this.role_name" placeholder="Set a role name" />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <span>Application Date:</span>
        <el-date-picker
          v-model="this.application_date"
          :disabled-date="disabledDate"
          :shortcuts="shortcuts"
          placeholder="Set application date"
          type="date"
          style="width: 100%"
      /></el-col>
      <el-col :span="12">
        <span>Type:</span>

        <el-select v-model="this.role_type">
          <el-option value="">Select a value</el-option>
          <el-option value="part-time">Part-Time</el-option>
          <el-option value="full-time">Full-Time</el-option>
          <el-option value="intern">Internship</el-option>
        </el-select></el-col
      >
    </el-row>
    <el-row :gutter="20">
      <el-button @click="addApplication" type="primary"
        >Submit</el-button
      ></el-row
    >
  </div>
  <el-alert
    title="Fail to add application"
    v-if="this.haveError == true"
    type="error alert"
  />
    <el-alert
    title="Application successfully added"
    v-if="this.success == true"
    type="success alert"
  />
</template>
<script>
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default {
  name: "AddApplication",
  data() {
    return {
      company_name: "",
      role_name: "",
      role_type: "",
      user: null,
      application: null, //a json object
      application_date: null,
      errors: [],
      haveError: false,
      success: false,
    };
  },
  props: ["user_id"],
  methods: {
    // ===============onclick add function===============
    addApplication: async function () {
      if (this.company_name.length == 0) {
        this.errors.push("Company name cannot be empty");
      }
      if (this.role_name.length == 0) {
        this.errors.push("Role name cannot be empty");
      }
      if (this.role_type.length == 0) {
        this.errors.push("Please select a role type");
      }
      if (this.application_date == null) {
        this.errors.push("Please add an application date");
      }
      console.log(this.errors.length);
      if (this.errors.length == 0) {
        var formattedAppliedDate = this.application_date.toLocaleString();
        var formattedLastUpdated = new Date().toLocaleString();
        this.application = {
          user_id: this.user_id,
          company_name: this.company_name,
          role_name: this.role_name,
          role_type: this.role_type,
          applied_date: formattedAppliedDate,
          last_updated: formattedLastUpdated,
          outcome: "processing",
        };
        // call the application function (add in database)
        await this.addApplicationToDb();
        this.haveError = false;
        this.success = true;
        this.errors = [];
      } else {
        this.haveError = true;
        this.success = false;
      }
    },
    // ===============helper===============
    clear: function () {
      this.company_name = "";
      this.role_name = "";
      this.role_type = "";
      this.application = null;
      this.application_date = null;
      this.errors = [];
    },

    addApplicationToDb: async function () {
      await await addDoc(collection(db, "applications"), this.application);
      alert("Added!");
      this.clear();
    },
  },
};
</script>
<style>
.el-select {
  width: 100%;
}
.el-button {
  margin: auto;
}
.el-row {
  padding: 5px;
}
span {
  display: flex;
  text-align: left;
}
</style>
