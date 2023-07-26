import Carousel from "./Carousel";
import ChatList from "./ChatList";
import Profile from "./Profile";
import Search from "./Search";

const Menu = () : JSX.Element => {
    
    return (
        <ul className="nav d-flex bg-success align-items-stretch vh-100 overflow-auto float-start flex-column flex-nowrap" style={{resize:'horizontal', maxWidth:'500px', minWidth:'300px'}}>

            <li className="nav-item">
                <Carousel/>
            </li>

            <hr />

            <li className="nav-item m-auto">
                <Search/>
            </li>

            <li className="nav-item flex-grow-1 overflow-auto">
                <ChatList/>
            </li>

            <hr />

            <li className="nav-item">
                <Profile/>
            </li>
            
        </ul>
    )
}

export default Menu;