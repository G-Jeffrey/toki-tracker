import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row, Container, Table, Form, FloatingLabel, FormControl, InputGroup, Button, Modal, Spinner } from "react-bootstrap";
import { MdSearch, MdDelete, MdEdit } from "react-icons/md";
const backendHost = process.env.BACKEND_URL;
const Items = ({ user_id }) => {
    const [query, setQuery] = useState('');
    const [start_date, setStartDate] = useState('2000-01-01');
    const [end_date, setEndDate] = useState('2100-01-01');
    const [loading, setLoading] = useState(true);
    const [request, setRequest] = useState(false);
    const [editRequest, setEditRequest] = useState(false);
    const [items, setItems] = useState({});
    const [confirmation, setConfirmation] = useState([]);
    const [deleteDetails, setDeleteDetails] = useState([]);
    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState(0.0);
    const deleteItem = async (e) => {
        e.preventDefault();
        setRequest(true);
        let deleteItemReq = await axios.delete(`${backendHost}/orders/${confirmation[0]}`, {
            data: {
                item_id: confirmation[1]
            }
        });
        if (deleteItemReq.status === 200) {
            alert(`${deleteDetails[0]} sucessfully delete from ${deleteDetails[1]}`);
        } else if (deleteItemReq.status === 203) {
            alert(deleteDetails.data.msg);
        } else {
            alert('Internal Server Error.')
        }
        setRequest(false);
        setConfirmation([]);
        setLoading(true);
    }
    const editItem = async (e) => {
        e.preventDefault();
        setEditRequest(true);
        let editItemReq = await axios.put(`${backendHost}/orders/${confirmation[0]}`, {
            item_id: confirmation[1],
            item_name: itemName,
            category,
            item_price: price

        });
        if (editItemReq.status === 200) {
            setConfirmation([]);
            setItemName('');
            setEditRequest(false);
        } else if (editItemReq.status === 203) {
            alert(editItemReq.data.msg);
        } else {
            alert('Internal Server Error.')
        }


        setLoading(true);
    }
    useEffect(() => {
        let getOrders = (async () => {
            const res = await axios.get(`${backendHost}/orders/`, {
                params: {
                    user_id: user_id,
                    start_date,
                    end_date
                }
            });
            if (res.status === 203) {
                alert(res.data.msg);
            } else if (res.status === 200) {
                let data = res.data;
                let items = {};
                for (let i = 0; i < data.length; i++) {
                    const vendor = data[i]['vendor'], order_name = data[i]['order_name'];
                    const getItems = await axios.get(`${backendHost}/orders/${data[i]['order_id']}`, {
                        params: {
                            user_id,
                            query
                        }
                    });
                    if (getItems.status === 200) {
                        for (let item of getItems.data) {
                            items[item['item_id']] = [item['item_name'], order_name, vendor, item['category'], item['item_price'], data[i]['order_id']];
                        }
                    } else {
                        alert('Internal Server error');
                    }
                }
                setItems(items);
            }

        });
        getOrders();
        setLoading(false);
    }, [loading]);
    return (
        <>
            <Container>
                <Row>
                    <Col md={5} className="g-3 mb-3">
                        <FloatingLabel label='Search'>
                            <InputGroup size='lg' >
                                <FormControl
                                    style={{
                                        borderTopLeftRadius:'25px',
                                        borderBottomLeftRadius: '25px'
                                    }}
                                    type='text'
                                    value={query}
                                    onChange={(e) =>{
                                        setQuery(e.target.value);
                                        setLoading(true);
                                    }} />
                                <Button variant='outline-dark'
                                style={{
                                    borderTopRightRadius:'25px',
                                    borderBottomRightRadius: '25px'
                                }}><MdSearch size='30px' /></Button>
                            </InputGroup>
                        </FloatingLabel>
                    </Col>
                    <Col sm={12} md={{ span: 3, offset: 1 }} className="g-3 mb-3">
                        <FloatingLabel label='Start Date'>
                            <FormControl
                                type="date"
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    setLoading(true);
                                }}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col sm={12} md={3} className="g-3 mb-3">
                        <FloatingLabel label='End Date'>
                            <FormControl
                                type="date"
                                onChange={(e) => {
                                    setEndDate(e.target.value);
                                    setLoading(true);
                                }}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Table striped borderless hover size="md">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Order</th>
                            <th>Vendor</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody style={{ verticalAlign: 'middle' }}>
                        {Object.keys(items).map((item_id, i) =>
                            <tr key={i}>
                                <td>{items[item_id][0]}</td>
                                <td>{items[item_id][1]}</td>
                                <td>{items[item_id][2]}</td>
                                <td>{items[item_id][3]}</td>
                                <td>${(parseFloat(items[item_id][4])).toFixed(2)}</td>
                                <td>
                                    <Button variant='none' onClick={() => {
                                        setDeleteDetails([items[item_id][0], items[item_id][1]])
                                        setConfirmation([items[item_id][5], item_id]);
                                    }}>
                                        <MdDelete size='17px' />
                                    </Button>
                                    <Button variant='none' onClick={() => {
                                        setPrice(parseFloat(items[item_id][4]));
                                        setCategory(items[item_id][3]);
                                        setConfirmation([items[item_id][5], item_id]);
                                        setItemName(items[item_id][0]);
                                    }}>
                                        <MdEdit size='17px' />
                                    </Button>
                                </td>
                            </tr>
                        )}

                    </tbody>
                </Table>
            </Container>
            <Modal size="lg" show={confirmation.length > 1 && itemName.length === 0} onHide={() => setConfirmation([])}>
                <Modal.Header closeButton>
                    <Modal.Title>Confimation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you want to remove "<strong>{deleteDetails[0]}</strong>" from "<strong>{deleteDetails[1]}</strong>"?
                </Modal.Body>
                <Form onSubmit={deleteItem}>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setConfirmation([])}>No</Button>
                        <Button type="submit" disabled={request}>{request ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Yes'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal size="lg" show={itemName.length > 1} onHide={() => {
                setItemName('');
                setConfirmation([]);
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Edit item
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={editItem}>
                    <Modal.Body>
                        <FloatingLabel label="Item" className="g-3 mb-3">
                            <FormControl
                                type="text"
                                placeholder=" "
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                required
                            />
                        </FloatingLabel>
                        <FloatingLabel label="Category" className="g-3 mb-3">
                            <Form.Control
                                as="select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required>
                                <option value="Keyboard">Keyboard</option>
                                <option value="Keycaps">Keycaps</option>
                                <option value="Switches">Switches</option>
                                <option value="Artisans">Artisans</option>
                                <option value="Misc">Miscellaneous</option>
                            </Form.Control>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInputGrid" label="Price" className="g-3 mb-3">
                            <FormControl
                                type="number"
                                value={price}
                                min={0.00}
                                onChange={(e) => setPrice(e.target.value)}
                                step="0.01"
                                required
                            />
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='submit' disabled={editRequest}>{editRequest ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Edit'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};
export default Items;