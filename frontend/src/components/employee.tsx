import { useState,useEffect } from "react"
import style from "../utilities/employee.module.css"
import employeeDataModel from "../models/employeeDataModel"
import filterDataModel from "../models/filterDataModel"
import { List,DeviceSsd,Dot,People,Book } from "react-bootstrap-icons"
import { Row,Col,Container,Offcanvas,ListGroup,Button,Table,Form, } from "react-bootstrap"

const Employee=()=>{

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
        date:""
    })

    const handleFilterChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setFilterData({
            ...filterData,[e.target.name]:e.target.value
        })
    }

    const handleFilterSelect=(e:React.ChangeEvent<HTMLSelectElement>)=>{
        setFilterData({
            ...filterData,[e.target.name]:e.target.value
        })
    }

    const [show, setShow] = useState(false)

    const handleClose=()=>setShow(false)
    const handleShow=()=>setShow(true)

    useEffect(()=>{
        const fetchEmplyoees=async()=>{
            const data=await fetch(`http://localhost:5000/employeeStatus`,{
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
                <h1 className={`m-0`}>Explosion Risk Management System<Dot></Dot>Employee Status<Dot></Dot>
                    <Button className={`bg-dark border-dark`} onClick={handleShow}><List className={`bg-dark`}></List></Button>
                </h1>
            </div>
            <div className={`d-flex justify-content-center w-100 mb-1`}>
                <Row>
                    <Col><Form.Control name="employeeID" onChange={handleFilterChange} type="text" placeholder="Employee ID..."></Form.Control></Col>
                    <Col><Form.Control name="sectorNo" onChange={handleFilterChange} type="number" placeholder="Sector No..."></Form.Control></Col>
                    <Col><Form.Select name="attendance" onChange={handleFilterSelect}>
                        <option value="">Attendance</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                    </Form.Select></Col>
                    <Col><Form.Select name="evacuated" onChange={handleFilterSelect}>
                        <option value="">Evacuated</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </Form.Select></Col>
                    <Col><Form.Control name="date" onChange={handleFilterChange} type="date" placeholder="Date"></Form.Control></Col>
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
                                    <th className="py-3 bg-dark text-light">Evacuated</th>
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
                                            <td className={`${item.attendance?style.okay:style.notOkay}`}>{item.attendance?"Present":"Absent"}</td>
                                            <td className={`${item.evacuated?style.okay:style.notOkay}`}>{item.evacuated?"Yes":"No"}</td>
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
                        <ListGroup.Item className={`p-4 border-0 d-flex align-items-center`} variant="dark" active action href="/employeeStatus">
                            <People className={`me-2`}></People><b>Employee Status</b>
                        </ListGroup.Item>
                        <ListGroup.Item className={`p-4 border-0 d-flex align-items-center`} variant="light" action href="/employeeManagement">
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

export default Employee