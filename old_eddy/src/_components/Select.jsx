import React from 'react';


const Select = (props) => {
	return(<div className="form-group">
			<label htmlFor={props.name} className="form-label">{props.title}</label>
			<input name={props.name} value = {props.value} id = {props.name} list={props.name + "options"}
			onChange={props.handleChange}
			className="form-control"/>
		    <datalist id = {props.name + "options"}>
		      {props.options.map(option => {
		        return (
		          <option
		            key={option}
		            value={option}
		            label={option}>{option}</option>
		        );
		      })}
		    </datalist >
  </div>)
}

export default Select;