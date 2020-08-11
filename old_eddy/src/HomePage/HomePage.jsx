import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userActions } from "../_actions";
import { userService } from "../_services";
import Questions from "../utils";

class CircularProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // Size of the enclosing square
    const sqSize = this.props.sqSize;
    // SVG centers the stroke width on the radius, subtract out so circle fits in square
    const radius = (this.props.sqSize - this.props.strokeWidth) / 2;
    // Enclose cicle in a circumscribing square
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    // Arc length at 100% coverage is the circle circumference
    const dashArray = radius * Math.PI * 2;
    // Scale 100% coverage overlay with the actual percent
    const dashOffset = dashArray - (dashArray * this.props.percentage) / 100;

    return (
      <svg
        width={this.props.sqSize}
        height={this.props.sqSize}
        viewBox={viewBox}
      >
        <circle
          className="circle-background"
          cx={this.props.sqSize / 2}
          cy={this.props.sqSize / 2}
          r={radius}
          strokeWidth={`${this.props.strokeWidth}px`}
        />
        <circle
          className="circle-progress"
          cx={this.props.sqSize / 2}
          cy={this.props.sqSize / 2}
          r={radius}
          strokeWidth={`${this.props.strokeWidth}px`}
          // Start progress marker at 12 O'Clock
          transform={`rotate(-90 ${this.props.sqSize / 2} ${
            this.props.sqSize / 2
          })`}
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
          }}
        />
        <text
          className="circle-text"
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
        >
          {`${this.props.text}`}
        </text>
      </svg>
    );
  }
}

CircularProgressBar.defaultProps = {
  sqSize: 200,
  percentage: 25,
  strokeWidth: 10,
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      percentage: 25,
    };

    this.handleChangeEvent = this.handleChangeEvent.bind(this);
    this.stopSuccessNotification = this.stopSuccessNotification.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  handleChangeEvent(event) {
    this.setState({
      percentage: event.target.value,
    });
  }
}

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: -1,
      game_id: "",
      score: 0,
      max_score: 5,
      current_score: 0,
      showSuccess: false,
      width: 600,
      height: 800,
    };
  }

  componentDidMount() {
    window.document.addEventListener(
      "doneQuestion",
      this.handleFrameDoneQuestion.bind(this),
      false
    );
    window.document.addEventListener(
      "donePlaying",
      this.handleFrameDonePlaying.bind(this),
      false
    );
    this.goHome = this.goHome.bind(this);
    console.log("addEventListener");
    this.handleFrameDonePlaying();

    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("message", this.handleFrameTasks);
    window.removeEventListener("resize", this.updateWindowDimensions);
  }
  stopSuccessNotification(e) {
    this.setState({ showSuccess: false });
  }
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  handleFrameDoneQuestion(e) {
    console.log("handleFrameDoneQuestion ");
    console.log(e);
    var showSuccess = false;
    var max_score = this.state.max_score;

    if (e.detail.isCorrect) {
      var new_score = this.state.current_score + 1;
      if (new_score >= this.state.max_score) {
        new_score = new_score % this.state.max_score;
        max_score = Math.min(20, this.state.max_score + 1);
        showSuccess = true;
        setTimeout(this.stopSuccessNotification.bind(this), 3500);
      }

      this.setState({
        current_score: new_score,
        showSuccess: showSuccess,
        score: this.state.score + 1,
        max_score: max_score,
      });
    }
    userService.updateAnswer(e.detail);
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
          if (value.questions[i].data.body.indexOf("http") < 0)
            value.questions[i].data.body = value.questions[i].data.body.replace(
              "=",
              ""
            );
        }
        this.setState({
          //game_id: 'drop_the_answer',
          game_id: value.game.title.toLowerCase(),
          questionsString: JSON.stringify(value.questions),
        });
        // expected output: "Success!"
      }.bind(this)
    );
  }
  goHome() {
    this.props.history.push("/home2");
  }

  shouldComponentUpdate(nextProps, nextState) {
    let check =
      this.state.user_id !== nextState.user_id ||
      this.state.game_id !== nextState.game_id ||
      this.state.current_score !== nextState.current_score ||
      this.state.showSuccess !== nextState.showSuccess ||
      this.state.height !== nextState.height ||
      this.state.width !== nextState.width ||
      this.state.questionsString !== nextState.questionsString;
    return check;
  }
  render() {
    var token = localStorage.getItem("token");
    var image = "./src/assets/Tree.jpg";
    var successFig =
      "./src/assets/wizard" + Math.floor(Math.random() * 6 + 1) + ".gif";
    console.log(successFig);
    if (token === null || !this.state.questionsString) {
      return <div className="App" />;
    }
    const style = {
      backgroundImage: "url(" + image + ")",
      backgroundSize: "cover",
    };
    var overlay_style = {
      position: "absolute",
      top: "65px",
      //left:'10px',
      height: "550px",
      width: Math.min(640000, this.state.width),
      //'z-index': '0',
      //backgroundSize:' auto 100%',
      //'backgroundSize': '100px',
      transition: ".5s ease-in-out",
      background: "url(" + successFig + ") no-repeat center center fixed",
    };
    console.log(this.ifr ? this.ifr.top : 0);

    return (
      <div
        className="App"
        width={Math.min(640000, this.state.width)} //{Math.floor(this.state.width * 0.8)}
        height={Math.min(550, this.state.height)}
      >
        <div>
          <table style={{ width: "100%", padding: "10px" }}>
            <tbody>
              <tr>
                <td size="40%" style={{ padding: "7px" }}>
                  <Link to="/login" style={{ padding: "7px" }}>
                    Logout
                  </Link>
                </td>
                <td align="left" style={{ padding: "7px" }}>
                  {" "}
                  <CircularProgressBar
                    strokeWidth="5"
                    sqSize="50"
                    text={this.state.score}
                    percentage={Math.round(
                      (100 * this.state.current_score) / this.state.max_score
                    )}
                  />
                </td>
                <td align="right">
                  <img
                    alt=""
                    onClick={this.goHome}
                    width={"32px"}
                    src={
                      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/YouTube_play_buttom_icon_%282013-2017%29.svg/32px-YouTube_play_buttom_icon_%282013-2017%29.svg.png"
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="App-intro"></div>

        <iframe
          src={
            "./public/" +
            this.state.game_id +
            "/index.html?questions=" +
            encodeURIComponent(this.state.questionsString)
          }
          title="game"
          ref={(f) => (this.ifr = f)}
          frameBorder={"0"}
          width={Math.min(640000, this.state.width)}
          height="550"
          style={style}
        ></iframe>

        {this.state.showSuccess ? (
          <div className="overlayImage" style={overlay_style}></div>
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  return {
    user,
    users,
  };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };
