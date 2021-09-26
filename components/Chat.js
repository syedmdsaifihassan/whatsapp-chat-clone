import styled from "styled-components";
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountCircleIcon from '@mui/material/Avatar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import getRecepientsEmail from '../utils/getRecepientsEmail';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';

function Chat({id, users}){
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [recepientSnapshot] = useCollection(
        db.collection('users').where('email', '==', getRecepientsEmail(users, user))
        );

    const enterChat = () => {
        router.push(`/chat/${id}`)
    }
    
    const recepient = recepientSnapshot?.docs?.[0]?.data();
    const recepientEmail = getRecepientsEmail(users, user);
    
    return (
        <Container onClick={enterChat}>  
            {recepient ? (
                <UserAvatar src={recepient?.photoURL} />
            ): (
                <UserAvatar>{recepientEmail[0].toUpperCase()}</UserAvatar>
            )}
            <p>{recepientEmail}</p>
        </Container>
    );
}

export default Chat; 

const Container = styled.div`
    align-items: center;
    display: flex;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;

    :hover{
        background-color: #e9eaeb;
    }
`;

const UserAvatar = styled(AccountCircleIcon)`
    margin: 5px;
    margin-right: 15px;
`;