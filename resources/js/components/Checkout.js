import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class Checkout extends Component {

    constructor() {
        super();
        this.state = {
            cart: [],
            totalQuantity: 0,
            totalCostInUSD: 0.0,
            totalCostInEuro: 0.0,
            deliveryCostInUSD: 8.0,
            deliveryCostInEuros: 7.3,
            redirect: false
        }
    }

    confirmOrder() {
        const data = {
            quantity: this.state.totalQuantity,
            totalInEuros: this.state.totalCostInEuro,
            totalInUSD: this.state.totalCostInUSD,
            deliveryCostInEuros: this.state.deliveryCostInEuros,
            deliveryCostInUSD: this.state.deliveryCostInUSD,
            items: JSON.stringify(this.state.cart)
        };
        axios.post("/api/order", { ...data }).then((res) => {
            this.setState({ redirect: true });
        });
    }

    componentDidMount() {
        const { cart } = this.props.location.state;
        let totalQuantity = 0, totalCostInUSD = 0.0, totalCostInEuro = 0.0;
        cart.map((item) => {
            totalQuantity += item.quantity;
            totalCostInUSD += item.calculatedPrice;
        });
        totalCostInEuro = Number((totalCostInUSD * 0.91).toFixed(2));
        this.setState({ cart, totalQuantity, totalCostInUSD, totalCostInEuro });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to="/" />;
        }
        return (
            <div className="container chekout-container flex-center position-ref">
                <div className="row justify-content-center">
                    <div className="col-md">
                        <div className="card">
                            <div className="card-header">
                                <h4>Your Item Orders</h4>
                            </div>
                            <div className="card-body">
                                {this.state.cart.map((item, cartIndex) =>
                                    <div key={item.key}>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <img className="checkout-img" src={item.img} alt="Pizza Image" />
                                            </div>
                                            <div className="col-md-8">
                                                <div className="row">
                                                    <div className="col-md-12 text-left">
                                                        <h4>{cartIndex + 1}. {item.type}</h4>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                Quantity
                                                    </div>
                                                            <div className="col-md-6 text-center">
                                                                {item.quantity}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                Price
                                                        </div>
                                                            <div className="col-md-6 text-center">
                                                                $ {item.calculatedPrice} / € {(item.calculatedPrice * 0.91).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                Size
                                                    </div>
                                                            <div className="col-md-6 text-center">
                                                                {item.sizeCurrentValue}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                Crust
                                                        </div>
                                                            <div className="col-md-6 text-center">
                                                                {item.curstCurrentValue}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <hr />
                                    </div>
                                )}

                                <div className="row">
                                    <div className="col-md-6 text-center">
                                        Total Quantity :
                            </div>
                                    <div className="col-md-6 text-center">
                                        {this.state.totalQuantity}
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-md-6 text-center">
                                        Total Item Price :
                            </div>
                                    <div className="col-md-6 text-center">
                                        $ {this.state.totalCostInUSD} / € {this.state.totalCostInEuro}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 text-center">
                                        Delivery Charges :
                            </div>
                                    <div className="col-md-6 text-center">
                                        $ {this.state.deliveryCostInUSD} / € {this.state.deliveryCostInEuros}
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-md-6 text-center">
                                        Total Price :
                            </div>
                                    <div className="col-md-6 text-center">
                                        $ {this.state.totalCostInUSD + this.state.deliveryCostInUSD} / € {this.state.totalCostInEuro + this.state.deliveryCostInEuros}
                                    </div>
                                </div>

                                <hr />
                                <div className="row text-center">
                                    <div className="col-md-12">
                                        <button className="btn btn-outline-success" type="button" onClick={(e) => this.confirmOrder(e)}>
                                            <i className="fa fa-plus"></i> Place Order
                                </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}