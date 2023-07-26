const Chat = ({id, img, name, message, date, unread} : {id : number, img: string, name: string, message: string, date: string, unread: number}) : JSX.Element => {
    
    return (
        <div className="d-flex mx-3 my-1" tabIndex={id}>
            <img src={img} className="rounded-circle" width={50} height={50} alt="chat"/>
            <div className="flex-grow-1 mx-2 d-flex flex-column overflow-hidden text-nowrap">
                <strong className="d-inline-block text-truncate">{name}</strong>
                <small className="d-inline-block text-truncate">uqueiy ,
                adahdahd : 3211,
                dadadhas,
                
                qwuiyeiqwyeuidjsdjkahshduayuduaiyuidasdsadaswq</small>
            </div>
            <div className="d-flex flex-column align-items-center">
                <span>{date}</span>
                <span>{unread}</span>
            </div>
        </div>
    )
}

export default Chat;