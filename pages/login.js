import Head from 'next/head';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import { auth, provider } from '../firebase';

function Login(){

    const signIn = () => {
        auth.signInWithPopup(provider).catch(alert);
    };

    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>

            <LoginContainer>
                {/* <Logo src = "./images/logo.png"/> */}
                <Logo src = "https://logodownload.org/wp-content/uploads/2015/04/whatsapp-logo-1.png"/>
                <Button onClick = {signIn} variant="outlined">Sign in with Google</Button>
            </LoginContainer>
        </Container>
    );
}

export default Login;

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: whitesmoke;
`;

const LoginContainer = styled.div`
    padding: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 4px 14px -3px gray ;
`;

const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;
`; 