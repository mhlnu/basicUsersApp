import React, { useState, useEffect } from "react";
import { Container, Grid, Header, Segment, Button, Icon, Input, Modal } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import "./Users.scss";

const User = props => {
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [edit, setEdit] = useState(false);
    const [userEdit, setUserEdit] = useState({});
    const [errors, setErrors] = useState([]);
    const [removeUser, setRemoveUser] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reqDetails, setReqDetails] = useState({});

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const data = await fetch(`https://reqres.in/api/users/${id}`);
            const json = await data.json();
            setUser(json.data);
        };
        fetchData().catch(console.error);
        setLoading(false);
    }, [id]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (Object.entries(reqDetails).length > 0) {
                setReqDetails({});
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [reqDetails]);

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
        setUserEdit({ ...userEdit, [name]: value });
    };

    const handleEditUser = val => {
        if (val) {
            setUserEdit(user);
            setEdit(true);
        } else {
            setUserEdit({});
            setEdit(false);
        }
    };

    const editUser = action => {
        const actionBody = action === "delete" ? { method: action } : { method: action, ...userEdit };
        const edit = async () => {
            const data = await fetch(`https://reqres.in/api/users/${id}`, actionBody);
            const json = await data;
            console.log(json);
            if (json.status === 204) {
                setEdit(false);
                setUser({});
                setUserEdit({});
                setRemoveUser(false);
                setReqDetails({
                    status: json.status,
                    message: json.status + ": User " + action + " successfully",
                });
            } else {
                setReqDetails({
                    status: json.status,
                    message: "User " + action + " successfully",
                });
                setEdit(false);
                setRemoveUser(false);
            }
        };
        edit().catch(console.error);
    };

    if (user && Object.entries(user).length !== 0) {
        return (
            <Container className="users">
                <Grid verticalAlign="middle" className="gridHeader">
                    <Grid.Column width={12}>
                        <Header as="h2">{user.first_name + " " + user.last_name}</Header>
                    </Grid.Column>
                    <Grid.Column width={4} textAlign="right">
                        {user && !edit ? (
                            <Button className="ui primary mini button" onClick={() => handleEditUser(true)}>
                                <Icon name="edit" />
                                Edit user
                            </Button>
                        ) : (
                            <React.Fragment>
                                <Button className="ui negative mini button" onClick={() => handleEditUser(false)}>
                                    <Icon name="close" />
                                    Cancel
                                </Button>
                                <Button className="ui positive mini button" onClick={() => editUser("put")}>
                                    <Icon name="save" />
                                    Save
                                </Button>
                            </React.Fragment>
                        )}
                    </Grid.Column>
                </Grid>
                <Segment>
                    <Grid>
                        <Grid.Column width={4}>
                            <img className="ui placeholder" style={{ width: "15rem", height: "15rem" }} src={user.avatar} alt={user.first_name} />
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Header as="h3">User details</Header>
                            {errors.length > 0 && (
                                <div className="ui error message">
                                    {errors.map((err, index) => {
                                        return <div key={index}>{Object.values(err)}</div>;
                                    })}
                                </div>
                            )}
                            {Object.entries(reqDetails).length > 0 && <div className="ui positive message">{reqDetails.status + ": " + reqDetails.message}</div>}
                            <Grid className="userDetails" verticalAlign="middle">
                                <Grid.Column width={3} className="strong">
                                    First name:
                                </Grid.Column>
                                <Grid.Column width={13}>
                                    {!edit ? user.first_name : <Input error={errors.first_name} name="first_name" onChange={(e, data) => handleEdit(e, data)} value={userEdit.first_name} />}
                                </Grid.Column>
                                <Grid.Column width={3} className="strong">
                                    Last name:
                                </Grid.Column>
                                <Grid.Column width={13}>
                                    {!edit ? user.last_name : <Input error={errors.last_name} name="last_name" onChange={(e, data) => handleEdit(e, data)} value={userEdit.last_name} />}
                                </Grid.Column>
                                <Grid.Column width={3} className="strong">
                                    Email:
                                </Grid.Column>
                                <Grid.Column width={13}>
                                    {!edit ? user.email : <Input error={errors.email} name="email" onChange={(e, data) => handleEdit(e, data)} value={userEdit.email} />}
                                </Grid.Column>
                                {edit && (
                                    <Grid.Column width={16}>
                                        <Button className="ui negative mini button" onClick={() => setRemoveUser(true)}>
                                            <Icon name="trash" />
                                            Delete user
                                        </Button>
                                    </Grid.Column>
                                )}
                            </Grid>
                        </Grid.Column>
                    </Grid>
                </Segment>
                <Modal size={"tiny"} open={removeUser} onClose={() => setRemoveUser(false)}>
                    <Modal.Header>Delete user</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to delete this user</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={() => setRemoveUser(false)}>
                            No
                        </Button>
                        <Button positive onClick={() => editUser("delete")}>
                            Yes
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Container>
        );
    } else if (loading) {
        return (
            <Container className="users">
                <Grid verticalAlign="middle" className="gridHeader">
                    <Grid.Column width={12}>
                        <Header as="h2">Loading...</Header>
                    </Grid.Column>
                </Grid>
            </Container>
        );
    } else {
        return (
            <Container className="users">
                <Grid verticalAlign="middle" className="gridHeader">
                    <Grid.Column width={12}>
                        <Header as="h2">Users</Header>
                    </Grid.Column>
                </Grid>
                {reqDetails.status === 204 ? <Segment>{reqDetails.message}</Segment> : <Segment>User data not found</Segment>}
            </Container>
        );
    }
};

export default User;
