import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import Questions from '../utils';

class HomePage extends React.Component {
    constructor(props) {
		super(props);

		this.state = {
			user_id: -1,
			game_id: "",
		};
  }

	componentDidMount() {
		 window.document.addEventListener("message", this.handleFrameTasks.bind(this));
		 window.document.addEventListener('donePlaying', this.handleFrameDonePlaying.bind(this), false);
		 console.log("addEventListener");
		 this.handleFrameDonePlaying();
	 }
	 componentWillUnmount() {
		 window.removeEventListener("message", this.handleFrameTasks);
	 } 

	 
	 handleFrameDonePlaying(e){
		 console.log("handleFrameDonePlaying")
		 userActions.play().then(function(value) {
		 //var question = new Questions(value.questions, function(a){return;})
		 //question.newQuestion();
		 if (!value || !value.questions|| !value.questions.length){
			this.props.dispatch(userActions.logout());


		 }
		console.log(value);
		for (var i=0; i < value.questions.length;i++){
			value.questions[i].data.body = value.questions[i].data.body.replace("=","");
		}
		this.setState({
						game_id: value.game.title,
						questionsString: JSON.stringify(value.questions)
					});
  // expected output: "Success!"
}.bind(this), this.props.dispatch(userActions.logout()))
		 
	 }
	 
	 handleFrameTasks(e){
		 console.log("handleFrameTasks")
		 //if(e.data.from.iframe === "load_products") {
			 console.log(e.detail);
		 //}
	 }
	shouldComponentUpdate(nextProps, nextState){
		let check = this.state.user_id !== nextState.user_id ||
		this.state.game_id !== nextState.game_id ||
		this.state.questionsString !== nextState.questionsString;
		return check;
	}
  render() {
  var token = localStorage.getItem('token');
  var image = "http://frontrowcentral.com/wp-content/uploads/2017/05/Guardians-of-the-Galaxy-Vol-2-Baby-Groot-Waving.jpg"
  if (token === null || !this.state.questionsString){
	return (<div className="App" />);
	}
	const style = {
      backgroundImage: "url("+image+")",
	  backgroundSize: "cover"
    }
	return (
	  <div className="App"> 
	  <p>
                    <Link to="/login">Logout</Link>
                </p>
		<p className="App-intro">
		</p>
		<iframe src={"./public/"+this.state.game_id+"/index.html?questions="+encodeURI(this.state.questionsString)}
		title="game" ref={(f) => this.ifr = f }
		frameBorder={'0'}
		width="800" height="550"
		 style={style}
		/>
	  </div>
	);
  }
}

function mapStateToProps(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return {
        user,
        users
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };