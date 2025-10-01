import { useEffect } from "react";


const Checking = () => {
    // const token = localStorage.getItem("token");
    // console.log(token);

    const checkData = async() =>{

        const response = await fetch('http://127.0.0.1:8000/api/debug-auth', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Accept': 'application/json'
            }
            }).then(r => r.json()).then(console.log);
        }

        useEffect(() => {
            checkData()
        }, [])
    return(
        <div>
        <h1>Your are open correct page</h1>
        </div>
    )
}

export default Checking;