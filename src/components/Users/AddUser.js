import React, { useState, useEffect } from "react";
import { Container, Grid, Button, Icon, Header, Segment, Input, Message } from "semantic-ui-react";
import "./Users.scss";

const AddUser = props => {
    const [reqDetails, setReqDetails] = useState({});
    const [user, setUser] = useState({ first_name: "", last_name: "", email: "" });
    const [errors, setErrors] = useState([]);

    const editUser = () => {
        const actionBody = { method: "POST", body: user };
        const edit = async () => {
            const data = await fetch(`https://reqres.in/api/users/`, actionBody);
            const json = await data;
            if (json.status === 201) {
                setReqDetails({
                    status: json.status,
                    message: json.status + ": User added successfully",
                });
            } else {
                setReqDetails({
                    status: json.status,
                    message: "User failed successfully",
                });
            }
        };
        edit().catch(console.error);
    };

    const handleEdit = (e, data) => {
        const { name, value } = data;
        let errs = errors;
        let emailValidationRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (name === "first_name" || name === "last_name") {
            if (value.length < 3) {
                if (!errs.includes(`${name} needs to be at least 3 characters long`)) {
                    errs.push(`${name} needs to be at least 3 characters long`);
                }
            } else {
                errs = errs.filter(err => err !== `${name} needs to be at least 3 characters long`);
            }
        }
        if (name === "email") {
            if (!emailValidationRegex.test(value)) {
                if (!errs.includes("Email is not valid")) {
                    errs.push("Email is not valid");
                }
            } else {
                errs = errs.filter(err => err !== "Email is not valid");
            }
        }
        setErrors(errs);
        setUser({ ...user, [name]: value });
    };

    const validateForm = () => {
        let emailValidationRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (user.first_name.length > 3 && emailValidationRegex.test(user.email)) {
            return false;
        } else {
            return true;
        }
    };

    if (reqDetails.status === 201) {
        return (
            <Container className="users">
                <Grid verticalAlign="middle" className="gridHeader">
                    <Grid.Column width={16}>
                        <Header as="h2">Add user</Header>
                    </Grid.Column>
                </Grid>
                <Segment>
                    {reqDetails.message}. Back to <a onClick={() => props.history.push("/users")}>Users</a>.
                </Segment>
            </Container>
        );
    } else {
        return (
            <Container className="users">
                <Grid verticalAlign="middle" className="gridHeader">
                    <Grid.Column width={12}>
                        <Header as="h2">Add user</Header>
                    </Grid.Column>
                    <Grid.Column width={4} textAlign="right">
                        <Button className="ui negative mini button" onClick={() => props.history.push("/users")}>
                            <Icon name="close" />
                            Cancel
                        </Button>
                        <Button disabled={validateForm()} className="ui positive mini button" onClick={() => editUser()}>
                            <Icon name="save" />
                            Save
                        </Button>
                    </Grid.Column>
                </Grid>
                <Segment>
                    {errors.length > 0 && (
                        <div className="ui error message">
                            {errors.map((err, index) => {
                                return <div key={index}>{Object.values(err)}</div>;
                            })}
                        </div>
                    )}
                    <Grid className="userDetails" verticalAlign="middle">
                        <Grid.Column width={3} className="strong">
                            First name:
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Input error={errors.first_name} name="first_name" onChange={(e, data) => handleEdit(e, data)} value={user.first_name} />
                        </Grid.Column>
                        <Grid.Column width={3} className="strong">
                            Last name:
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Input error={errors.last_name} name="last_name" onChange={(e, data) => handleEdit(e, data)} value={user.last_name} />
                        </Grid.Column>
                        <Grid.Column width={3} className="strong">
                            Email:
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Input error={errors.email} name="email" onChange={(e, data) => handleEdit(e, data)} value={user.email} />
                        </Grid.Column>
                    </Grid>
                </Segment>
            </Container>
        );
    }
};

export default AddUser;
