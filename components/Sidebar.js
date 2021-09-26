// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountCircleIcon from '@mui/material/Avatar';
import styled from "styled-components";
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import * as EmailValidator from 'email-validator';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import Chat from '../components/Chat';

function Sidebar() {

    const [user] = useAuthState(auth);
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);
    const [chatsSnapshot] = useCollection(userChatRef);

    const createChat = () => {
        const input = prompt('Add an user email to chat');

        // if user doensn't input anything
        if(!input) return null;

        // check whether email input is authentic or not if func returns 'true'
        if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email){
            // We neeed to add the chat into DB 'chats' collection if it doesnt already exists and is valid
            db.collection('chats').add({
                users: [user.email, input],
            });
        }
    };

    const chatAlreadyExists = (recepeintEmail) => {
        !!chatsSnapshot?.docs.find(
            (chat) => 
                chat.data().users.find((user) => user === recepeintEmail)?.length > 0
        );
    };

    return (
        <Container>
            {/* Header */}
            <Header>
                <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} variant='dot' />
                <IconsContainer>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </IconsContainer>
            </Header>
            {/* Header ends */}

            {/* Search Bar In Chats */}
            <Search>
                <SearchIcon />
                <SearchInput placeholder="Search in chats" />
            </Search>
            {/* Search Bar in chats ends */}

            {/* Start a new chat */}
            <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>
            {/* Start a new chat ends */}

            {/* List of chats */}
            {chatsSnapshot?.docs.map((chat) => (
                <Chat key = {chat.id} id={chat.id} users={chat.data().users} />
            ))}


        </Container>
    );
}

export default Sidebar;

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-height: 300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar{
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;

`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(AccountCircleIcon)`
    cursor: pointer;
    :hover{
        opacity: 0.6;
    }
`;

const IconsContainer = styled.div``;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
`;

const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`;

const SidebarButton = styled(Button)`
    width: 100%;

    &&&{
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
    
`;