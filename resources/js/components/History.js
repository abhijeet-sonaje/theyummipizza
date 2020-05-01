import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import OrderDetail from './OrderDetail';
import axios from 'axios';

export default class History extends Component {

    constructor() {
        super();
        this.state = {
            orders: []
        };
    }

    componentDidMount() {
        axios.get('/api/order').then((res) => {
            const data = res.data.map((order) => {
                order.items = JSON.parse(order.items);
                return order;
            });
            console.log(data);
            this.setState({ orders: data });
        });
    }

    render() {
        return (
            <Router>
                <div className="container">
                    <Route exact={true} path="/home" render={() => (
                        <div className="row justify-content-center">
                            <div className="col-md-12">
                                <table className="table table-striped">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Order Id</th>
                                            <th scope="col">Pizza Quantity</th>
                                            <th scope="col">Total</th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.orders.map((order, index) =>
                                            <tr key={order.id}>
                                                <th scope="row">{index + 1}</th>
                                                <td>#{order.id}</td>
                                                <td>{order.quantity}</td>
                                                <td>$ {order.totalInUSD} / € {order.totalInEuros}</td>
                                                <td>
                                                    <Link className="btn btn-success" to={{
                                                        pathname: '/order',
                                                        state: {
                                                            data: order
                                                        }
                                                    }}>
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )} />

                    <Route path="/order" component={OrderDetail} />
                </div>
            </Router>
        );
    }
}

if (document.getElementById('orders-app')) {
    ReactDOM.render(<History />, document.getElementById('orders-app'));
}
