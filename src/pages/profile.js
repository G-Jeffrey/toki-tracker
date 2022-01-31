// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Container, FormControl, FloatingLabel } from 'react-bootstrap';
import axios from 'axios';
const backendHost = process.env.REACT_APP_BACKEND_URL;
const Profile = ({ user_id, userparams }) => {
    const [start_date, setStartDate] = useState('2000-01-01');
    const [data, setData] = useState({});
    const [end_date, setEndDate] = useState('2100-01-01');
    const [loading, setLoading] = useState(true);
    const [vendors, setVendors] = useState({});
    useEffect(() => {
        const getItems = (async () => {
            const res = await axios.get(`${backendHost}items`, {
                params: {
                    user_id,
                    start_date,
                    end_date
                }
            });
            if (res.status === 200) {
                let list = {};
                for (let i = 0; i < res.data.length; i++) {
                    if (list[res.data[i]['category']]) {
                        list[res.data[i]['category']][0]++;
                        list[res.data[i]['category']][1] += parseFloat(res.data[i]['item_price']);
                    } else {
                        list[res.data[i]['category']] = [1, parseFloat(res.data[i]['item_price'])];
                    }
                }
                let total = 0, items = 0;
                for (let i in list) {
                    total += list[i][1];
                    items += list[i][0];
                }
                list['Total'] = [items, total];
                await setData(list);
            } else if (res.status === 203) {
                alert(res.data.msg);
            } else {
                alert('Internal server error, please try again later.')
            }
            let data = await axios.get(`${backendHost}orders`, {
                params: {
                    user_id,
                    start_date: start_date,
                    end_date: end_date
                }
            });
            if (data.status === 200) {
                let vendorInfo = {};
                data = data.data;
                for (let i = 0; i < data.length; i++) {
                    if (vendorInfo[data[i]['vendor']]) {
                        vendorInfo[data[i]['vendor']][0]++;
                        vendorInfo[data[i]['vendor']][1] += data[i]['items'];
                        vendorInfo[data[i]['vendor']][2] += parseFloat(data[i]['total']);
                    } else {
                        vendorInfo[data[i]['vendor']] = [1, data[i]['items'], parseFloat(data[i]['total'])]
                    }
                }
                setVendors(vendorInfo);
            } else if (data.status === 203) {
                alert(data.data.msg);
            } else {
                alert('Internal server error, please try again later!');
            }
            setLoading(false);
        });

        getItems();

    }, [loading])
    return (

        <>
            <div className='mt-3 p-4 mb-4'>
                <center>
                    <div style={{ fontWeight: 'bolder', fontSize: '5vw' }}>{userparams['username']}</div>
                    <div style={{ fontStyle: 'italics', fontSize: '2vw' }}>{userparams['first_name']} {userparams['last_name']}</div>
                </center>
            </div>
            <Container>
                <Row className="g-3 mb-3">
                    <Col xs={{ offset: 3, span: 3 }}>
                        <FloatingLabel label="Start Date">
                            <FormControl
                                type="date"
                                onChange={(e)=>{
                                    setStartDate(e.target.value);
                                    setLoading(true);
                                }}
                                max={end_date}/>
                        </FloatingLabel>
                    </Col>
                    <Col xs={3}>
                        <FloatingLabel label="End Date">
                            <FormControl
                                type="date"
                                onChange={(e)=>{
                                    setEndDate(e.target.value);
                                    setLoading(true);
                                }}
                                min={start_date}/>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="g-3 mb-3">
                    <Col>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>
                                        Items
                                    </th>
                                    <th>
                                        Cost
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Keyboards</th>
                                    <td>{data['Keyboard'] ? data['Keyboard'][0] : '0'}</td>
                                    <td>${data['Keyboard'] ? data['Keyboard'][1].toFixed(2) : '0.00'}</td>
                                </tr>
                                <tr>
                                    <th>Keycaps</th>
                                    <td>{data['Keycaps'] ? data['Keycaps'][0] : '0'}</td>
                                    <td>${data['Keycaps'] ? data['Keycaps'][1].toFixed(2) : '0.00'}</td>
                                </tr>
                                <tr>
                                    <th>Switches</th>
                                    <td>{data['Switches'] ? data['Switches'][0] : '0'}</td>
                                    <td>${data['Switches'] ? data['Switches'][1].toFixed(2) : '0.00'}</td>
                                </tr>
                                <tr>
                                    <th>Artisans</th>
                                    <td>{data['Artisans'] ? data['Artisans'][0] : '0'}</td>
                                    <td>${data['Artisans'] ? data['Artisans'][1].toFixed(2) : '0.00'}</td>
                                </tr>
                                <tr>
                                    <th>Misc</th>
                                    <td>{data['Misc'] ? data['Misc'][0] : '0'}</td>
                                    <td>${data['Misc'] ? data['Misc'][1].toFixed(2) : '0.00'}</td>
                                </tr>
                                <tr>
                                    <th>Total</th>
                                    <th>{data['Total'] ? data['Total'][0] : "0"}</th>
                                    <th>${data['Total'] ? data['Total'][1].toFixed(2) : "0.00"}</th>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col>
                        <Table striped bordered>
                            <thead >
                                <tr>
                                    <th></th>
                                    <th>
                                        Orders
                                    </th>
                                    <th>
                                        Items
                                    </th>
                                    <th>
                                       Total Cost
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(vendors).map((vendor, i) =>
                                    <tr key={i}>
                                        <th>{vendor}</th>
                                        <td>{vendors[vendor][0]}</td>
                                        <td>{vendors[vendor][1]}</td>
                                        <td>${vendors[vendor][2]}</td>
                                    </tr>)}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
export default Profile;