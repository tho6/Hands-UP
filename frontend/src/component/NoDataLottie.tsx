// UncontrolledLottie.jsx
import React, { Component } from 'react'
import Lottie from 'react-lottie'
import animationData from '../lotties/noData.json'
// import animationData from '../lotties/loading2points.json'


class NoDataLottie extends Component {


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
              height={350}
              width={250}
        />
      </div>
    )
  }
}

export default NoDataLottie