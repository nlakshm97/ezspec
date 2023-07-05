import { Outlet, Link } from "react-router-dom";
const Home= () => {


    return (
        <div>
            <div>Hello World - Home</div>   
            <Link to="/section">Section</Link>
        </div>
    )

}

export default Home;