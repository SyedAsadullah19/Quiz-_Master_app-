export const adm_stu = {
    template:
    `
    <div class="bg bg-light" style="padding:10px">
    <center><h1>All Students</h1></center>
    <router-view :key="$route.fullPath" ></router-view>
    `
}