import { useState,useReducer } from "react";

function reducer(state,action){
  switch(action.type){
    case "increment":
      return {count: state.count + 1}
    case "decrement":
      return {count : state.count - 1}
    default:
      return state;
  }
}




export const TestComponent = () => {
  const [state,dispatch] = useReducer(reducer,{count:0});




  // const [count,setCount] = useState(0);
  // const [data,setData] = useState("");

  // const users = [
  //   {
  //     "id":1,"name":"Jiaul"
  //   },
  //   {
  //     "id":2,"name":"Test"
  //   }
  // ];

  // const Increment = () => {
  //   setCount(count+1);
  // }


  // const Decrement = () => {
  //   if(count < 1){
  //      alert("Count could not be less than 0");
  //       return;
  //   }
     
  //   setCount(count-1);
  // }

  // const handleMethod = (childata) => {
  //   setData(childata)
  // }

  return (
    <>
        <p>Count: {state.count}</p>
        {/* <Child sendData ={handleMethod} /> */}
        {/* <p>{data}</p> */}
        {/* 
                {count}
                <button onClick={Increment}>Increment</button><br/>
                <button onClick={Decrement}>Decrement</button>

                <ul>
                  {users.map((u=>{
                    return <li key={u.id}>{u.name}</li>
                  }))}
                </ul> 
        */}


    
    </>
  )
}


export const Child = ({sendData}) => {
  // return <h1>This is message {childMessage} && {handleMethod}  </h1>
  return <button onClick={() => sendData("Data from Child")}>Send</button>;
}