export const admin_subject = {
  template: `
    <div class="container">
    <br>
    <center><h1>All Subjects</h1></center>
    <button v-on:click="create_subject" class="btn btn-primary">Create Subject</button>
    <br>
    <br>
    <div v-bind:class="cls1">
      <label for="Subject_Name">Name</label>
      <input type=text v-model="sub_name" name="Subject_Name">
      <label for="Subject_Desc">Description</label>
      <input type=text v-model="sub_desc" name="Subject_Desc">
      <button v-on:click="submit_data" class="btn btn-primary">Submit</button>
      <button v-on:click="create_subject" class="btn btn-secondary">Close</button>
     </div>
     <br>
     <br>
     <div class=row>
     <div class="col-md-4" v-for="subject in data1">
     <br>
     <br>
     <div class="card" style="width: 18rem;">
     <div class="card-body">
       <h5 class="card-title">{{subject['subject_name']}}</h5>
       <p class="card-text">{{subject['subject_description']}}</p>
       <br>
       <button v-on:click="nav_chapt(subject['id'])" class='btn btn-primary'>Chapters</button>
       <button v-on:click="subject_update" class='btn btn-secondary'>Update</button>
       <br><br>
       <button v-on:click="delete_data(subject['id'])" class='btn btn-danger'>Delete</button>
       <br>
       <div v-bind:class="cls2">
       <br>
       <label  for="update_subject_name">Update Name</label>
       <input type="text" v-model="subject['subject_name']" name="update_subject_name" >
       <label for="update_subject_description">Update Description</label>
       <input type="text" v-model="subject['subject_description']" name="update_subject_description">
       <br><br>
       <button v-on:click="update_data(subject['id'],subject['subject_name'],subject['subject_description'] )" class='btn btn-primary'>Update</button>
       <button class='btn btn-danger' v-on:click="subject_update">Close</button>
       </div>
     </div>
     </div>
     </div>
     </div>
     <br>
     </div>
    `,
  async beforeMount() {
    const url = "http://127.0.0.1:5000/subjects"; // Replace with the actual URL
    const jwtToken = localStorage.getItem("ac_token")

    try {
      // 1. Await the response from the fetch call
      const response = await fetch(url,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${jwtToken}` // Add if your API requires authentication
          },
        }
      );

      // 2. Check if the response was successful (HTTP status 200-299)
      if (!response.ok) {
        // If not successful, throw an error to be caught by the catch block
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // 3. Await the parsing of the response body (e.g., as JSON)
      const data = await response.json(); // Or .text(), .blob(), etc.
      this.data1 = data;
      // 4. Work with the fetched data
      this.data = data;
    } catch (error) {
      // 5. Handle any errors that occurred during the fetch or processing
      console.error("Error fetching data:", error);
      // You might want to display an error message to the user here
      // or re-throw the error if it needs to be handled higher up.
    }
  },
  data() {
    return {
      data1: {},
      cls1: "invisible",
      cls2: "d-none",
      sub_name: "",
      sub_desc: "",
      sub_data: [],
      sub_data_upd: [],
    };
  },
  methods: {
    create_subject() {
      if (this.cls1 === "invisible") {
        this.cls1 = "visible";
      } else {
        this.cls1 = "invisible";
      }
    },
    async submit_data() {
      if (this.sub_name !== "" && this.sub_desc !== "") {
        this.sub_data.push(this.sub_name);
        this.sub_data.push(this.sub_desc);
        console.log(this.sub_data);
        this.sub_name = "";
        this.sub_desc = "";
      }
      const url = "http://127.0.0.1:5000/subj"; // Replace with your actual API endpoint
      const dataToSend = {
        subject_name: this.sub_data[0],
        subject_description: this.sub_data[1],
      };

      try {
        const jwtToken = localStorage.getItem("ac_token")
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${jwtToken}` // Add if your API requires authentication
          },
          body: JSON.stringify(dataToSend), // body data type must match "Content-Type" header
        });

        if (!response.ok) {
          // Check if the request was successful (status code 2xx)
          // If the response status is not OK (e.g., 400, 500), throw an error
          this.sub_data = [];
          const errorData = await response.json(); // Or response.text() if not JSON
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${
              errorData.message || response.statusText
            }`
          );
        }

        const result = await response.json(); // Assuming the server responds with JSON
        this.sub_data = [];
        console.log("Success:", result);
        // You can now update your UI or state with the 'result'
      } catch (error) {
        console.error("Error during POST request:", error);
        // Handle network errors, parsing errors, or API-specific errors
      }
    },
    subject_update() {
      if (this.cls2 === "d-none") {
        this.cls2 = "visible";
      } else {
        this.cls2 = "d-none";
      }
    },
    async update_data(upd_id, upd_name, upd_description) {
      this.subject_update();
      if (upd_id !== "" && upd_name !== "" && upd_description !== "") {
        this.sub_data_upd.push(upd_id);
        this.sub_data_upd.push(upd_name);
        this.sub_data_upd.push(upd_description);
        console.log(this.sub_data_upd);
        upd_id = "";
        upd_name = "";
        upd_description = "";
      }
      const url = `http://127.0.0.1:5000/subj/${this.sub_data_upd[0]}`; // Replace with your actual API endpoint
      console.log(url);
      const dataUpdate = {
        subject_name: this.sub_data_upd[1],
        subject_description: this.sub_data_upd[2],
      };

      try {
        const jwtToken = localStorage.getItem("ac_token");
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${jwtToken}` // Add if your API requires authentication
          },
          body: JSON.stringify(dataUpdate), // body data type must match "Content-Type" header
        });

        if (!response.ok) {
          // Check if the request was successful (status code 2xx)
          // If the response status is not OK (e.g., 400, 500), throw an error
          this.sub_data_upd = [];
          const errorData = await response.json(); // Or response.text() if not JSON
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${
              errorData.message || response.statusText
            }`
          );
        }

        const result = await response.json(); // Assuming the server responds with JSON
        this.sub_data_upd = [];
        console.log("Success:", result);
        // You can now update your UI or state with the 'result'
      } catch (error) {
        console.error("Error during POST request:", error);
        // Handle network errors, parsing errors, or API-specific errors
      }
    },
    async delete_data(delete_id) {
      const apiUrl = `http://127.0.0.1:5000/subj/${delete_id}`;
      const jwtToken = localStorage.getItem("ac_token")
      try {
        // 1. Await the fetch call. The function pauses here until the network request completes.
        const response = await fetch(apiUrl, {
          method: "DELETE", // Specify the HTTP method
          headers: {
            "Content-Type": "application/json", // Good practice, though often not strictly necessary for DELETE
            // Add authorization header if required by your API
            'Authorization': `Bearer ${jwtToken}`,
          },
          // DELETE requests typically do not have a body
        });

        // 2. Check if the HTTP response status is OK (2xx range).
        // If not OK, the fetch promise itself does NOT reject, so we must check manually.
        if (!response.ok) {
          let errorDetails = `HTTP Error! Status: ${response.status}`;
          try {
            // Attempt to parse a JSON error response from the server
            const errorData = await response.json();
            errorDetails = errorData.message || JSON.stringify(errorData); // Use message or full data
          } catch (jsonError) {
            // If the response is not JSON, use the status text
            errorDetails = response.statusText || errorDetails;
          }
          // Throw an error to be caught by the 'catch' block below
          throw new Error(`Failed to delete user ${userId}: ${errorDetails}`);
        }

        // 3. Handle successful responses
        // Common for DELETE to return 204 No Content, meaning no body to parse.
        if (response.status === 204) {
          console.log(`User ${userId} deleted successfully (No Content).`);
          return {
            success: true,
            message: `User ${userId} deleted successfully.`,
          };
        } else {
          // If the server returns 200 OK with a body (e.g., a confirmation object)
          const data = await response.json(); // Await parsing the JSON body
          console.log(
            `User ${userId} deleted successfully with response:`,
            data
          );
          return {
            success: true,
            message: `User ${userId} deleted successfully.`,
            data: data,
          };
        }
      } catch (error) {
        // 4. Catch any errors that occurred during the fetch or in the 'try' block
        // This includes network errors, the error we explicitly threw for non-2xx responses,
        // or issues with response.json() parsing if not handled by response.ok check.
        console.error(`Error deleting user ${userId}:`, error.message);
        return {
          success: false,
          message: `An error occurred: ${error.message}`,
        };
      } finally {
        // 5. The 'finally' block executes regardless of success or failure.
        // Useful for cleanup like hiding loading spinners.
        console.log(`Deletion attempt for user ${userId} completed.`);
      }
    },
    nav_chapt(sub_id) {
      this.$router.push(`/adm_chapt/${sub_id}/chapters`);
    },
  },
};
