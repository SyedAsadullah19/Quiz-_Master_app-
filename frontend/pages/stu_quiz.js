export const stu_quizs = {
    template:`
    <div class="bg bg-light" style="padding:10px">
    <center><h1>All Quiz</h1></center>
    <router-view :key="$route.fullPath" ></router-view>
    </div>
    `
}