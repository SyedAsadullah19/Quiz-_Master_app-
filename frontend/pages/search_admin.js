export const search_admins = {
    template:`
    <div class="bg bg-light" style="padding:10px">
    <center><h1>Admin Search</h1></center>
    <router-view :key="$route.fullPath" ></router-view>
    </div>
    `
}