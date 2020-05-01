import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import Menu from './menu';
import Checkout from './Checkout';

export default class App extends Component {

    render() {
        return (
            <Router>
                <div>
                    <Route exact={true} path="/" render={() => (
                        <div className="flex-center position-ref full-height">
                            <div className="row justify-content-center">
                                <div className="col-md-12">
                                    <img className="main-image" src="/img/pizza-name.jpg" alt="Pizza Name Image" />
                                    <div className="title blue m-b-md">
                                        The Yummi Pizza
                                </div>
                                    <div>
                                        <Link to={"/menu"}>
                                            Order Now
                                    </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )} />

                    <Route path="/menu" component={Menu} />
                    <Route path="/checkout" component={Checkout} />
                </div>
            </Router>
        );
    }
}

if (document.getElementById('react-app')) {
    ReactDOM.render(<App />, document.getElementById('react-app'));
}
