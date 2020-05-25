import React from 'react'
import { Button } from 'react-bootstrap';

export default function GoogleLogin() {
    return (
        <>
            <div>
            <a href = {`https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&scope=profile+email&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URL}`} rel = "noopener noreferrer">
                <Button variant="light" >Google Login</Button></a>
            </div>  
        </>
    )
}
