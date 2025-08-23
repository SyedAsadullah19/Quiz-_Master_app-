export const admin_chapters = {
  template: `
    <div>
    <button v-on:click="cr_chpt" class="btn btn-primary">Create Chapters</button>
    <button v-on:click="back_subject" class="btn btn-dark">Back to Subjects</button>
    <br>
    <div v-bind:class="cls1">
    <label>Chapter Name</label>
    <input type="text" class="form-control" name="chapter_name" v-model="chapter_name">
    <label>Chapter Description</label>
    <input type="text" class="form-control" name="chapter_desc" v-model="chapter_desc" >
    <br>
    <button v-on:click="add_chapter" class="btn btn-success">Add Chapter</button>
    <button v-on:click="cr_chpt" class="btn btn-danger">Close</button>
    </div>

    <br>
    <br>
    <div class="row">
    <div v-for="chapter in data1" class="col-md-4">
    <div class="card" style="width: 18rem;">
     <div class="card-body">
       <h5 class="card-title">{{chapter['chapter_name']}}</h5>
       <p class="card-text">{{chapter['chapter_description']}}</p>
       <br>
       <button v-on:click="nav_quiz(chapter['id'])" class="btn btn-primary">Go to Quizes</button>
       <button v-on:click="update_chapter" class="btn btn-secondary">Update</button>
       <div>
       </div>
       <br><br>
       <button v-on:click="delete_data(chapter['id'])" class="btn btn-danger">Delete</button>
       <div v-bind:class="upd_cls">
         <label  for="update_subject_name">Update Name</label>
       <input type="text" v-model="chapter['chapter_name']" name="update_subject_name" >
       <label for="update_subject_description">Update Description</label>
       <input type="text" v-model="chapter['chapter_description']" name="update_subject_description">
       <br><br>
       <button v-on:click="upd_data(chapter['id'],chapter['chapter_name'],chapter['chapter_description'] )" class='btn btn-primary'>Update</button>
       <button class='btn btn-danger' v-on:click="update_chapter">Close</button>
       </div>
       <br>
     </div>
    </div>
    </div>
    </div>
    </div>
    `,
  async beforeMount() {
    const url = `http://127.0.0.1:5000/chap/${this.$route.params.sub_id}`; // Replace with the actual URL
    const jwtToken = localStorage.getItem("ac_token")
    try {
      // 1. Await the response from the fetch call
      const response = await fetch(url,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${jwtToken}` // Add if your API requires authentication
          },
        });

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
      chapters_data: [],
      chapter_name: "",
      chapter_desc: "",
      cls1: "d-none",
      upd_cls: "d-none",
      chp_data_upd:[]
    };
  },
  methods: {
    cr_chpt() {
      if (this.cls1 === "d-none") {
        this.cls1 = "visible";
      } else {
        this.cls1 = "d-none";
      }
    },
    back_subject() {
      this.$router.push("/adm_subject");
    },
    update_chapter() {
      if (this.upd_cls==='d-none'){
        this.upd_cls='visible'
      }
      else{
        this.upd_cls='d-none'
      }
    },
    async add_chapter() {
      this.chapters_data.push(this.chapter_name);
      this.chapters_data.push(this.chapter_desc);
      this.chapters_data.push(this.$route.params.sub_id);
      console.log(this.chapters_data);
      this.chapter_name = "";
      this.chapter_desc = "";
      let data_to_send = {
        chapter_name: this.chapters_data[0],
        chapter_description: this.chapters_data[1],
        subject_id: this.chapters_data[2],
      };
      console.log(data_to_send);
      const jwtToken = localStorage.getItem("ac_token")
      try {
        const response = await fetch("http://127.0.0.1:5000/chapter", {
          method: "POST", // Specify the HTTP method
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${jwtToken}` // Example: if you need authentication
          },
          body: JSON.stringify(data_to_send), // Convert JS object to JSON string
        });

        // Check if the request was successful (status code 2xx)
        if (!response.ok) {
          // If not OK, throw an error with the status
          const errorData = await response
            .json()
            .catch(() => ({ message: "Unknown error" }));
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${
              errorData.message || response.statusText
            }`
          );
        }

        const data = await response.json(); // Parse the JSON response from the server
        console.log(data);
      } catch (error) {
        this.createError = error.message; // Display the error message
        console.error("There was an error creating the post:", error);
      }
    },
    async delete_data(delete_id){
    const apiUrl = `http://127.0.0.1:5000/chap/${delete_id}`;
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
  nav_quiz(chp_id) {
    this.$router.push(`/adm_quiz/${chp_id}/quiz`)
    },
    async upd_data(chapter_id, chapter_name, chapter_desc){
      this.update_chapter()
      if (chapter_id !== "" && chapter_name !== "" && chapter_desc !== "") {
        this.chp_data_upd.push(chapter_id);
        this.chp_data_upd.push(chapter_name);
        this.chp_data_upd.push(chapter_desc);
        console.log(this.chp_data_upd);
        chapter_id = "";
        chapter_name = "";
        chapter_desc = "";
        const url = `http://127.0.0.1:5000/chap/${this.chp_data_upd[0]}`; // Replace with your actual API endpoint
        const jwtToken = localStorage.getItem("ac_token")
      const dataUpdate = {
        chapter_name: this.chp_data_upd[1],
        chapter_description: this.chp_data_upd[2],
      };

      try {
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
          this.chp_data_upd = [];
          const errorData = await response.json(); // Or response.text() if not JSON
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${
              errorData.message || response.statusText
            }`
          );
        }

        const result = await response.json(); // Assuming the server responds with JSON
        this.chp_data_upd = [];
        console.log("Success:", result);
        // You can now update your UI or state with the 'result'
      } catch (error) {
        console.error("Error during POST request:", error);
        // Handle network errors, parsing errors, or API-specific errors
      }
      }
    }
  },

};
