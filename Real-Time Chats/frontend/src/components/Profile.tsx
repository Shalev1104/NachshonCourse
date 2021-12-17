const Profile = () : JSX.Element => {
    
    return (
        <div className="d-flex justify-content-between align-items-center px-3">
            <div>
                <img src={`${process.env.PUBLIC_URL}/guest.jpg`} className="rounded-circle" width={50} height={50} alt="profile"/>
                <span className="ms-2">Shalev Sror</span>
            </div>
            <button className="btn bi-box-arrow-left">&nbsp;Disconnect</button>
        </div>
    )
}

export default Profile;