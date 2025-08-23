export const Register = {
    template: `
    <div class="container bg-secondary" style="padding:1.5%; m height: 450px; width: 750px;">
        <center>
            <div class="card bg-light" style="border:250px;">
                <br>
                <div>
                    <h3>Student Register</h3>
                </div>
                <br>
                <div class="form-control">
                    <label for="name">Student Name: </label>
                    <input class="form-control-sm" v-model="stu_name" type="text" name="name">
                    <br><br>
                    <label for="email">Student Email:</label>
                    <input class="form-control-sm" v-model="stu_email" type="email" name="email">
                    <br><br>
                    <label for="qualification">Student Qualification: </label>
                    <input class="form-control-sm" v-model="stu_qlf" type="text" name="qualification">
                    <br><br>
                    <label for="password"> Password: </label>
                    <input class="form-control-sm" type="password" v-model="stu_psswd" name="password">
                    <br><br>
                    <center><button v-on:click="add_data" class="btn btn-primary">Submit</button></center>
                    <br>
                    <center><a v-on:click="go_back" class="link">Go Back</a></center>
                    <br>
                </div>
                <p>{{messg}}</p>
            </div>
        </center>
    </div>
    `,
    data() {
        return {
            stu_name:"",
            stu_email:"",
            stu_qlf:"",
            stu_psswd:"",
            stu_data:[],
            messg:""
        }
    },
    methods: {
        go_back() {
            this.$router.push("/")
        },
        async add_data(){
            
            if (this.stu_name.trim() !== "" && this.stu_email.trim() !== "" && this.stu_qlf.trim() !== "" && this.stu_psswd.trim() !== "" ){
                this.stu_data.push(this.stu_name)
                this.stu_data.push(this.stu_email)
                this.stu_data.push(this.stu_qlf)
                this.stu_data.push(this.stu_psswd)
            }
            else {
                this.messg="check name, email, password, qualification again, you have to fill all details !!!"
            }
            const url = "http://127.0.0.1:5000/register";
            try {
                const response = await fetch(url,{
                    method:'POST',
                    headers:{'Content-Type': 'application/json'},
                    body:JSON.stringify({
                        username:this.stu_data[0],
                        email:this.stu_data[1],
                        qlf:this.stu_data[2],
                        password:this.stu_data[3]

                    })
                })
                if (!response.ok) {
                    const json = await response.json();
                    this.messg=json.message
                    console.log(json.message)
                    this.stu_data=[]
                    throw new Error(`Response status: ${response.status}`);
                    
                }
                this.stu_data=[]
                const json = await response.json();
                this.$router.push('/login')
            } 
            catch (error) {
                console.error(error.message);
            }
            
        }
    },
}