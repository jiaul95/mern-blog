
import { createContext,useContext, useState } from "react";

const UserContext = createContext();

export const ContextAPIComponent = () => {

    const userObj = [
        {
            id:"1",
            name:"user one"
        },
        {
            id:"2",
            name:"user two"
        },
        {
            id:"3",
            name:"user three"
        },
        {
            id:"4",
            name:"user four"
        }
    ];
  
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