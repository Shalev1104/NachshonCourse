import Chat from "./Chat";

const ChatList = () : JSX.Element => {
    const chats = [{img : `${process.env.PUBLIC_URL}/guest.jpg`, name : 'User 1', message : 'Message Itself', date : '11/11/2021', unread: 0},
                   {img : `${process.env.PUBLIC_URL}/guest.jpg`, name : 'User 1', message : 'Message Itself', date : '11/11/2021', unread: 0},
                   {img : `${process.env.PUBLIC_URL}/guest.jpg`, name : 'User 1', message : 'Message Itself', date : '11/11/2021', unread: 0},
                   {img : `${process.env.PUBLIC_URL}/guest.jpg`, name : 'User 1', message : 'Message Itself', date : '11/11/2021', unread: 0},
                   {img : `${process.env.PUBLIC_URL}/guest.jpg`, name : 'User 1', message : 'Message Itself', date : '11/11/2021', unread: 0},
                   {img : `${process.env.PUBLIC_URL}/guest.jpg`, name : 'User 1', message : 'Message Itself', date : '11/11/2021', unread: 0},
                   {img : `${process.env.PUBLIC_URL}/guest.jpg`, name : 'User 1', message : 'Message Itself', date : '11/11/2021', unread: 0},
                   {img : `${process.env.PUBLIC_URL}/guest.jpg`, name : 'User 1', message : 'Message Itself', date : '11/11/2021', unread: 0},
                   {img : `${process.env.PUBLIC_URL}/guest.jpg`, name : 'User 1', message : 'Message Itself', date : '11/11/2021', unread: 0}]
    return (
        <>
            {
                chats.map((chat,id) => {
                    return <Chat key={id} {...{ id, ...chat}} />
                })
            }
        </>
    )
}

export default ChatList;