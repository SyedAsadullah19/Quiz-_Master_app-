export const adm_qz = {
    template:`
    <div class="bg bg-light" style="padding:10px">
    <center><h1>All Quizez</h1></center>
    <router-view :key="$route.fullPath" ></router-view>
    </div>
    `
}