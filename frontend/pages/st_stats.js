export const st_stat={
    template:`
    <div>
    <div class="container py-4">
  <div class="row">

    <div class="col-lg-3 col-md-6 mb-4">
      <div class="card text-center shadow-sm h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="display-4 text-primary">
              <i class="bi-people-fill"></i>
            </div>
            <div>
              <h5 class="card-title text-muted text-uppercase mb-0">Total Quiz</h5>
              <span class="h2 font-weight-bold mb-0">{{data1['quiz']}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-3 col-md-6 mb-4">
      <div class="card text-center shadow-sm h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="display-4 text-info">
              <i class="bi-bar-chart-line-fill"></i>
            </div>
            <div>
              <h5 class="card-title text-muted text-uppercase mb-0">Attempted</h5>
              <span class="h2 font-weight-bold mb-0">{{data1['attempt']}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-3 col-md-6 mb-4">
      <div class="card text-center shadow-sm h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="display-4 text-success">
              <i class="bi-bag-fill"></i>
            </div>
            <div>
              <h5 class="card-title text-muted text-uppercase mb-0">Pending</h5>
              <span class="h2 font-weight-bold mb-0">{{data1['pending']}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

  </div>
</div>
    </div>
    `,
    async beforeMount() {
    const url = `http://127.0.0.1:5000/stu_stats/${localStorage.getItem('user_name')}`; // Replace with the actual URL
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
        data1:{}
    }
  },
}