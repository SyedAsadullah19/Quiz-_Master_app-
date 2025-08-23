export const st_quizs = {
  template: `
    <div>
    <button v-on:click="back_subj()" class="btn btn-secondary"> Subjects</button>
    <br>
    <br>
    <div class="row">
    <div v-for="quiz in data1" class="col-md-4">
    <div class="card" style="width: 18rem;">
     <div class="card-body">
       <h5 class="card-title">{{quiz['quiz_name']}}</h5>
       <p class="card-text">{{quiz['quiz_description']}}</p>
       <p class="card-text"><b>Start Date:</b> {{quiz['quiz_start_date']}}</p>
       <p class="card-text"><b>End Date:</b> {{quiz['quiz_end_date']}}</p>
       <br>
       <button v-on:click="nav_ques(quiz['id'])" class="btn btn-primary">Start Quiz</button>
       <button v-on:click="check_marks(quiz['id'])" class="btn btn-primary">Check Marks</button>
       <div v-for="sc in data2">
       Your Score = {{sc['score']}}/{{sc['total_score']}}
       </div>
     </div>
    </div>
    </div>
    </div>
    </div>
    `,
  async beforeMount() {
    const url = `http://127.0.0.1:5000/quz/${this.$route.params.chap_id}`; // Replace with the actual URL

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
      const data = await response.json(); // Or .text(), .blob(), etc.
      this.data1 = data;
      // 4. Work with the fetched data
      console.log(this.data1);
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
      data2:{}
    };
  },
  methods: {
    back_subj() {
      this.$router.push(`/stu_subject`);
    },
    nav_ques(sub_id) {
      this.$router.push(`/stu_ques/${sub_id}/ques`);
    },
    async check_marks(quiz_id) {
      this.data2={}
      const url1 = `http://127.0.0.1:5000/check_students_score`;
      const jwtToken1 = localStorage.getItem("ac_token");
      const dataToSend = {
        user_name: localStorage.getItem("user_name"),
        quiz_id: quiz_id,
      };
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
        const data = await response.json(); // Or .text(), .blob(), etc.
        this.data2 = data;
        console.log(this.data2);
        // 4. Work with the fetched data
      } catch (error) {
        // 5. Handle any errors that occurred during the fetch or processing
        this.cls = "visible";
        console.error("Error fetching data:", error);
        // You might want to display an error message to the user here
        // or re-throw the error if it needs to be handled higher up.
      }
    },
  },
};
