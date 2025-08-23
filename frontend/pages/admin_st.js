export const admin_sts = {
  template: `
    <div>
    <br>
    <div class="row fluid">
    <div v-for="user in data1" class="col-md-4">
    <div class="card" style="width: 18rem;">
     <div class="card-body">
       <h5 class="card-title">Name:{{user['username']}}</h5>
       <p class="card-text">Email:{{user['email']}}</p>
       <p class="card-text">Qualification:{{user['qualification']}}</p>
       <br>
       <div>
       <button v-on:click="show_subjects" class="btn btn-primary">Show Subjects</button>
       <br>
       <br>
       <div v-bind:class=cls1>
       <ol v-for="subject in data2">
       <li>
       <b>Subject Name:{{subject['subject_name']}}</b>
       <p>{{subject['subject_description']}}</p>
       <button v-on:click="show_chapters(subject['id'])" class="btn btn-primary">Show Chapters</button>
       <br>
       <br>
       <div  v-bind:class="cls2">
       <ol v-for="chapter in data3">
       <div v-if="subject['id']===chapter['subject_id']">
       <b>Chapter:{{chapter['chapter_name']}}</b>
       <p>{{chapter['chapter_description']}}</p>
       <button v-on:click="show_quiz(chapter['id'],user['id'])">Show Quiz</button>
       <br><br>
       <div  v-bind:class="cls3">
       <ol v-for="quiz in data4">
       <div v-if="quiz['user_id']===user['id'] && quiz['chapter_id']===chapter['id']">
       <b>Quiz:{{quiz['quiz_name']}}</b>
       <p>{{quiz['quiz_description']}}</p>
       <p>Start:{{quiz['quiz_start_date']}}</p>
       <p>End: {{quiz['quiz_end_date']}}</p>
       <p>Scores: {{quiz['score']}}</p>
       <p>Total_Scores: {{quiz['total_score']}}</p>
       </div>
       </div>
       <br>
       <br>
       </li>
       </ol>
       </div>
       </li>
       </ol>
       </div>
     </div>
    </div>
    </div>
    </div>
    </div>
    `,
  async beforeMount() {
    const url = `http://127.0.0.1:5000/admin_stats`; // Replace with the actual URL
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
      this.data1 = {};
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
      data2: {},
      cls1: "d-none",
      cls2: "d-none",
      cls3: "d-none",
      data3: {},
      data4: {},
    };
  },
  methods: {
    async show_subjects() {
      if (this.cls1 == "d-none") {
        this.cls1 = "visible";
        const url = "http://127.0.0.1:5000/subjects"; // Replace with the actual URL
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
          this.data2 = data;
          // 4. Work with the fetched data
          console.log("this is data 2", this.data2);
        } catch (error) {
          // 5. Handle any errors that occurred during the fetch or processing
          console.error("Error fetching data:", error);
          // You might want to display an error message to the user here
          // or re-throw the error if it needs to be handled higher up.
        }
      } else {
        this.cls1 = "d-none";
      }
    },
    async show_chapters(subject_id) {
      if (this.cls2 === "d-none") {
        this.cls2 = "visible";
        const url = `http://127.0.0.1:5000/chap/${subject_id}`; // Replace with the actual URL
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
          this.data3 = data;
          // 4. Work with the fetched data
          console.log(this.data3, "this is data 3");
        } catch (error) {
          // 5. Handle any errors that occurred during the fetch or processing
          console.error("Error fetching data:", error);
          // You might want to display an error message to the user here
          // or re-throw the error if it needs to be handled higher up.
        }
      } else {
        this.cls2 = "d-none";
      }
    },
    async show_quiz(chapter_id, user_id) {
      if (this.cls3 === "d-none") {
        this.cls3 = "visible";
        const url = `http://127.0.0.1:5000/show_quiz_admin/${user_id}/${chapter_id}`; // Replace with the actual URL
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
          this.data4 = data;
          // 4. Work with the fetched data
          console.log(this.data4)
        } catch (error) {
          // 5. Handle any errors that occurred during the fetch or processing
          console.error("Error fetching data:", error);
          // You might want to display an error message to the user here
          // or re-throw the error if it needs to be handled higher up.
        }
      } else {
        this.cls3 = "d-none";
      }
    },
  },
};
