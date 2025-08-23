export const stu_chapter={
    template:`
    <div class="bg bg-light" style="padding:10px">
    <center><h1>All Chapters</h1></center>
    <router-view :key="$route.fullPath" ></router-view>
    </div>
    `
}