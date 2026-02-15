
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

    console.log("userData",userData);

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

}