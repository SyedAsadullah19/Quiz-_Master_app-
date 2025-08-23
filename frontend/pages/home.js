export const home = {
    template:`<div class="bg-light">
    <br>
    <center><h1>Quiz Master App</h1></center>
    <center><h3>Welcome to quiz master app a quiz management tool</h3></center>
    <br>
    <center>
    <div class="card container bg-warning" style="height: 30%; width:25%; padding-top:2%; padding-bottom:2%;">
    <button v-on:click="to_login" class="btn btn-primary">Student Login</button>
    <br>
    <br>
    <button v-on:click="to_register" class="btn btn-primary">New Student Register</button>
    </div>
    </center>
    <br>
    </div>`,
    methods: {
        to_login() {
            this.$router.push('/login')
        },
        to_register() {
            this.$router.push('/register')
        }
    },
    }