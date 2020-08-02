import React, { Component } from 'react'
import Input from '../_components/Input';
import Button from '../_components/Button';

class Search extends Component {
  constructor() {
    super()
    this.state = {
      searchText: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange (e) {
    this.setState({searchText: e.target.value})
  }
  handleSubmit (e) {
    e.preventDefault()
    this.props.search(this.state.searchText)
    this.setState({searchText: ''})
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset className="b--white pa0">
          <Input inputType={'text'}
          name={'age'}
          title={'Search:'}
          value={this.state.searchText}
          placeholder={'type title to search...'}
          handleChange={this.handleChange} />
          
        </fieldset>
        <div className="cf">
        <Button
          action={this.handleSubmit}
          type={'primary'}
          title={'Search'}
          style={buttonStyle}
        />
       
        </div>
      </form>
    )
  }
}

const buttonStyle = {
  margin: '10px 10px 10px 10px'
}
//   <Button className="ba br2 white pa2 bg-blue mt2 w-100">Search</button>
export default Search
