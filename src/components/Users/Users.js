import React, { useState, useEffect } from "react";
import { Container, Table, Header, Segment, Pagination, Grid, Button } from "semantic-ui-react";
import "./Users.scss";

const Users = props => {
    const data = props.data;
    const setData = props.setData;
    const [page, setPage] = useState(data.page || 1);
    const [pageChange, setPageChange] = useState(false);
    const totalPages = data.total_pages || 1;

    useEffect(() => {
        const getData = async () => {
            const response = await fetch(`https://reqres.in/api/users?per_page=5&page=${page}`);
            const data = await response.json();
            setData(data);
        };
        if (data.length === 0 || pageChange) {
            getData().catch(console.error);
            setPageChange(false);
        }
    }, [data, pageChange, page, setData]);

    const handlePaginationChange = data => {
        setPage(data);
        setPageChange(true);
    };

    const renderUsers = data => {
        let users = data ? data.data : [];
        if (!users) {
            return <p>No users found</p>;
        } else {
            return (
                <React.Fragment>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width={2}>Avatar</Table.HeaderCell>
                                <Table.HeaderCell width={6}>Full name</Table.HeaderCell>
                                <Table.HeaderCell width={5}>Email</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {users.map((item, index) => {
                                return (
                                    <Table.Row className="user" key={index}>
                                        <Table.Cell className="avatar">
                                            <img style={{ width: "5rem" }} src={item.avatar} alt={item.first_name} />
                                        </Table.Cell>
                                        <Table.Cell className="userInfo">
                                            {item.first_name} {item.last_name}
                                        </Table.Cell>
                                        <Table.Cell className="userEmail">{item.email}</Table.Cell>
                                        <Table.Cell className="userActions">
                                            <a href={`/user/${item.id}`}>View user details</a>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table>
                    <Pagination
                        boundaryRange={0}
                        defaultActivePage={page}
                        ellipsisItem={null}
                        firstItem={null}
                        lastItem={null}
                        siblingRange={1}
                        totalPages={totalPages}
                        onPageChange={(e, data) => handlePaginationChange(data.activePage)}
                    />
                </React.Fragment>
            );
        }
    };

    return (
        <Container className="users">
            <Grid verticalAlign="middle" className="gridHeader">
                <Grid.Column width={13}>
                    <Header as="h2">Users</Header>
                </Grid.Column>
                <Grid.Column width={3} textAlign="right">
                    <Button className="ui primary mini button" onClick={() => props.history.push("/adduser")}>
                        Add user
                    </Button>
                </Grid.Column>
            </Grid>
            <Segment className="mb2">{renderUsers(data)}</Segment>
        </Container>
    );
};

export default Users;
