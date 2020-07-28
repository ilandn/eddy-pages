import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userActions } from "../_actions";
import { userService } from "../_services";
import YouTube from "@u-wave/react-youtube";
import YoutubeSearch from "../_components/YoutubeSearch";
import Questions from "../utils";
import SplitterLayout from "react-splitter-layout";

class HomePage2 extends React.Component {
	constructor(props) {
		super(props);

		this.handlePlayerPause = this.handlePlayerPause.bind(this);
		this.handlePlayerPlay = this.handlePlayerPlay.bind(this);
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.state = {
			user_id: -1,
			game_id: "",
			videoPaused: false,
			playNow: false,
			pauseTime: 30 * 1000,
			width: 600,
			height: 800,
			videoId: "gFk3tPRVi4Q"
		};
	}

	componentDidMount() {
		window.document.addEventListener(
			"message",
			this.handleFrameTasks.bind(this)
		);
		window.document.addEventListener(
			"donePlaying",
			this.handleFrameDonePlaying.bind(this),
			false
		);
		this.updateWindowDimensions();
		window.addEventListener("resize", this.updateWindowDimensions);

		console.log("addEventListener");
		this.handleFrameDonePlaying();
	}
	componentWillUnmount() {
		window.removeEventListener("message", this.handleFrameTasks);
		window.removeEventListener("resize", this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	handleFrameDonePlaying(e) {
		console.log("handleFrameDonePlaying");
		userActions.play().then(
			function (value) {
				//var question = new Questions(value.questions, function(a){return;})
				//question.newQuestion();
				if (!value || !value.questions || !value.questions.length) {
					this.props.dispatch(userActions.logout());
				}
				console.log(value);
				for (var i = 0; i < value.questions.length; i++) {
					value.questions[i].data.body = value.questions[i].data.body.replace(
						"=",
						""
					);
				}
				this.setState({
					videoPaused: false,
					playNow: false,
					game_id: value.game.title,
					questionsString: JSON.stringify(value.questions)
				});
				setTimeout(
					function () {
						console.log("stop pausing");
						this.setState({ videoPaused: true, playNow: true });
					}.bind(this),
					this.state.pauseTime
				);
				// expected output: s"Success!"
			}.bind(this)
		);
	}

	handlePlayerPause() {
		this.setState({ videoPaused: true });
	}

	handlePlayerPlay() {
		this.setState({ videoPaused: false });
	}

	handleFrameTasks(e) {
		console.log("handleFrameTasks");
		//if(e.data.from.iframe === "load_products") {
		console.log(e.detail);
		//}
	}
	shouldComponentUpdate(nextProps, nextState) {
		let check =
			this.state.user_id !== nextState.user_id ||
			this.state.game_id !== nextState.game_id ||
			this.state.videoPaused !== nextState.videoPaused ||
			this.state.height !== nextState.height ||
			this.state.width !== nextState.width ||
			this.state.questionsString !== nextState.questionsString ||
			this.state.videoId !== nextState.videoId;
		return check;
	}

	onVideoSelected(videoId) {
		console.log(videoId);
		this.setState({ videoId: videoId });
	}

	render() {
		var token = localStorage.getItem("token");
		var image =
			"http://frontrowcentral.com/wp-content/uploads/2017/05/Guardians-of-the-Galaxy-Vol-2-Baby-Groot-Waving.jpg";
		if (token === null || !this.state.questionsString) {
			return <div className="App" />;
		}
		const style = {
			backgroundImage: "url(" + image + ")",
			backgroundSize: "cover"
		};

		return (
			<div
				className="App"
				width={this.state.width} //{Math.floor(this.state.width * 0.8)}
				height={this.state.height} //{Math.floor(this.state.height * 0.8)}
			/*style={{ position: "absolute", top: "50px", left: "0px"  }}*/
			>
				<div>
					<YouTube
						key="player"
						video={this.state.videoId}
						width={Math.min(640000, this.state.width)} //{Math.floor(this.state.width * 0.8)}
						height={Math.min(550, this.state.height)} //{this.state.height }
						/*style={{ position: "absolute", top: "50px", left: "0px" }}*/
						controls={false}
						autoplay
						paused={this.state.videoPaused}
						onPause={this.handlePlayerPause}
						onPlaying={this.handlePlayerPlay}
					/>
					{this.state.videoPaused && this.state.playNow ? (
						<div style={{ backgroundColor: "rgba(255,255,255,0.7)" }}>
							<iframe
								src={
									"./public/" +
									'atcUT'+//this.state.game_id +
									"/index.html?questions=" +
									encodeURI(this.state.questionsString)
								}
								title="game"
								ref={f => (this.ifr = f)}
								frameBorder={"0"}
								width={Math.min(64000, this.state.width)} 
								height="550"
								style={{
									/*float: "right",
									overflow: "visible",
									position: "relative",
									zIndex: 1000,*/
											  position: "absolute",
											  //left: "0px",
											  top: "0px",
											  backgroundColor: "rgba(255,255,255,0.5)"
											}}
										  />
            </div>
					) : null}
				</div>
				<div>
					<YoutubeSearch onVideoSelected={this.onVideoSelected.bind(this)} />
				</div>
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

const connectedHomePage2 = connect(mapStateToProps)(HomePage2);
export { connectedHomePage2 as HomePage2 };
