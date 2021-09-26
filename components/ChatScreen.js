import styled from 'styled-components';
import { useRouter } from 'next/router';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
// import Avatar from '@mui/icons-material/AccountCircle';
import AccountCircleIcon from '@mui/material/Avatar';
import MoreVert from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import { AttachFile } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Message from './Message';
import { useState, useRef } from 'react';
// importing firebase
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
// importing firebase ends
import getRecepientsEmail from '../utils/getRecepientsEmail';
// import chat from '../pages/chat/[id].js';
// import Chat from '../components/Chat';
import TimeAgo from 'timeago-react';
// import TimeAgo from 'react-timeago';

function ChatScreen({chat,messages}) {

    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    const endOfMessagesRef = useRef(null);
    const router = useRouter();
    const [messagesSnapshot] = useCollection(
        db
        .collection('chats')
        .doc(router.query.id)
        .collection('messages')
        .orderBy('timestamp', 'asc')
    );

    const [recepientSnapshot] = useCollection(
        db
        .collection('users')
        .where('email', '==', getRecepientsEmail(chat.users, user))
    );

    const showMessages = () => {
        if(messagesSnapshot){
            return messagesSnapshot.docs.map((message) => (
                <Message
                    key = {message.id}
                    user = {message.data().user}
                    message = {{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ));
        }

        else{
            return JSON.parse(messages).map(message => (
                <Message key = {message.id} user = {message.user} message = {message} />
            ));
        }
    };

    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const sendMessage = (e)=> {
        e.preventDefault();

        // Update the lastSeen
        db.collection('users').doc(user.uid).set({
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        });
        setInput('');
        scrollToBottom();
    };


    // 3:09:00 -> timestamp video tutorial
    const recepientEmail = getRecepientsEmail(chat.users, user);
    const recepient = recepientSnapshot?.docs?.[0]?.data();

    return (
        
        <Container>
            <Header>
                {recepient ? (
                    <UserAvatar src={recepient?.photoURL} />
                ) : (
                    <UserAvatar>{recepientEmail[0].toUpperCase()}</UserAvatar>
                )}
                <HeaderInformation>
                    <h3>{recepientEmail}</h3>
                    {recepientSnapshot ? (
                        <p>Last active: {' '}
                        {recepient?.lastSeen?.toDate() ? (
                            <TimeAgo datetime={recepient?.lastSeen?.toDate()} />
                        ): ('Unavailable'
                        )} 
                        </p>
                    ): (
                        <p>Loading Last active...</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </HeaderIcons>
            </Header>
            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessagesRef} />
            </MessageContainer>

            <InputContainer>
                <InsertEmoticonIcon />
                <Input value={input} onChange={e => setInput(e.target.value)} />
                <Button hidden disabled={!input} type='submit' onClick={sendMessage} ><SendIcon /></Button>
                {/* <IconButton>
                    <SendIcon />
                </IconButton> */}
                <MicIcon />
            </InputContainer>
        </Container>
    )
}

export default ChatScreen;

const Container = styled.div``;

const UserAvatar = styled(AccountCircleIcon)`
    cursor: pointer;
    :hover{
        opacity: 0.6;
    }
`;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    padding: 20px;
    background-color: whitesmoke;
    margin-left: 15px;
    margin-right: 15px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;
    >h3{
        margin-bottom: 3px;
    }
    >p{
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div``;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;

