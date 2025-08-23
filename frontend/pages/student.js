export const STUDENT = {
    template:
    `
    <div class="bg-light" style="padding:50px">
    <center><h3>Student Dasboard</h3></center>
     <nav class="navbar navbar-expand-lg bg-warning">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href=""><router-link to="/stu_subject">Home</router-link></a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href=""><router-link to="/stu_stats/stat">Stats</router-link></a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href=""><router-link to="/">Main Menu</router-link></a>
        </li>
      </ul>
    </div>
  </div>
</nav>
    <router-view :key="$route.fullPath" ></router-view>
    </div>
    `
}