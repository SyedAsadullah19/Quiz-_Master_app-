export const login = {template: `
    <div class="container bg-secondary" style="padding:1.5%; m height: 450px; width: 750px;">
        <center>
            <div class="card bg-light" style="border:250px;">
                <br>
                <div>
                    <h3>Login Page</h3>
                </div>
                <br>
                <div class="mb-3">
                    <label for="name">Student Name: </label>
                    <input class="form-control-sm" v-model = stu_name type="text" name="name">
                    <br><br>
                    <label for="password"> Password: </label>
                    <input class="form-control-sm" v-model=stu_psswd type="text" name="password">
                    <br><br>
                    <center><button class="btn btn-primary" v-on:click="go_dash">Submit</button></center>
                    <br>
                    <center><a v-on:click="go_back" class="link">Go Back</a></center>
                    <br>
                </div>
                <p>
                {{messg}}
                </p>
            </div>
        </center>
    </div>
    `,
    data() {
        return {
            stu_name:"",
            stu_psswd:"",
            stu_data:[],
            messg:""
        }
    },
    methods: {
        go_back() {
            this.$router.push("/")
        },
        async go_dash() {
            this.stu_data = []
            if (this.stu_name.trim() !== "" && this.stu_psswd.trim() !== "" ){
                this.stu_data.push(this.stu_name)
                this.stu_data.push(this.stu_psswd)

                
            }
            else {
                this.messg="check name, password again, you have to fill all details !!!"
            }
            const url = "http://127.0.0.1:5000/login";
            try {
                const response = await fetch(url,{
                    method:'POST',
                    headers:{'Content-Type': 'application/json'},
                    body:JSON.stringify({
                        username:this.stu_data[0],
                        password:this.stu_data[1]

                    })
                })
                if (!response.ok) {
                    const json = await response.json();
                    this.messg=json.message
                    console.log(json.message)
                    this.stu_data=[]
                    throw new Error(`Response status: ${response.status}`);

                }
                localStorage.clear()
                this.stu_data=[]
                const json = await response.json();
                console.log(json.access_token)
                localStorage.setItem('ac_token',json.access_token)
                localStorage.setItem('user_name',json.user.username)
                localStorage.setItem('category',json.user.category)
                if (json.user.category == 'student'){
                    this.$router.push('/stu_subject')
                }
                else
                    {
                        this.$router.push('/adm_subject')
                }
         
            } 
            catch (error) {
                console.error(error.message);
            }
            
        }
    },
}


