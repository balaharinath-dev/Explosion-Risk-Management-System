import React from 'react';
import style from '../utilities/textInput.module.css';
import { Form } from 'react-bootstrap';
import textInputType from '../models/textInput';

const SelectInput:React.FC<textInputType>=({svgLink,invalidState,...rest})=>{
    return (
        <Form.Group className={`${style.width}`}>
            <div className={`d-flex flex-row justify-content-center align-items-center w-100`}>
                <img className={`${style.svg} me-2`} src={svgLink} alt={svgLink}/>
                <Form.Select className={`${invalidState?style.selectValid:style.selectInvalid} p-1`} {...rest}>
                    <option value="">Role</option>
                    <option value="Admin-HINCORP">Admin-HINCORP</option>
                    <option value="Employee-HINCORP">Employee-HINCORP</option>
                </Form.Select>
            </div>
        </Form.Group>
    );
}

export default SelectInput;