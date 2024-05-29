import React, { useState,useEffect } from "react"
import style from "../utilities/employee.module.css"
import employeeDataModel from "../models/employeeDataModel"
import filterDataModel from "../models/filterDataModel"
import { List,DeviceSsd,Dot,People, Book } from "react-bootstrap-icons"
import { Row,Col,Container,Offcanvas,ListGroup,Button,Table,Form } from "react-bootstrap"
import FormCheckInput from "react-bootstrap/esm/FormCheckInput"

interface createDateFeedback{
    feedType:boolean,
    feed:string,
}

const Management=()=>{

    const [employeeData,setEmployeeData]=useState<employeeDataModel[]>([{
        employeeID:"",
        employeeName:"",
        sectorNo:0,
        attendance:false,
        evacuated:false,
        date:""
    }])

    const [filterData,setFilterData]=useState<filterDataModel>({
        employeeID:"",
        sectorNo:0,
        attendance:"",
        evacuated:"",
        date:"2024-01-01"
    })

    const [feedback,setFeedback]=useState<createDateFeedback>({
        feedType:false,
        feed:"",
    })

    const [createDate,setCreateDate]=useState<string>("")

    const handleFilterChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setFilterData({
            ...filterData,[e.target.name]:e.target.value
        })
    }

    const handleCheckChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const update=async()=>{
            const updateAttendance=await fetch("http://localhost:5000/attendance",{
                method:"POST",
                credentials:"include",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify({id:e.target.id.slice(0,6),value:e.target.checked,date:filterData.date})
            })
            const updateResponse=await updateAttendance.json()
            if(updateResponse.data==="Updated") console.log("Updated")
            else console.error("Couldn't update")
        }
        update()
    }

    const handleCreateDateChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setCreateDate(e.target.value)
    }

    const handleCreateDate=()=>{
        const create=async()=>{
            const updateAttendance=await fetch("http://localhost:5000/createDate",{
                method:"POST",
                credentials:"include",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify({date:createDate})
            })
            const updateResponse=await updateAttendance.json()
            if(updateResponse.ok){
                setFeedback({
                    ...feedback,feedType:true,feed:updateResponse.message
                })
            }
            else{
                setFeedback({
                    ...feedback,feedType:false,feed:updateResponse.message
                }) 
            }
        }
        create()
    }

    const [show, setShow] = useState(false)

    const handleClose=()=>setShow(false)
    const handleShow=()=>setShow(true)

    useEffect(()=>{
        const fetchEmplyoees=async()=>{
            const data=await fetch(`http://localhost:5000/employeeManagement`,{
                method:"POST",
                credentials:"include",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify({})
            })
            const dataResponse=await data.json()
            setEmployeeData(dataResponse.data)
        }
        fetchEmplyoees()
    },[])

    useEffect(()=>{
        const fetchFilter=async()=>{
            const data=await fetch(`http://localhost:5000/employeeStatus`,{
                method:"POST",
                credentials:"include",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify(filterData)
            })
            const dataResponse=await data.json()
            setEmployeeData(dataResponse.data)
        }
        fetchFilter()
    },[filterData])

    const handleLogout=()=>{
        const logout=async()=>{
            const logoutReq=await fetch("http://localhost:5000/logout",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                credentials:"include",
            })
            const logoutRes=await logoutReq.json()
            if(logoutRes.message==="Logged out successfully"){
                window.location.reload()
            }
        }
        logout()
    }

    return(
        <div className={`${style.mainContainer} p-4`}>
            <div className={`d-flex justify-content-center w-100 mb-5`}>
                <h1 className={`m-0`}>Explosion Risk Management System<Dot></Dot>Employee Management<Dot></Dot>
                    <Button className={`bg-dark border-dark`} onClick={handleShow}><List className={`bg-dark`}></List></Button>
                </h1>
            </div>
            <div className={`d-flex justify-content-center w-100 mb-1`}>
                <Row>
                    <Col xl={4}><Form.Control name="employeeID" onChange={handleFilterChange} type="text" placeholder="Employee ID..."></Form.Control></Col>
                    <Col xl={4}><Form.Control name="sectorNo" onChange={handleFilterChange} type="text" placeholder="Sector No..."></Form.Control></Col>
                    <Col xl={4}><Form.Control name="date" onChange={handleFilterChange} type="date" placeholder="Date" value={filterData.date}></Form.Control></Col>
                    <Col xl={2} className="mt-3 d-flex justify-content-start align-items-center"><h5>Create Date:</h5></Col>
                    <Col xl={8} className="mt-3"><Form.Control name="createDate" type="date" placeholder="Date" onChange={handleCreateDateChange}></Form.Control></Col>
                    <Col xl={2} className="mt-3 d-flex justify-content-end align-items-center"><Button className="bg-dark w-75" type="button" variant="dark" onClick={handleCreateDate}>Create</Button></Col>
                    <Col xl={12}><Form.Control.Feedback  className="d-flex justify-content-center" type={feedback.feedType?"valid":"invalid"}>{feedback.feed}</Form.Control.Feedback></Col>
                </Row>
            </div>
            <Container className={`m-0 p-0 d-flex justify-content-center align-items-start w-100 mt-3`}>
                <Row className={`m-0 p-0 w-100`}>
                    <Col xl={12} className={`m-0 p-0 d-flex justify-content-center align-items-center flex-column`}>
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th className="py-3 bg-dark text-light">Employee ID</th>
                                    <th className="py-3 bg-dark text-light">Employee Name</th>
                                    <th className="py-3 bg-dark text-light">Sector No</th>
                                    <th className="py-3 bg-dark text-light">Attendance</th>
                                    <th className="py-3 bg-dark text-light">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeData.map((item)=>{
                                    return (
                                        <tr key={item.employeeID+item.date}>
                                            <td>{item.employeeID}</td>
                                            <td>{item.employeeName}</td>
                                            <td>{item.sectorNo}</td>
                                            <td><FormCheckInput id={item.employeeID+item.date} onChange={handleCheckChange} defaultChecked={item.attendance}></FormCheckInput></td>
                                            <td>{item.date}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                <Offcanvas.Title><h2>Menu</h2></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className={`p-0`}>
                    <ListGroup className={`border-0`} variant="flush">
                        <ListGroup.Item className={`p-4 border-0 d-flex align-items-center`} variant="light" action href="/sensorStatus">
                            <DeviceSsd className={`me-2`}></DeviceSsd><b>Sensor Status</b>
                        </ListGroup.Item>
                        <ListGroup.Item className={`p-4 border-0 d-flex align-items-center`} variant="light" action href="/employeeStatus">
                            <People className={`me-2`}></People><b>Employee Status</b>
                        </ListGroup.Item>
                        <ListGroup.Item className={`p-4 border-0 d-flex align-items-center`} variant="dark" active action href="/employeeManagement">
                            <Book className={`me-2`}></Book><b>Employee Management</b>
                        </ListGroup.Item>
                        <ListGroup.Item className={`p-4 border-0 d-flex align-items-center`}>
                            <Button onClick={handleLogout} type="button" variant="dark" className="bg-dark w-100">Logout</Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    )
}

export default Management