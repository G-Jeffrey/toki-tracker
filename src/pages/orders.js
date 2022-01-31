import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, InputGroup, FormControl, Modal, FloatingLabel, Col, Row, Spinner } from "react-bootstrap";
import { MdSearch } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import './orders.css'
import "bootstrap/dist/css/bootstrap.min.css";
import OrderDetail from '../components/orderDetail';
import AOS from 'aos';
import 'aos/dist/aos.css';

const backendHost = process.env.BACKEND_URL;
const Orders = ({ user_id }) => {
    const [addOrder, setAddOrder] = useState(false);
    const [title, setTitle] = useState("");
    const [vendor, setVendor] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [arrivalDate, setArrivalDate] = useState("");
    const [tax, setTax] = useState("");
    const [shipping, setShipping] = useState("");
    const [savings, setSavings] = useState("");
    const [query, setQuery] = useState('');
    const [imageData, setImageData] = useState(null);
    const [overLimit, setOverLimit] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false);
    const [sortQuery, setSortQuery] = useState("cost");
    const [order_id, setOrder_id] = useState('');
    const [ascDesc, setAscDesc] = useState("asc");
    const [editOrder, setEditOrder] = useState(false);
    const [count, setCount] = useState(false);
    const limit = 6000000;
    const blobToBase64 = (blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise(resolve => {
            reader.onloadend = () => {
                resolve(reader.result);
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoad(true);
        if (!user_id) {
            window.location.pathname = '/login';
            alert('Not logged in');
            return;
        }
        if (overLimit) {
            alert('Image over 6 Mb');
            return;
        }
        let blob = "";
        if (imageData) {
            blob = await blobToBase64(imageData);
            blob = blob.split(',')[1];
        }
        // make call to server
        const createOrder = await axios({
            method: (editOrder ? 'PUT' : 'POST'),
            url: `${backendHost}/orders`,
            data: {
                order_name: title,
                vendor,
                order_id,
                date_of_purchase: purchaseDate,
                arrival_date: arrivalDate,
                tax,
                shipping,
                savings,
                user_id: user_id,
                image_url: blob
            }
        });
        { addOrder ? setAddOrder(false) : setEditOrder(false) };

        setVendor("");
        setArrivalDate("");
        setTax("");
        setShipping("");
        setSavings("");
        setPurchaseDate("");
        setTitle("");
        setLoading(true);
        setLoad(false);
    };
    useEffect(() => {
        AOS.init({ duration: 800 });
        AOS.refresh();
        let getOrders = (async () => {
            const res = await axios.get(`${backendHost}/orders`, {
                params: {
                    user_id: user_id,
                    ascDesc,
                    sortQuery,
                    query
                }
            });
            if (res.status === 203) {
                alert(res.data.msg);
            } else if (res.status === 200) {
                let data = res.data;
                let rowPlacement = [];
                setCount(data.length);
                for (let i = 0; i < data.length; i++) {
                    if (rowPlacement.length > 0 && rowPlacement[rowPlacement.length - 1].length < 2) {
                        rowPlacement[rowPlacement.length - 1].push(data[i]);
                    } else {
                        rowPlacement[rowPlacement.length] = [data[i]];
                    }
                }
                setOrders(rowPlacement);
            }
            setLoading(false);
        });
        getOrders();

    }, [loading]);
    return (
        <>
            <Container>
                <Row>
                    <Col xs={5} className="g-3 mb-3">
                        <InputGroup size={'sm'} >
                            <Button onClick={(e) => setAddOrder(true)} variant="outline-secondary"><IoIosAdd size='3rem' /></Button>
                        </InputGroup>
                        <div style={{ fontStyle: 'italic', color: 'gray' }}>Showing {count} results</div>
                    </Col>
                    <Col xs={6} className="g-3 mb-3">
                        <InputGroup size={'sm'} className="g-3 mb-3">
                            <FormControl
                                style={{
                                    borderTopLeftRadius: '25px',
                                    borderBottomLeftRadius: '25px'
                                }}
                                placeholder="Search by order name or vendor"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <Button variant="outline-secondary" onClick={() => setLoading(true)} style={{
                                borderTopRightRadius: '25px',
                                borderBottomRightRadius: '25px'
                            }}>
                                <MdSearch size='2rem' />
                            </Button>
                        </InputGroup>
                        <Col md={{ offset: 4 }} className="g-3 mb-3">
                            <InputGroup>
                                <Form.Select
                                    as="select"
                                    onChange={(e) => {
                                        setSortQuery(e.target.value);
                                    }}
                                    key={'right'}
                                >
                                    <option value="cost">Cost</option>
                                    <option value="items"># of Items</option>
                                    <option value="arrival_date">Arrival Date</option>
                                </Form.Select>
                                <Form.Select
                                    as="select"
                                    onChange={(e) => {
                                        setAscDesc(e.target.value);
                                    }}
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </Form.Select>
                            </InputGroup>
                        </Col>
                    </Col>
                </Row>
                {orders.map(order =>
                    <Row className="g-3 mb-3" key={order[0]['order_id']}>
                        <Col sm={12} md={6} data-aos='fade-right' data-aos-easing="ease-in-sine">
                            <OrderDetail
                                order_id={order[0]['order_id']}
                                order_name={order[0]['order_name']}
                                vendor={order[0]['vendor']}
                                total={order[0]['total']}
                                subtotal={order[0]['cost']}
                                tax={order[0]['tax']}
                                shipping={order[0]['shipping']}
                                savings={order[0]['savings']}
                                arrival_date={order[0]['arrival_date']}
                                date_of_purchase={order[0]['date_of_purchase']}
                                items={order[0]['items']}
                                image_url={order[0]['image_url']}
                                user_id={order[0]['user_id']}
                                reloadOrders={setLoading}
                                editOrder={editOrder}
                                editParams={[setTitle, setVendor, setPurchaseDate, setArrivalDate, setTax, setSavings, setShipping, setOrder_id]}
                                setEditOrder={setEditOrder} />
                        </Col>
                        {order.length > 1 ? (
                            <Col sm={12} md={6} data-aos='fade-left' data-aos-easing="ease-in-sine">
                                <OrderDetail
                                    order_id={order[1]['order_id']}
                                    order_name={order[1]['order_name']}
                                    vendor={order[1]['vendor']}
                                    total={order[1]['total']}
                                    subtotal={order[1]['cost']}
                                    tax={order[1]['tax']}
                                    shipping={order[1]['shipping']}
                                    savings={order[1]['savings']}
                                    arrival_date={order[1]['arrival_date']}
                                    date_of_purchase={order[1]['date_of_purchase']}
                                    items={order[1]['items']}
                                    image_url={order[1]['image_url']}
                                    user_id={order[1]['user_id']}
                                    reloadOrders={setLoading}
                                    editOrder={editOrder}
                                    editParams={[setTitle, setVendor, setPurchaseDate, setArrivalDate, setTax, setSavings, setShipping, setOrder_id]}
                                    setEditOrder={setEditOrder} />
                            </Col>
                        ) : ""}
                    </Row>
                )}
            </Container>

            <Modal show={addOrder || editOrder}
                // @ts-ignore
                fullscreen={addOrder} size='lg' onHide={() => {
                    setAddOrder(false);
                    setEditOrder(false);
                }}>
                <Modal.Header closeButton>
                    <Modal.Title>{editOrder ? "Edit Order" : "Add Order"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row className="g-3 mb-3">
                            <InputGroup>
                                <FormControl
                                    type="file"
                                    onClick={(e) => setImageData(null)}
                                    onChange={(e) => {
                                        // @ts-ignore
                                        setImageData(e.target.files[0]);
                                        // @ts-ignore
                                        if (parseInt(e.target.files[0].size) > limit) setOverLimit(true);
                                        else setOverLimit(false);
                                    }}
                                    accept="image/*"
                                />
                                {overLimit ? <InputGroup.Text><div style={{ color: 'red', fontWeight: "bolder" }}>Over 6 Mb</div></InputGroup.Text> : <InputGroup.Text><strong>6 Mb Limit</strong></InputGroup.Text>}
                            </InputGroup>
                        </Row>
                        <Row className="g-3 mb-3">
                            <Col md>
                                <FloatingLabel label="Vendor">
                                    <FormControl
                                        type="text"
                                        placeholder=" "
                                        value={vendor}
                                        onChange={(e) => setVendor(e.target.value)}
                                        required
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md>
                                <FloatingLabel label="Purchase Title">
                                    <FormControl
                                        type="text"
                                        placeholder='Keycult Unpolished No.2/65 W'
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row className="g-3 mb-3">
                            <Col sm>
                                <FloatingLabel label="Date of Purchase" className="mb-3">
                                    <FormControl
                                        autoFocus
                                        type="date"
                                        placeholder={''}
                                        value={purchaseDate}
                                        max={arrivalDate}
                                        onChange={(e) => {
                                            setPurchaseDate(e.target.value);
                                            if (!arrivalDate) {
                                                setArrivalDate(e.target.value);
                                            }
                                        }}
                                        required
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col sm>
                                <FloatingLabel label="Estimated Date of Arrival" className="mb-3">
                                    <FormControl
                                        type="date"
                                        placeholder={''}
                                        value={arrivalDate}
                                        min={purchaseDate}
                                        onChange={(e) => {
                                            setArrivalDate(e.target.value);
                                            if (!purchaseDate) {
                                                setPurchaseDate(e.target.value);
                                            }
                                        }}
                                        required
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row className="g-3 mb-3">
                            <Col md>
                                <FloatingLabel label="Tax" className="mb-3">
                                    <FormControl
                                        type="number"
                                        placeholder={' '}
                                        value={tax}
                                        onChange={(e) => setTax(e.target.value)}
                                        min={0.00}
                                        step="0.01"
                                        required
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md>
                                <FloatingLabel label="Shipping" className="mb-3">
                                    <FormControl
                                        type="number"
                                        placeholder={' '}
                                        value={shipping}
                                        onChange={(e) => setShipping(e.target.value)}
                                        min={0.00}
                                        step="0.01"
                                        required
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col md>
                                <FloatingLabel label="Savings" className="mb-3">
                                    <FormControl
                                        type="number"
                                        placeholder={' '}
                                        value={savings}
                                        onChange={(e) => setSavings(e.target.value)}
                                        min={0.00}
                                        step="0.01"
                                        required
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" disabled={load}>
                            {load ? <Spinner as="span" animation="border" size="sm" role="satus" aria-hidden="true" /> : (editOrder ? "Edit Order" : "Add Items")}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>

    )
}
export default Orders;