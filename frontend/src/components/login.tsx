import React, { useState } from "react";
import style from "../utilities/login.module.css";
import onLoginType from "../models/onLogin";
import industryIDSVG from "../utilities/imgs/industryID.svg";
import passwordSVG from "../utilities/imgs/password.svg";
import roleSVG from "../utilities/imgs/role.svg";
import loginJPG from "../utilities/imgs/login.jpg";
import userSVG from "../utilities/imgs/user.svg";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import TextInput from "./textInput";
import loginCredentials from "../models/login";
import SelectInput from "./selectInput";

const Login:React.FC<onLoginType>=({onLogin})=>{

    const [loginCred,setLoginCred]=useState<loginCredentials>({
        industryid:"",
        password:"",
        role:"",
    });

    const [error,setError]=useState<{[key:string]:string}>({});

    const [invalidState,setInvalidState]=useState<{[key:string]:boolean}>({
        industryid:true,
        password:true,
        role:true,
    });

    const handleInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setLoginCred({
            ...loginCred,[e.target.name]:e.target.value,
        })  
    }

    const handleSelectChange=(e:React.ChangeEvent<HTMLSelectElement>)=>{
        setLoginCred({
            ...loginCred,[e.target.name]:e.target.value,
        })  
    }

    const handleSubmit=(e:React.FormEvent)=>{
        e.preventDefault();
        const validationError:{[key:string]:string}={};
        const invalidStateVar:{[key:string]:boolean}={};
        if(!(loginCred.industryid.trim())){
            validationError.industryid="Enter a valid Industry ID !";
            invalidStateVar.industryid=false;
        }
        else{
            invalidStateVar.industryid=true;
        }
        if(!loginCred.password.trim()){
            validationError.password="Enter a valid password !";
            invalidStateVar.password=false;
        }
        else{
            invalidStateVar.password=true;
        }
        if(!loginCred.role.trim()){
            validationError.role="Enter a valid role !";
            invalidStateVar.role=false;
        }
        else{
            invalidStateVar.role=true;
        }
        if(Object.keys(validationError).length>0){
            setError(validationError);
            setInvalidState(invalidStateVar);
        }
        else{
            setError({});
            setInvalidState({
                industryid:true,
                password:true,
                role:true,
            });
            fetch("http://localhost:5000/login",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                credentials:"include",
                body:JSON.stringify(loginCred),
            }).then(response=>{
                if(!response.ok&&response.status===404){
                    throw new Error("Username not found");
                }
                if(!response.ok&&response.status===406){
                    throw new Error("Invalid password");
                }
                if(!response.ok&&response.status===407){
                    throw new Error("Invalid role");
                }
                if(response.ok){
                    onLogin(loginCred.industryid,loginCred.role);
                }
            }).catch(error=>{
                if(error.message==="Username not found"){
                    validationError.username=error.message;
                    invalidStateVar.username=false;
                }
                if(error.message==="Invalid password"){
                    validationError.password=error.message;
                    invalidStateVar.password=false;
                }
                if(error.message==="Invalid role"){
                    validationError.role=error.message;
                    invalidStateVar.role=false;
                }
                setError(validationError);
                setInvalidState(invalidStateVar);
            });
        }
    }

    return (
        <div className={`${style.mainContainer}`}>
        <Container className={`m-0 p-0 border border-dark rounded shadow`}>
            <Row className={`d-flex justify-content-center align-items-center p-0 m-0`}>
                <Col className={`p-0`} xl={12}>
                    <Row className={`d-flex justify-content-center align-items-center p-0 m-0`}>
                        <Col className={`p-0 d-none d-lg-block ${style.nameContainer}`} xl={6}>
                            <img 
                                className={`${style.img}`} 
                                src={loginJPG} 
                                alt={loginJPG} />
                            <div className={`${style.companyName}`}>Hindustan Corp | ERMS</div>
                        </Col>
                        <Col className={`p-0`} xl={6}>
                            <Form onSubmit={handleSubmit}>
                                <Row className={`d-flex justify-content-center align-items-center p-0 m-0`}>
                                    <Col className={`d-flex justify-content-center align-items-center p-0 m-0 mb-5 mt-4 mt-lg-0`} xl={12}>
                                        <img 
                                            src={userSVG} 
                                            alt={userSVG} 
                                            width={50} 
                                            height={50}/>
                                    </Col>
                                    <Col className={`d-flex flex-column justify-content-center align-items-center p-0 m-0 mb-3`} xl={12}>
                                        <TextInput
                                            onChange={handleInputChange} 
                                            type="text" 
                                            svgLink={industryIDSVG} 
                                            placeholder="Industry ID" 
                                            name="industryid" 
                                            value={loginCred.industryid}
                                            invalidState={invalidState.industryid}/>
                                        <Form.Control.Feedback type="invalid" className={`d-flex justify-content-center mt-2`}>{error.industryid}</Form.Control.Feedback>
                                    </Col>
                                    <Col className={`d-flex flex-column justify-content-center align-items-center p-0 m-0 mb-3`} xl={12}>
                                        <TextInput
                                            onChange={handleInputChange} 
                                            type="password" 
                                            svgLink={passwordSVG} 
                                            placeholder="Password" 
                                            name="password"
                                            autoComplete="off"
                                            value={loginCred.password}
                                            invalidState={invalidState.password}/>
                                        <Form.Control.Feedback type="invalid" className={`d-flex justify-content-center mt-2`}>{error.password}</Form.Control.Feedback>
                                    </Col>
                                    <Col className={`d-flex flex-column justify-content-center align-items-center p-0 m-0 mb-5`} xl={12}>
                                        <SelectInput
                                            onChange={handleSelectChange}
                                            svgLink={roleSVG}
                                            name="role"
                                            value={loginCred.role}
                                            invalidState={invalidState.role}/>
                                        <Form.Control.Feedback type="invalid" className={`d-flex justify-content-center mt-2`}>{error.role}</Form.Control.Feedback>
                                    </Col>
                                    <Col className={`d-flex justify-content-center align-items-center p-0 mt-1 mb-lg-3 mb-5`} xl={12}>
                                        <Button 
                                            variant="outline-dark" 
                                            className="w-50" 
                                            type="submit">Login</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
        </div>
    )
}

export default Login;