import React, { Component } from 'react'
//import 'tachyons/css/tachyons.css'

import fetch from 'isomorphic-fetch'
import Search from './search'
import Videos from './videos'

const url = 'https://youtube-api.now.sh'
const code = 'codeisfun'

class YoutubeSearch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      videos: []
    }
    this.search = this.search.bind(this)
  }
  search (text) {
    fetch(`${url}/?q=${encodeURI(text)}&code=${code}`)
      .then(res => res.json())
      .then(json => this.setState({videos: json}))

  }
  componentDidMount () {
    const searchText = 'minnie mouse'
    this.search(searchText)
  }

 

  render() {
    return (
      <div >
        <Search search={this.search} />
        <Videos videos={this.state.videos}  onVideoSelected={this.props.onVideoSelected} />
      </div>
    );
  }
}

export default YoutubeSearch;
