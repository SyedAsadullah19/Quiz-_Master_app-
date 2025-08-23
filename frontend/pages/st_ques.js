export const st_question = {
  template: `
    <div>
    <button v-on:click="back_subj" class="btn btn-secondary">Subject</button>
    <h1 v-bind:class="cls">The quiz has not started yet or the quiz is over</h1>

    <div v-for="(ques,index) in data1">
    <div>
    <br>
    <p v-if="Object.keys(data2).length>0"><b>{{ques["question_text"]}},Answer choose 1:{{data2[Object.keys(data2)[index-1]]["answer"]}}</b></p>
    <p v-else><b>{{ques["question_text"]}},Answer choose:</b></p>

        <input v-on:click="add_data(ques['id'],1)"  type="radio"  :name="ques['id']" :value="1">
        <label for="{{ques['id']}}">{{ques["option1"]}}</label><br>

        <input v-on:click="add_data(ques['id'],2)" type="radio"  :name="ques['id']" :value="2">
        <label for="{{ques['id']}}">{{ques["option2"]}}</label><br>

        <input v-on:click="add_data(ques['id'],3)" type="radio"  :name="ques['id']" :value="3">
        <label for="{{ques['id']}}">{{ques["option3"]}}</label><br>

        <input v-on:click="add_data(ques['id'],4)" type="radio"  :name="ques['id']" :value="4">
        <label for="{{ques['id']}}">{{ques["option4"]}}</label><br>
    </div>
    <br>
    </div v-bind:class="cls2">
     <button v-on:click="submit_data()" v-bind:class="cls2">Submit</button>
     <br><br>
     <div>
       <h5>{{err}}</h5>
     </div>
    </div>
    `,
  async beforeMount() {
    const url = `http://127.0.0.1:5000/stu/qus/${this.$route.params.quiz_id}`; // Replace with the actual URL
    const jwtToken = localStorage.getItem("ac_token");
    try {
      // 1. Await the response from the fetch call
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`, // Add if your API requires authentication
        },
      });

      // 2. Check if the response was successful (HTTP status 200-299)
      if (!response.ok) {
        // If not successful, throw an error to be caught by the catch block
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // 3. Await the parsing of the response body (e.g., as JSON)
      this.cls = "d-none";
      this.cls2 = "visible btn btn-primary";
      const data = await response.json(); // Or .text(), .blob(), etc.
      this.data1 = data;
      // 4. Work with the fetched data
    } catch (error) {
      // 5. Handle any errors that occurred during the fetch or processing
      this.cls = "visible";
      this.cls2 = "d-none";
      console.error("Error fetching data:", error);
      // You might want to display an error message to the user here
      // or re-throw the error if it needs to be handled higher up.
    }
    const url1 = `http://127.0.0.1:5000/sb_ans`
    const jwtToken1 = localStorage.getItem("ac_token");
    const dataToSend={
      user_name:localStorage.getItem("user_name"),
      quiz_id:this.$route.params.quiz_id
    }
    try {
      // 1. Await the response from the fetch call
      const response = await fetch(url1, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken1}`, // Add if your API requires authentication
        },
        body: JSON.stringify(dataToSend),
      });

      // 2. Check if the response was successful (HTTP status 200-299)
      if (!response.ok) {
        // If not successful, throw an error to be caught by the catch block
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // 3. Await the parsing of the response body (e.g., as JSON)
      this.cls = "d-none";
      this.cls2 = "visible btn btn-primary";
      const data = await response.json(); // Or .text(), .blob(), etc.
      this.data2 = data;
      console.log(this.data2)
      // 4. Work with the fetched data
    } catch (error) {
      // 5. Handle any errors that occurred during the fetch or processing
      this.cls = "visible";
      this.cls2 = "d-none";
      console.error("Error fetching data:", error);
      // You might want to display an error message to the user here
      // or re-throw the error if it needs to be handled higher up.
    }
  },
  data() {
    return {
      data: {},
      data1: {},
      data2: {},
      cls: "d-none",
      cls2: "d-none",
      err: "",
      err2:""
    };
  },
  methods: {
    add_data(ques_id,val) {
      this.$set(this.data, ques_id, val);
    },
    async submit_data(){
      let data_to_send={
        user_name:localStorage.getItem('user_name'),
        Questions:this.data,
        quiz_id:this.$route.params.quiz_id
      }
      try {
        const jwtToken = localStorage.getItem("ac_token")
        const response = await fetch("http://127.0.0.1:5000/answers", {
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
    back_subj() {
      this.$router.push(`/stu_subject`);
    },
  },
};
