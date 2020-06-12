// UncontrolledLottie.jsx
import React, { Component } from 'react'
import Lottie from 'react-lottie'
import animationData from '../lotties/loading.json'
// import animationData from '../lotties/loading2points.json'


class UncontrolledLottie extends Component {


  render(){

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return(
      <div style={{height:"100vh", width:"100vw",display:"flex", justifyContent: "center", alignItems:"center",alignSelf: "center"}}>
        <Lottie options={defaultOptions}
              height={400}
              width={400}
        />
      </div>
    )
  }
}

export default UncontrolledLottie