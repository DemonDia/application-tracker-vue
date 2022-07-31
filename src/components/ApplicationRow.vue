<template>
  <tr>
    <td v-if="this.isEditing == false">{{ application.company_name }}</td>
    <td v-else>
      <el-input placeholder="New company name" v-model="this.companyName" />
    </td>

    <td v-if="this.isEditing == false">{{ application.role_name }}</td>
    <td v-else>
      <el-input placeholder="New role name" v-model="this.roleName" />
    </td>

    <td v-if="this.isEditing == false">{{ application.role_type }}</td>
    <td v-else>
      <el-select v-model="this.roleType">
        <el-option value="">Select a value</el-option>
        <el-option value="part-time">Part-Time</el-option>
        <el-option value="full-time">Full-Time</el-option>
        <el-option value="intern">Internship</el-option>
      </el-select>
    </td>
    <td>{{ application.applied_date }}</td>
    <td>{{ application.last_updated }}</td>
    <td v-if="this.isEditing == false">{{ application.outcome }}</td>
    <td v-else>
      <el-select v-model="this.outcome">
        <el-option value="">Select a value</el-option>
        <el-option value="processing">Processing</el-option>
        <el-option value="interview">Interview</el-option>
        <el-option value="accepted">Accepted</el-option>
        <el-option value="rejected">Rejected</el-option>
      </el-select>
    </td>

    <td v-if="isEditing == false">
      <el-button type="primary" @click="toggleEdit">Edit</el-button>
      <el-button type="danger" @click="deleteApplication">Delete</el-button>
    </td>
    <td v-if="isEditing == true">
      <el-button type="primary" @click="saveApplicationChanges">Save</el-button>
      <el-button type="secondary" @click="cancelEditing">Cancel</el-button>
    </td>
  </tr>
</template>
<script>
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
export default {
  name: "ApplicationRow",
  props: ["application"],
  data() {
    return {
      isEditing: false,
      companyName: this.application.company_name,
      roleName: this.application.role_name,
      roleType: this.application.role_type,
      outcome: this.application.outcome,
      updatedApplication: null,
      errors: [],
    };
  },
  methods: {
    // edit
    saveApplicationChanges: async function () {
      if (this.companyName.length == 0) {
        this.errors.push("Company name cannot be empty");
      }
      if (this.roleName.length == 0) {
        this.errors.push("Role name cannot be empty");
      }
      if (this.roleType.length == 0) {
        this.errors.push("Please select a role type");
      }
      if (this.errors.length > 0) {
        console.log("errors")
      } else {
        var formattedUpdatedDate = new Date().toLocaleString();
        this.updatedApplication = {
          user_id: this.application.user_id,
          company_name: this.companyName,
          role_name: this.roleName,
          role_type: this.roleType,
          applied_date: this.application.applied_date,
          last_updated: formattedUpdatedDate,
          outcome: this.outcome,
        };
        await this.updateHelper();
        this.resetEditInputs();
        // call the update helper function
      }
    },
    // delete
    deleteApplication: async function () {
      await deleteDoc(doc(db, "applications", this.application.id));
    },

    // =========================helper function=========================
    // cancel editing
    cancelEditing: function () {
      this.toggleEdit();
      this.resetEditInputs();
    },
    // update
    updateHelper: async function () {
      await setDoc(
        doc(db, "applications", this.application.id),
        this.updatedApplication
      );
    },

    // reset inputs
    resetEditInputs: function () {
      this.companyName = this.application.company_name;
      this.roleName = this.application.role_name;
      this.roleType = this.application.role_type;
      this.outcome = this.application.outcome;
    },

    // toggling edit
    toggleEdit: function () {
      //   console.log(this.application);
      this.isEditing = !this.isEditing;
    },
  },
};
</script>
