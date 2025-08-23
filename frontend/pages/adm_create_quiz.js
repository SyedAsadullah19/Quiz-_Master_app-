export const adm_create_qz = {
  template: `
    <div>
    <button v-on:click="cr_quz()" class="btn btn-primary">Create Quiz</button>
    <button v-on:click="back_chap"class="btn btn-secondary">Back to Subject</button>
    <br>
    <br>
    <div v-bind:class="cls1">
    <label>Quiz Name</label>
    <input type="text" v-model="quiz_name" class="form-control" name="quiz_name">
    <label>Quiz Description</label>
    <input type="text" v-model="quiz_description" class="form-control" name="quiz_desc">
    <label>Quiz Start Date</label>
    <input type="date" v-model="start_date" class="form-control" name="quiz_desc">
    <label>Quiz End Date</label>
    <input type="date" v-model="end_date" class="form-control" name="quiz_desc">
    <br>
    <div>
    <p>{{err}}</p>
    </div>
    <br>
    <button v-on:click="create_quiz(quiz_name,quiz_description,start_date,end_date)" class="btn btn-success">Add Quiz</button>
    <button v-on:click="cr_quz()" class="btn btn-danger">Close</button>
    <br>
    <br>
    </div>
    <div class="row">
    <div v-for="quiz in data1" class="col-md-4">
    <div class="card" style="width: 18rem;">
     <div class="card-body">
       <h5 class="card-title">{{quiz['quiz_name']}}</h5>
       <p class="card-text">{{quiz['quiz_description']}}</p>
       <p class="card-text"><b>Start Date:</b> {{quiz['quiz_start_date']}}</p>
       <p class="card-text"><b>End Date:</b> {{quiz['quiz_end_date']}}</p>
       <br>
       <div>
       <button v-on:click="to_questions(quiz['id'])" class="btn btn-primary">Go to Questions</button>
       <button v-on:click="update_quiz" class="btn btn-secondary">Update</button>
       <br>
       <br>
       <button v-on:click="delete_quiz(quiz['id'])" class="btn btn-danger">Delete</button>
       </div>
       <br>
       <div v-bind:class="upd_cls">
       <label  for="update_quiz_name">Update Name</label>
       <input type="text" v-model="quiz['quiz_name']" name="update_quiz_name" >
       <label for="update_quiz_description">Update Description</label>
       <input type="text" v-model="quiz['quiz_description']" name="update_quiz_description">
       <label for="update_quiz_start">Update Start Date</label>
       <input type="date" v-model="quiz['quiz_start_date']" name="update_quiz_end">
       <label for="update_quiz_end">Update End Date</label>
       <input type="date" v-model="quiz['quiz_end_date']" name="update_quiz_end">
       <br><br>
       <div>
       <p>{{err2}}</p>
       </div>
       <br><br>
       <button v-on:click="update_quiz_details(quiz['id'],quiz['quiz_name'],quiz['quiz_description'],quiz['quiz_start_date'],quiz['quiz_end_date'])" class="btn btn-primary">Update Quiz</button>
       <button v-on:click="update_quiz" class="btn btn-danger">Close</button>
       </div>
     </div>
    </div>
    </div>
    </div>
    </div>
    `,
    async beforeMount() {
        const url = `http://127.0.0.1:5000/quz/${this.$route.params.chap_id}`; // Replace with the actual URL

    try {
      // 1. Await the response from the fetch call
      const jwtToken = localStorage.getItem("ac_token")
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
      console.log(data)
      // 4. Work with the fetched data
      this.data1 = data;
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
      cls1: "d-none",
      upd_cls:"d-none",
      quiz_name: "",
      quiz_description: "",
      start_date: "",
      end_date: "",
      quiz_data: [],
      upd_quiz_data: [],
      err: "",
      err2:""
    };
  },
  methods: {
    cr_quz() {
      if (this.cls1 === "d-none") {
        this.cls1 = "visible";
      } else {
        this.cls1 = "d-none";
      }
    },
    back_chap() {
      this.$router.push(`/adm_subject`);
    },
    update_quiz() {
      if (this.upd_cls==='d-none'){
        this.upd_cls='visible'
      }
      else{
        this.upd_cls='d-none'
      }
    },
    to_questions(quiz_id){
      this.$router.push(`/adm_ques/${quiz_id}/questions`)
    },
    async delete_quiz(quiz_id){
      const apiUrl = `http://127.0.0.1:5000/admin/quizez/${quiz_id}`;
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
    async update_quiz_details(quiz_id,quiz_name,quiz_desc,quiz_st_dt,quiz_ed_dt){
        if (
        quiz_name === "" ||
        quiz_desc === "" ||
        quiz_st_dt === "" ||
        quiz_ed_dt === ""
      ) {
        this.err2 = "please fill all the details of the quiz";
        return;
      } else {
        this.err2 = "";
      }
      this.upd_quiz_data.push(quiz_name);
      this.upd_quiz_data.push(quiz_desc);
      this.upd_quiz_data.push(quiz_st_dt);
      this.upd_quiz_data.push(quiz_ed_dt);
      this.quiz_name = "";
      this.quiz_desc = "";
      this.quiz_st_dt = "";
      this.quiz_ed_dt = "";
      let err1={}
      let data_to_send = {
        quiz_name: this.upd_quiz_data[0],
        quiz_description: this.upd_quiz_data[1],
        quiz_start_date: this.upd_quiz_data[2],
        quiz_end_date:this.upd_quiz_data[3],
        };
      try {
        const jwtToken = localStorage.getItem("ac_token")
        const response = await fetch(`http://127.0.0.1:5000/admin/quizez/${quiz_id}`, {
          method: "PUT", // Specify the HTTP method
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
            this.upd_quiz_data=[]
            err1={}
            err1=errorData
            console.log(err1)
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
        this.err1=""
        this.err2=err1['message']
        this.createError = error.message; // Display the error message
        console.error("There was an error creating the post:", error);
      }
    },
    async create_quiz(quiz_name, quiz_desc, quiz_st, quiz_ed) {
      if (
        quiz_name === "" ||
        quiz_desc === "" ||
        quiz_st === "" ||
        quiz_ed === ""
      ) {
        this.err = "please fill all the details of the quiz";
        return;
      } else {
        this.err = "";

      }
      function convertDateFormat(dateString) {
        // Create a Date object from the input string
        // It's important to ensure the input string is in a format
        // that the Date constructor can reliably parse (e.g., "MM/DD/YYYY").
        const date = new Date(dateString);

        // Get year, month, and day
        const year = date.getFullYear();
        // Month is 0-indexed, so add 1
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Pad with leading zero if needed
        const day = date.getDate().toString().padStart(2, "0"); // Pad with leading zero if needed

        // Assemble in YYYY-MM-DD format
        return `${year}-${month}-${day}`;
      }
      let start_date = convertDateFormat(quiz_st);
      let end_date = convertDateFormat(quiz_ed);
      this.quiz_data.push(quiz_name);
      this.quiz_data.push(quiz_desc);
      this.quiz_data.push(start_date);
      this.quiz_data.push(end_date);
      this.quiz_name = "";
      this.quiz_desc = "";
      this.start_date = "";
      this.end_date = "";
      let err1={}
      let data_to_send = {
        quiz_name: this.quiz_data[0],
        quiz_description: this.quiz_data[1],
        quiz_start_date: this.quiz_data[2],
        quiz_end_date:this.quiz_data[3],
        chapter_id: this.$route.params.chap_id,
      };
      console.log(data_to_send);
      const jwtToken = localStorage.getItem("ac_token")
      try {
        const response = await fetch("http://127.0.0.1:5000/admin/quizez", {
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
            this.quiz_data=[]
            err1={}
            err1=errorData
            console.log(err1)
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
        this.err1=""
        this.err=err1['message']
        this.createError = error.message; // Display the error message
        console.error("There was an error creating the post:", error);
      }
    },
  },
};
