export const st_sbj = {
  template: `
    <div>
    <br>
    <div class="row">
    <div v-for="subject in data1" class="col-md-4">
    <div class="card" style="width: 18rem;">
     <div class="card-body">
       <h5 class="card-title">{{subject["subject_name"]}}</h5>
       <p class="card-text">{{subject["subject_description"]}}</p>
       <br>
       <div>
       <button v-on:click="nav_chap(subject['id'])" class="btn btn-primary">Go to Chapters</button>
     </div>
    </div>
    </div>
    </div>
    </div>
    `,
  async beforeMount() {
    const url = `http://127.0.0.1:5000/subjects`; // Replace with the actual URL
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
      console.log(this.data1);
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
    };
  },
  methods: {
    nav_chap(sub_id) {
      this.$router.push(`/stu_chapt/${sub_id}/chapt`);
    },
  },
};
