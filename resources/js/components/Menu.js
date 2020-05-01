import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Menu extends Component {
    constructor() {
        super();
        this.state = {
            pizzas: [],
            sizes: [{
                name: "Small(10')",
                value: "small",
                additionalPrice: 0
            }, {
                name: "Medium(12')",
                value: "medium",
                additionalPrice: 2
            }, {
                name: "Large(14')",
                value: "large",
                additionalPrice: 4
            }],
            crust: [{
                name: "Hand Tossed",
                value: "hand-tossed",
                additionalPrice: 0
            }, {
                name: "Fresh Pan Pizza",
                value: "fesh-pan",
                additionalPrice: 1
            }, {
                name: "Crunchy Thin Crust",
                value: "thin-crust",
                additionalPrice: 2
            }, {
                name: "Gluten Free Crust",
                value: "gluten-free",
                additionalPrice: 4
            }],
            currentValues: [],
            cart: []
        };
    }

    componentDidMount() {
        axios.get("/api/menu").then((res) => {
            let data = res.data;
            const currentValues = [];
            data = data.map((pizza) => {
                currentValues.push({
                    calculatedPrice: pizza.price,
                    sizeCurrentValue: "small",
                    curstCurrentValue: "hand-tossed",
                    quantity: 0
                });
                pizza.key = Math.round(Math.random() * 1000);
                return pizza;
            });
            this.setState({ pizzas: data, currentValues });
        });
    }

    onChangeCurst(event, pizzaIndex) {
        this.calculatePrice(pizzaIndex, this.state.currentValues[pizzaIndex].sizeCurrentValue, event.target.value);
    }

    onChangeSize(event, pizzaIndex) {
        this.calculatePrice(pizzaIndex, event.target.value, this.state.currentValues[pizzaIndex].curstCurrentValue);
    }

    calculatePrice(index, sizeCurrentValue, curstCurrentValue) {
        const selectedCrustIndex = this.state.crust.findIndex((curst) => curst.value === curstCurrentValue);
        const selectedSizeIndex = this.state.sizes.findIndex((size) => size.value === sizeCurrentValue);

        const currentPizzaPrice = this.state.pizzas[index].price + this.state.crust[selectedCrustIndex].additionalPrice + this.state.sizes[selectedSizeIndex].additionalPrice;

        this.updatePizzaArrayState(index, {
            calculatedPrice: currentPizzaPrice,
            sizeCurrentValue: sizeCurrentValue,
            curstCurrentValue: curstCurrentValue
        });
    }

    updatePizzaArrayState(index, itemAttributes) {
        const prevCurrentValues = this.state.currentValues;
        const currentPizzaValues = prevCurrentValues[index];
        if (itemAttributes && itemAttributes.quantity === 1) {
            itemAttributes.quantity = currentPizzaValues.quantity + 1;
        } else if (itemAttributes && itemAttributes.quantity === -1) {
            itemAttributes.quantity = currentPizzaValues.quantity - 1;
        } else if (itemAttributes && itemAttributes.quantity === 0) {
            itemAttributes.quantity = currentPizzaValues.quantity - 1;
        }
        const updatePizzaValues = Object.assign({}, currentPizzaValues, itemAttributes)
        prevCurrentValues[index] = updatePizzaValues;
        this.setState({ currentValues: prevCurrentValues });
    }

    updateCartState(index, itemAttributes) {
        const cartIndex = this.state.cart.findIndex((item) => {
            if (item.pizzaIndex === index &&
                item.sizeCurrentValue === this.state.currentValues[index].sizeCurrentValue &&
                item.curstCurrentValue === this.state.currentValues[index].curstCurrentValue) {
                return true
            }
        });
        const prevCartItemsArray = this.state.cart;
        if (cartIndex > -1) {
            const cartItem = prevCartItemsArray[cartIndex];
            Object.keys(itemAttributes).map((itemKey) => {
                if (itemKey === 'quantity') {
                    if (itemAttributes[itemKey] === 0) {
                        prevCartItemsArray.splice(cartIndex, 1);
                    } else if (itemAttributes[itemKey] === 1) {
                        cartItem[itemKey] = cartItem[itemKey] + 1;
                    } else {
                        cartItem[itemKey] = cartItem[itemKey] - 1;
                    }
                } else {
                    cartItem[itemKey] = itemAttributes[itemKey];
                }
            });
            this.setState({ cart: prevCartItemsArray });
        } else {
            const cartItem = {
                quantity: 1,
                pizzaIndex: index,
                calculatedPrice: this.state.currentValues[index].calculatedPrice,
                sizeCurrentValue: this.state.currentValues[index].sizeCurrentValue,
                curstCurrentValue: this.state.currentValues[index].curstCurrentValue,
                ...this.state.pizzas[index]
            };
            cartItem['key'] = Math.round(Math.random() * 1000);
            prevCartItemsArray.push(cartItem);
        }
    }

    addToCart(index, value) {
        if (value === 1) {
            this.updateCartState(index, { quantity: 1 });
            this.updatePizzaArrayState(index, { quantity: 1 });
        } else if (value === -1) {
            this.updateCartState(index, { quantity: -1 });
            this.updatePizzaArrayState(index, { quantity: -1 });
        } else {
            this.updateCartState(index, { quantity: 0 });
            this.updatePizzaArrayState(index, { quantity: 0 });
        }
    }

    renderMinusORTrashForCurrentValues(pizzaIndex) {
        if (this.state.currentValues[pizzaIndex].quantity > 1) {
            return (<button className="btn btn-outline-danger" type="button" onClick={(e) => this.addToCart(pizzaIndex, -1)}>
                <i className="fa fa-minus"></i>
            </button>);
        } else {
            return (<button className="btn btn-outline-danger" type="button" onClick={(e) => this.addToCart(pizzaIndex, 0)}>
                <i className="fa fa-trash"></i>
            </button>);
        }
    }

    renderMinusORTrashForCartValues(cartIndex) {
        if (this.state.cart[cartIndex].quantity > 1) {
            return (<button className="btn btn-outline-danger" type="button" onClick={(e) => this.addToCart(this.state.cart[cartIndex].pizzaIndex, -1)}>
                <i className="fa fa-minus"></i>
            </button>);
        } else {
            return (<button className="btn btn-outline-danger" type="button" onClick={(e) => this.addToCart(this.state.cart[cartIndex].pizzaIndex, 0)}>
                <i className="fa fa-trash"></i>
            </button>);
        }
    }

    render() {
        return (
            <div className="menu-container">
                <div className="row">
                    <div className="col-md-9">
                        <div className="row text-left">
                            {this.state.pizzas.map((pizza, pizzaIndex) =>
                                <div key={pizza.key} className="col-md-4 d-flex align-items-stretch">
                                    <div className="card">
                                        <img className="card-img-top" src={pizza.img} alt="Pizza Image" />

                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md">
                                                    <h5 name="type" className="pizza-type">{pizza.type}</h5>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md">
                                                    <div name="type" className="text-muted">{pizza.desc}</div>
                                                </div>
                                            </div>
                                            <br />
                                            <div className="row">
                                                <div className="col-md">
                                                    <label>
                                                        Size
                                                    <select className="form-control form-control-sm" name="size" id="size"
                                                            onChange={(e) => this.onChangeSize(e, pizzaIndex)} value={this.state.currentValues[pizzaIndex].sizeCurrentValue}>
                                                            {this.state.sizes.map((size, index) =>
                                                                <option key={index} value={size.value}>
                                                                    {size.name} - Extra ${size.additionalPrice}
                                                                </option>
                                                            )}
                                                        </select>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md">
                                                    <label>
                                                        Crust
                                                    <select className="form-control form-control-sm" name="crust" id="crust"
                                                            onChange={(e) => this.onChangeCurst(e, pizzaIndex)} value={this.state.currentValues[pizzaIndex].curstCurrentValue}>
                                                            {this.state.crust.map((crust, index) =>
                                                                <option key={index} value={crust.value}>
                                                                    {crust.name} - Extra ${crust.additionalPrice}
                                                                </option>
                                                            )}
                                                        </select>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md">
                                                    <div className="d-inline float-left">Price</div>
                                                    <div className="d-inline float-right" name="price">$ {this.state.currentValues[pizzaIndex].calculatedPrice}</div>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                {this.state.currentValues[pizzaIndex].quantity > 0 ?
                                                    <div className="row">
                                                        <div className="col-md">
                                                            <div className="input-group">
                                                                <div className="input-group-prepend">
                                                                    {/* {this.renderMinusORTrashForCurrentValues(pizzaIndex)} */}
                                                                </div>
                                                                <input type="number" className="form-control input-sm" readOnly value={this.state.currentValues[pizzaIndex].quantity} aria-label="" aria-describedby="basic-addon1" />
                                                                <div className="input-group-append">
                                                                    <button className="btn btn-outline-success" type="button" onClick={(e) => this.addToCart(pizzaIndex, 1)}>
                                                                        <i className="fa fa-plus"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="row">
                                                        <div className="col-md">
                                                            <button className="btn btn-success" onClick={(e) => this.addToCart(pizzaIndex, 1)}>Add To Cart</button>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="col-md cart">
                            <div className="text-left">
                                <div className="card">
                                    <div className="card-header">
                                        <h4>Cart</h4>
                                    </div>
                                    <div className="card-body">
                                        {this.state.cart.length > 0 ? (<div>
                                            <div className="cart-items">
                                                {this.state.cart.map((item, cartIndex) =>
                                                    <div key={item.key}>
                                                        <div className="row">
                                                            <div className="col-md">
                                                                {cartIndex + 1}. {item.type}
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                Quantity
                                                            </div>
                                                            <div className="col-md-6 text-center">
                                                                {item.quantity}
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                Price
                                                            </div>
                                                            <div className="col-md-6 text-center">
                                                                $ {item.calculatedPrice}
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="row">
                                                                <div className="col-md">
                                                                    <div className="input-group">
                                                                        <div className="input-group-prepend">
                                                                            {this.renderMinusORTrashForCartValues(cartIndex)}
                                                                        </div>
                                                                        <input type="number" className="form-control input-sm" readOnly value={this.state.cart[cartIndex].quantity} aria-label="" aria-describedby="basic-addon1" />
                                                                        <div className="input-group-append">
                                                                            <button className="btn btn-outline-success" type="button" onClick={(e) => this.addToCart(this.state.cart[cartIndex].pizzaIndex, 1)}>
                                                                                <i className="fa fa-plus"></i>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-center">
                                                <div className="row">
                                                    <div className="col-md">
                                                        <Link className="btn btn-success" to={{
                                                            pathname: '/checkout',
                                                            state: {
                                                                cart: this.state.cart
                                                            }
                                                        }}>
                                                            Checkout
                                                    </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>) : (
                                                <div>
                                                    <br /><br />
                                                    <div className="text-center">
                                                        No Item in Cart Yet!
                                                </div>
                                                    <br /><br />
                                                </div>
                                            )}
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


