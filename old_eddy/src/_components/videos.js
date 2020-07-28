import React, { Component } from 'react'
import { map, pathOr, propEq, filter } from 'ramda'

class Videos extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const video = (video) => {
      return (
        <div key={video.id} className="ba br3 pa4 mv2 bg-light-gray b--red">
          <a  onClick={() => this.props.onVideoSelected(video.id)}   target="_blank">
            <img className="w-100" width={'200px'} height={'auto'} src={pathOr(
            'https://placeholdit.imgix.net/~text?txtsize=28&txt=300%C3%97300&w=100&h=100',
            ['thumbnails', 'high', 'url'], video)} alt={video.title} />
          </a>
         
          <div className="cf">
          <label  style={{maxWidth:'200px', flex: 1, flexWrap: 'wrap'}} className="form-label">{video.title}</label>
        
          
          <div>
            <a
              className="fr pa2 ba br2 bg-midnight-blue no-underline"
              target="_blank"
              onClick={() => this.props.onVideoSelected(video.id)}
            >Watch</a>
          </div>
          </div>
        </div>
      )
    }

    const videosOnly = filter(propEq('kind', 'youtube#video'), this.props.videos)

    return (
      <div>
        {propEq('length', 0, videosOnly) ? <div>No Videos Found...</div> : null}
        {map(video, videosOnly)}
      </div>
    )
  }
}



export default Videos
