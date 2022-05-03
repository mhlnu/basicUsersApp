import React, { useState } from "react";
import "./styles.scss";
import { Switch, Route, withRouter, NavLink } from "react-router-dom";
import { Container, Menu } from "semantic-ui-react";
import Home from "./components/Home/Home";
import User from "./components/Users/User";
import Users from "./components/Users/Users";
import AddUser from "./components/Users/AddUser";

const App = props => {
    const [data, setData] = useState([]);
    const [active, setActive] = useState("home");
    const menu = [
        {
            label: "Home",
            name: "home",
            path: "/",
        },
        {
            label: "Users",
            name: "users",
            path: "/users",
        },
        {
            label: "Add user",
            name: "adduser",
            path: "/adduser",
        },
    ];

    const renderMenu = menu => {
        return (
            <Menu className="topmenu">
                {menu.map((item, index) => {
                    return (
                        <Menu.Item as={NavLink} to={item.path} exact key={index} name={item.name} active={active === "/" + item.name} onClick={() => setActive(item.name)}>
                            {item.label}
                        </Menu.Item>
                    );
                })}
            </Menu>
        );
    };

    return (
        <div className="App">
            <Container>{renderMenu(menu)}</Container>
            <Switch>
                <Route exact path="/home" component={props => <Home {...props} />} />
                <Route exact path="/users" component={props => <Users setData={setData} data={data} {...props} />} />
                <Route exact path="/user/:id" component={props => <User users={data.users} {...props} />} />
                <Route exact path="/adduser" component={props => <AddUser setData={setData} data={data} {...props} />} />
                <Route component={props => <Home {...props} />} />
            </Switch>
        </div>
    );
};
export default withRouter(App);
