import React, { useState } from 'react'

function Tets() {
    const state = useState("mohmad") ;
    console.log(state)
    const name = state[0] ;
    const satName = state[1] ;
    satName("ayoub")
    console.log(name)
  return (
    <div>Tets</div>
  )
}

export default Tets