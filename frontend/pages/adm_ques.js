export const admin_question = {
    template:`
    <div class="bg bg-light" style="padding:10px">
    <center><h1>All Questions</h1></center>
    <router-view :key="$route.fullPath" ></router-view>
    </div>
    `
}