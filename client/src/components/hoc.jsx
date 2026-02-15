
import { createContext,useContext, useState } from "react";

const UserContext = createContext();

export const withLogger = () => {    
    return(
        <>
           <UserContext.Provider value={userObj}>
                <ChildComponent />
           </UserContext.Provider>
        </>
    )
}

export const ChildComponent = () =>{
    const userData = useContext(UserContext);

    const myPromise = new Promise((resolve,reject)=>{

        setTimeout(()=>{
            
                const randomNum = Math.floor(Math.random() * 10);
                if(randomNum < 5){
                    resolve(`Success! Random number: ${randomNum}`);
                }else
                {
                    reject(`Error! Random number: ${randomNum}`);
                }
            },1000);
    })


    myPromise
    .then((result)=>{
        console.log("result",result);
    })
    .catch((error)=>{
        console.log("error",error);
    })



    return (
        <>
            {
                userData.map((user,index)=>{
                    return (
                        <li key={user.id}>{user.id}</li>
                    )
                })
            }
        </>
    );

    console.log("userData",userData);
}