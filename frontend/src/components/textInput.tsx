import React from 'react';
import style from '../utilities/textInput.module.css';
import { Form } from 'react-bootstrap';
import textInputType from '../models/textInput';

const TextInput:React.FC<textInputType>=({svgLink,invalidState,...rest})=>{
    return (
        <Form.Group>
            <div className={`d-flex flex-row justify-content-center align-items-center`}>
                <img className={`${style.svg} me-2`} src={svgLink} alt={svgLink}/>
                <Form.Control className={`${invalidState?style.inputField:style.invalidInput} px-1`} {...rest}/>
            </div>
        </Form.Group>
    );
}

export default TextInput;