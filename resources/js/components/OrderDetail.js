import React, { Component } from 'react';

export default class OrderDetail extends Component {

    constructor() {
        super();
        this.state = {
            items: [],
            quantity: 0,
            totalInUSD: 0.0,
            totalInEuros: 0.0,
            deliveryCostInUSD: 0.0,
            deliveryCostInEuros: 0.0
        };
    }

    componentDidMount() {
        const { quantity, totalInEuros, totalInUSD, deliveryCostInEuros, deliveryCostInUSD, items } = this.props.location.state.data;
        this.setState({ quantity, totalInEuros, totalInUSD, deliveryCostInEuros, deliveryCostInUSD, items });
    }

    render() {
        return (<div className="row justify-content-center">
            <div className="col-md">
                <div className="card">
                    <div className="card-header">
                        <h4>Order Details</h4>
                    </div>
                    <div className="card-body">
                        {this.state.items.map((item, cartIndex) =>
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
                                {this.state.quantity}
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-md-6 text-center">
                                Total Item Price :
                            </div>
                            <div className="col-md-6 text-center">
                                $ {this.state.totalInUSD} / € {this.state.totalInEuros}
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
                                $ {this.state.totalInUSD + this.state.deliveryCostInUSD} / € {this.state.totalInEuros + this.state.deliveryCostInEuros}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}