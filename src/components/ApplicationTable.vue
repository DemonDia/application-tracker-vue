<template>
  <div v-if="this.applications.length > 0">
    <el-row :gutter="20">
      <el-col :span="12">
        <span>Search:</span>
        <el-input
          placeholder="Type here to search..."
          v-model="searchEntry"
          style="width: 100%"
      /></el-col>
      <el-col :span="12">
        <el-button type="primary" @click="exportApplicationList"
          >Export</el-button
        ></el-col
      >
    </el-row>

    <!-- <el-button type="primary" @click="exportApplicationList">Export</el-button> -->
    <table class="table">
      <thead>
        <tr>
          <th>Company Name</th>
          <th>Role Name</th>
          <th>Role Type</th>
          <th>Application Date</th>
          <th>Last Updated</th>
          <th>Outcome</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody v-if="this.filteredApplications.length > 0">
        <ApplicationRow
          :application="application"
          v-for="application in this.filteredApplications"
          :key="application"
        />
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="7">No matches found</td>
        </tr>
      </tbody>
    </table>
  </div>
  <h2 v-else>No applications, why not apply?</h2>
</template>
<script>
import ApplicationRow from "../components/ApplicationRow.vue";
import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";
import * as cpexcel from "xlsx/dist/cpexcel.full.mjs";
import { Readable } from "stream";

export default {
  name: "ApplicationTable",
  data() {
    return {
      exportApplications: [],
      searchEntry: "",
    };
  },
  props: ["applications", "user_id"],
  components: { ApplicationRow },
  methods: {
    // export
    exportApplicationList: function () {
      // remove user id and application id
      this.exportApplications = this.applications.map((application) => {
        delete application.id;
        delete application.user_id;
        console.log(application);
        application = JSON.parse(
          JSON.stringify(application, [
            "company_name",
            "role_name",
            "role_type",
            "outcome",
            "applied_date",
            "last_updated",
          ])
        );
        return application;
      });

      // setup exporter
      XLSX.set_fs(fs);
      XLSX.stream.set_readable(Readable);
      XLSX.set_cptable(cpexcel);

      // export to pdf
      var workbook = XLSX.utils.book_new();
      var worksheet = XLSX.utils.json_to_sheet(this.exportApplications);
      XLSX.utils.book_append_sheet(workbook, worksheet, this.user_id);
      XLSX.writeFile(workbook, this.user_id + ".xlsx");
    },
  },
  computed: {
    filteredApplications: function () {
      return this.applications.filter(
        (application) =>
          application.role_type
            .toLowerCase()
            .includes(this.searchEntry.toLowerCase()) ||
          application.role_name
            .toLowerCase()
            .includes(this.searchEntry.toLowerCase()) ||
          application.outcome
            .toLowerCase()
            .includes(this.searchEntry.toLowerCase()) ||
          application.company_name
            .toLowerCase()
            .includes(this.searchEntry.toLowerCase())
      );
    },
  },
};
</script>
<style scoped>
.el-button {
  margin: 5px;
}
table{
  margin:10px auto;
}
</style>
