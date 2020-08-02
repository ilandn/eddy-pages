import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
//import { Link } from 'react-router-dom';
import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute } from '../_components';
import { HomePage } from '../HomePage';
import { HomePage2 } from '../HomePage2';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';

class App extends React.Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }

    render() {
        const { alert } = this.props;
		const styles = {
			position: 'absolute',
			top: 0,    // computed based on child and parent's height
				// computed based on child and parent's width
		  };
		var currentLocation = window.location.pathname;
		
		var className=(currentLocation==="/login" || currentLocation==="/register") ? 'jumbotron':'hidden';
        return (
			<div>
				<div>
					<div className={className}>
					</div>
				</div>
				<div className="container" style={styles}>
					<div className="ddd">
						{alert.message &&
							<div className={`alert ${alert.type}`}>{alert.message}</div>
						}
						<Router history={history}>
							<div>
								<PrivateRoute exact path="/" component={HomePage} />
								<Route exact path="/home2" component={HomePage2} />
								<Route path="/login" component={LoginPage} />
								<Route path="/register" component={RegisterPage} />
							</div>
						</Router>
					</div>
				</div>
			</div>
        );
    }
}
//col-sm-8 col-sm-offset-2

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }; 