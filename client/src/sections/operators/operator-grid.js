import { useState } from "react";
import { useSelector } from "react-redux";

export const OperatorsGrid = ()=>{
  const state = useSelector((state) => state.admin);

  const [operaors, setOperators] = useState(state.operators);

  console.log(operaors)

    return(
        <>
        
        </>
    )
}