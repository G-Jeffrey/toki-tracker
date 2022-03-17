// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container, Button, Modal, FloatingLabel, FormControl, Form, Table, Spinner, ButtonGroup } from "react-bootstrap";
import { AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import axios from 'axios';
const backendHost = process.env.REACT_APP_BACKEND_URL;
const OrderDetail = ({ order_id, order_name, vendor, total, subtotal, tax, savings, shipping, arrival_date, date_of_purchase, image_url, items, user_id, reloadOrders, editOrder, setEditOrder, editParams }) => {
    items = parseInt(items);
    date_of_purchase = (new Date(date_of_purchase)).toISOString().split('T')[0];
    arrival_date = (new Date(arrival_date)).toISOString().split('T')[0];
    const [show, setShow] = useState(false);
    const [addItem, setAddItem] = useState(false);
    const [itemName, setItemName] = useState("");
    const [price, setPrice] = useState(0);
    const [itemList, setItemList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState("Keyboard");
    const [confirmation, setConfirmation] = useState(false);
    const [itemLoad, setItemLoad] = useState(false);
    let i = 1;
    const sendEdit = async (e) => {

        editParams[0](order_name);
        editParams[1](vendor);
        editParams[2](date_of_purchase);
        editParams[3](arrival_date);
        editParams[4](tax);
        editParams[5](savings);
        editParams[6](shipping);
        editParams[7](order_id);
        setEditOrder(true);
    }
    const deleteOrder = async (e) => {
        e.preventDefault();
        const confirm_login = document.cookie.split(';')[0].split('=');
        if (!user_id) {
            window.location.pathname = '/login';
            alert('Not logged in');
            return;
        }
        const delete_req = await axios.delete(`${backendHost}/orders/`, {
            data: {
                order_id: order_id
            }
        });
        if (delete_req.status === 200) {
            alert(`${order_name} has been deleted`);
        } else if (delete_req.status === 203) {
            alert(`${delete_req.data.msg}`);
        }
        console.log(delete_req);
        setConfirmation(false);
        setShow(false);
        reloadOrders(true);
    }
    const submitItem = async (e) => {
        e.preventDefault();
        setItemLoad(true);
        const add_request = await axios.post(`${backendHost}/orders/${order_id}`, {
            item_name: itemName,
            item_price: price,
            category: category,
            user_id: user_id
        });
        // reset state and reload
        setAddItem(false);
        setPrice(0);
        setItemLoad(false);
        setCategory("Keyboard");
        setItemName("");
        setLoading(true);
        reloadOrders(true);
    }
    useEffect(() => {
        let getOrders = (async () => {
            const res = await axios.get(`${backendHost}/orders/${order_id}`, {
                params: {
                    user_id,
                    query: ""
                }
            });
            if (res.status === 203) {
                alert(res.data.msg);
            } else if (res.status === 200) {
                setItemList(res.data);
            } else {
                alert('Internal server error');
            }
            setLoading(false);

        });
        getOrders();

    }, [loading]);
    return (
        <>
            <Card >
                <Card.Header>{vendor} : {order_name}</Card.Header>
                <div style={{ height: "45vh", maxHeight: "400px" }} className="mx-auto mb-3">
                    <Card.Img src={image_url} style={{ height: '45vh', maxHeight: "400px" }} />
                </div>
                <Card.Body>
                    <Container>
                        <Row>
                            <Col xs={9}>
                                <Card.Title>Total : ${total}</Card.Title>
                            </Col>
                            <Col xs={3}>
                                <ButtonGroup>
                            <Button variant="outline-dark" onClick={() => {
                                    setAddItem(true)
                                }}>
                                    <AiOutlinePlus fontSize={'2rem'} />
                                </Button>
                                <Button variant="outline-dark" onClick={() => {
                                    setShow(true)
                                }}>
                                    <AiOutlineEdit fontSize={'2rem'} />
                                </Button>
                                </ButtonGroup>
                            </Col>

                        </Row>
                        <Card.Subtitle>{items} item{items > 1 ? "s" : ""}</Card.Subtitle>
                    </Container>

                </Card.Body>
            </Card>
            <Modal size='lg' show={show && !addItem && !confirmation && !editOrder} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {vendor} : {order_name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <center><img src={image_url} style={{ width: 'auto', maxWidth: '100%', maxHeight: '60vh', marginTop: "10px" }} /></center>
                    <hr />
                    <Container>
                        <Row className="g-3 mb-3">
                            <Col>
                                Date of Purchase: {date_of_purchase}
                            </Col>
                            <Col>
                                Date of Arrival: {arrival_date}
                            </Col>
                        </Row>
                        <Table responsive borderless>
                            <thead>
                                <tr>
                                    <td>Subtotal</td>
                                    <td>Tax</td>
                                    <td>Shipping</td>
                                    <td>Savings</td>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <td>${parseFloat(subtotal).toFixed(2)}</td>
                                    <td>${parseFloat(tax).toFixed(2)}</td>
                                    <td>${parseFloat(shipping).toFixed(2)}</td>
                                    <td>${parseFloat(savings).toFixed(2)}</td>
                                    <th>${parseFloat(total).toFixed(2)}</th>
                                </tr>
                            </tbody>
                        </Table>
                        <Table hover responsive bordered>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Item</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemList.map(item =>
                                    <tr key={item['item_id']}>
                                        <td>{i++}</td>
                                        <td>{item['item_name']}</td>
                                        <td>{item['category']}</td>
                                        <td>${item['item_price']}</td>
                                    </tr>

                                )}
                            </tbody>
                        </Table>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setAddItem(true)}>Add Item</Button>
                    <Button onClick={() => sendEdit()}>Edit</Button>
                    <Button onClick={() => setConfirmation(true)}>Delete</Button>
                </Modal.Footer>
            </Modal>
            <Modal size="md" show={addItem} onHide={() => setAddItem(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Add a item
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={submitItem}>
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
                        <Button type='submit' disabled={itemLoad}>{itemLoad ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Add"}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal size="md" show={confirmation} onHide={() => setConfirmation(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confimation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete order : "<strong>{order_name}</strong>"?
                </Modal.Body>
                <Form onSubmit={deleteOrder}>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setConfirmation(false)}>No</Button>
                        <Button type="submit">Yes</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );

}
export default OrderDetail;