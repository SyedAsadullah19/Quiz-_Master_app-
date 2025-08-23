export const admin_qt = {
  template: `
    <div>
    <div>
    <button v-on:click="cr_qt" class="btn btn-primary">Create Question</button>
    <button v-on:click="nav_subject" class="btn btn-secondary">Back to Subject</button>
    </div>
    <br>
    <div v-bind:class="cls1">
    <label>Question </label>
    <input type="text" class="form-control" name="question_text" v-model="question_text">
    <label>Option 1</label>
    <input type="text" class="form-control" name="opt1" v-model="opt_1" >
    <label>Option 2</label>
    <input type="text" class="form-control" name="opt2" v-model="opt_2" >
    <label>Option 3</label>
    <input type="text" class="form-control" name="opt3" v-model="opt_3" >
    <label>Option 4</label>
    <input type="text" class="form-control" name="opt4" v-model="opt_4" >
    <label>Corret Option</label>
    <input type="number" class="form-control" name="ropt" v-model="r_opt" >
    <br>
    <button v-on:click="add_chapter(question_text,opt_1,opt_2,opt_3,opt_4,r_opt)" class="btn btn-success">Add Chapter</button>
    <button v-on:click="cr_qt" class="btn btn-danger">Close</button>
    </div>
    <div class="row">
    <div v-for="ques in data1" class="col-md-4">
    <div class="card" style="width: 18rem;">
     <div class="card-body">
       <h5 class="card-title"><b>Q: </b>{{ques['question_text']}}</h5>
       <p class="card-text"><b>1. </b>{{ques['option1']}}</p>
       <p class="card-text"><b>2. </b>{{ques['option2']}}</p>
       <p class="card-text"><b>3. </b>{{ques['option3']}}</p>
       <p class="card-text"><b>4. </b>{{ques['option4']}}</p>
       <p class="card-text"><b>Right Answer: </b>{{ques['correct_option']}}</p>
       <br>
       <button v-on:click="update_qt"  class="btn btn-secondary">Update Quiz</button>
       <button v-on:click="delete_ques(ques['id'])" class="btn btn-danger">Delete</button>
       <br>
       <br>
       <div v-bind:class="upd_cls">
       <label  for="update_ques_text">Update Question</label>
       <input type="text" v-model="ques['question_text']" name="update_ques_text" >
       <label  for="update_ques_option1">Update Option 1</label>
       <input type="text" v-model="ques['option1']" name="update_ques_option1" >
       <label  for="update_ques_option2">Update Option 2</label>
       <input type="text" v-model="ques['option2']" name="update_ques_option2" >
       <label  for="update_ques_option3">Update Option 3</label>
       <input type="text" v-model="ques['option3']" name="update_ques_option3" >
       <label  for="update_ques_option4">Update Option 4</label>
       <input type="text" v-model="ques['option4']" name="update_ques_option4" >
       <label  for="update_ques_correct">Update Correct Option </label>
       <input type="text" v-model="ques['correct_option']" name="update_ques_correct" >
       <br>
       <br>
       <button v-on:click="update_question(ques['id'],ques['question_text'],ques['option1'],ques['option2'],ques['option3'],ques['option4'],ques['correct_option'])"  class="btn btn-primary">Update</button>
       <button  v-on:click="update_qt" class="btn btn-danger">Close</button>
       </div>
       <div>
       </div>
     </div>
    </div>
    </div>
    </div>
    </div>
    `,
  async beforeMount() {
    const url = `http://127.0.0.1:5000/qus/${this.$route.params.quiz_id}`; // Replace with the actual URL
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
      console.log(this.data1)
    } catch (error) {
      // 5. Handle any errors that occurred during the fetch or processing
      console.error("Error fetching data:", error);
      // You might want to display an error message to the user here
      // or re-throw the error if it needs to be handled higher up.
    }
  },
  data() {
    return {
      cls1: "d-none",
      upd_cls:"d-none",
      question_text: "",
      opt_1: "",
      opt_2: "",
      opt_3: "",
      opt_4: "",
      r_opt: "",
      ques_data: [],
      upd_ques_data: [],
      data1: {},
    };
  },
  methods: {
    cr_qt() {
      if (this.cls1 === "d-none") {
        this.cls1 = "visible";
      } else {
        this.cls1 = "d-none";
      }
    },
    update_qt() {
      if (this.upd_cls==='d-none'){
        this.upd_cls='visible'
      }
      else{
        this.upd_cls='d-none'
      }
    },
    nav_subject() {
      this.$router.push("/adm_subject");
    },
    async update_question(q_id,q_txt,op1,op2,op3,op4,r_opt){
        if (
        (
        q_txt === "",
        op1 === "",
        op2 === "",
        op3 === "",
        op4 === "",
        r_opt === "",
        q_id === ""
    )
      ) {
        return;
      }
      let num = Number(r_opt);
      let a = [1, 2, 3, 4];
      if (a.includes(num) === false) {
        return;
      }
      this.upd_ques_data.push(q_txt);
      this.upd_ques_data.push(op1);
      this.upd_ques_data.push(op2);
      this.upd_ques_data.push(op3);
      this.upd_ques_data.push(op4);
      this.upd_ques_data.push(r_opt);
      this.question_text = "";
      this.opt_1 = "";
      this.opt_2 = "";
      this.opt_3 = "";
      this.opt_4 = "";
      this.r_opt = "";
      let data_to_send = {
        question_text: this.upd_ques_data[0],
        option1: this.upd_ques_data[1],
        option2: this.upd_ques_data[2],
        option3: this.upd_ques_data[3],
        option4: this.upd_ques_data[4],
        correct_option: this.upd_ques_data[5],
      };
      console.log(data_to_send)
      try {
        const jwtToken = localStorage.getItem("ac_token")
        const response = await fetch(`http://127.0.0.1:5000//question/${q_id}`, {
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
            this.upd_ques_data=[]
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
    async delete_ques(ques_id){
        const apiUrl = `http://127.0.0.1:5000/question/${ques_id}`;

      try {
        // 1. Await the fetch call. The function pauses here until the network request completes.
        const jwtToken = localStorage.getItem("ac_token")
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
    async add_chapter(ques_txt, opt1, opt2, opt3, opt4, r_opt) {
      if (
        (ques_txt === "",
        opt1 === "",
        opt2 === "",
        opt3 === "",
        opt4 === "",
        r_opt === "")
      ) {
        return;
      }
      let num = Number(r_opt);
      let a = [1, 2, 3, 4];
      if (a.includes(num) === false) {
        return;
      }
      this.ques_data.push(ques_txt);
      this.ques_data.push(opt1);
      this.ques_data.push(opt2);
      this.ques_data.push(opt3);
      this.ques_data.push(opt4);
      this.ques_data.push(r_opt);
      this.question_text = "";
      this.opt_1 = "";
      this.opt_2 = "";
      this.opt_3 = "";
      this.opt_4 = "";
      this.r_opt = "";
      let data_to_send = {
        quiz_id: this.$route.params.quiz_id,
        question_text: this.ques_data[0],
        option1: this.ques_data[1],
        option2: this.ques_data[2],
        option3: this.ques_data[3],
        option4: this.ques_data[4],
        correct_option: this.ques_data[5],
      };
      console.log(data_to_send);
      try {
        const jwtToken = localStorage.getItem("ac_token")
        const response = await fetch("http://127.0.0.1:5000/questions", {
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
  },
};
