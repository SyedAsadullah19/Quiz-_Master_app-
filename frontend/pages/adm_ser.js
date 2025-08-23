export const admin_sers = {
  template:`
  <div>
  <br>
  <div>
  <label for="sbar">Search: <label>
  <input type=text name="sbar" v-model="query">
  <button v-on:click="searchQuizData(data1, query)" class="btn btn-primary">Submit</button>
  </div>
  <br>
  <br>
  <div v-for="r in results">
  <div class="card shadow-sm">
    <div class="card-body">
      
      <div class="mb-3 pb-2 border-bottom">
        <h5 class="card-title mb-1">{{r['quiz_name']}} </h5>
        <h6 class="card-subtitle text-muted">{{r['quiz_description']}}</h6>
      </div>

      <div class="d-flex flex-column gap-3">
        
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>Subject:</strong>
            <span class="ms-2">{{r['subject_name']}}</span>
          </div>
          <div>
            <strong>Chapter:</strong>
            <span class="ms-2">{{r['chapter_name']}}</span>
          </div>
        </div>

        <div>
          <strong>Dates:</strong>
          <p class="mb-0 mt-1 text-muted small">
            {{r['quiz_start_date']}} - {{r['quiz_end_date'] }}
          </p>
        </div>

      </div>
    </div>
  </div>
  <br>
  </div>
  <br>
  <br>
 
  </div>
  `,
  async beforeMount() {
    const url = "http://127.0.0.1:5000/all_details"; // Replace with the actual URL
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
      this.data1=data
      // 4. Work with the fetched data
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
      results:[],
      query:""
    };
  },
  methods: {
    searchQuizData(data, searchStr) {
      this.results = [];
      const lowerSearch = searchStr.toLowerCase();

      for (const key in data) {
        const quiz = data[key];
        for (const field in quiz) {
          const value = quiz[field];
          if (
            typeof value === "string" &&
            value.toLowerCase().includes(lowerSearch)
          ) {
            this.results.push(quiz);
            break; // Stop checking other fields once one match is found
          }
        }
        console.log(this.results)
      }
    },
  },
};
