import React from 'react'
import { Button } from 'react-bootstrap';
import ReactFacebookLogin from 'react-facebook-login'

export default function FacebookLogin() {
    const fBOnCLick = () => {
        return null;
      }
    
      const fBCallback = (userInfo: any) => {
        console.log(userInfo)
        console.log(userInfo.accessToken)
        console.log(userInfo.userID)
        return null;
      }

    return (
        <>
            {/* <ReactFacebookLogin
            appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID || ''}
            autoLoad={false}
            // scope="pages_show_list,pages_read_engagement,pages_read_user_content,public_profile"
            scope="user_videos,pages_read_engagement,pages_read_user_content,pages_show_list"
            onClick={fBOnCLick}
            callback={fBCallback}
           /> */}

           <a href={`https://www.facebook.com/v7.0/dialog/oauth?client_id=${process.env.REACT_APP_FACEBOOK_CLIENT_ID}&display=page&redirect_uri=${process.env.REACT_APP_FACEBOOK_REDIRECT_URL}&state=ststate123abc&scope=user_videos,pages_read_engagement,pages_read_user_content,pages_show_list`}>
            <Button variant="light" >Facebook Token</Button>
             </a>



        </>
    )
}
