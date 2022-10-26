export default function Navbar(){
    return(
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{flex: 1}}>
                <button>Home</button>
            </div>
            <div style={{flex: 1}}>
                <button>List</button></div>
            <div style={{flex: 1}}>Settings</div>
        </div>
    )
}