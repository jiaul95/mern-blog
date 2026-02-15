
import { useState } from "react";



export const TestForm = () => {

    const [data,setData] = useState({
        text: "",
        radio: "",
        checkbox: "false"
    });

    const handleChange = (e) => {
        const {name,value,type,checked} = e.target;
        setData({
        ...data,
        [name]:type === "checkbox" ? checked : value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("FormData",JSON.stringify(data));
    }



    return(
        <>
        <h3>Application Form</h3>
            <form onSubmit={handleSubmit}>

                <input type="text" name="text" onChange={handleChange} 
                    style={{background: 'red'}}/>
                <br/>
                <input type="radio" name="radio" onChange={handleChange} style={{background: 'green'}} />
                <br/>
                <input type="checkbox" name="checkbox" onChange={handleChange} style={{background: 'blue'}} />
                <br/>

                <button>Submit</button>

            </form>

        </>
    )
}