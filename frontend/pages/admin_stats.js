export const admin_stat = {
    template:`
    <div class="bg bg-light" style="padding:10px">
    <center><h1>All Statistics</h1></center>
    <router-view :key="$route.fullPath" ></router-view>
    </div>
    `
}