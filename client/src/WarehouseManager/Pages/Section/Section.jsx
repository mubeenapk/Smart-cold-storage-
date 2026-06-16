import React, { useEffect, useState } from "react";
import Styles from "./Section.module.css";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

const Section = () => {

const [section,setSection] = useState("")
const [storageType,setStorageType] = useState("")
const [minTemp,setMinTemp] = useState("")
const [maxTemp,setMaxTemp] = useState("")
const [capacity,setCapacity] = useState("")
const [list,setList] = useState([])
const [editId,setEditId] = useState(null)

const warehouseId = sessionStorage.getItem("wid")

// STORAGE RULES
const storageRules = {
A:{type:"Deep Freeze",min:-25,max:-18},
B:{type:"Frozen Storage",min:-18,max:-10},
C:{type:"Cooler Storage",min:2,max:8},
D:{type:"Pharma Storage",min:2,max:6}
}

// Detect storage automatically
const detectStorage=(value)=>{

const prefix = value.charAt(0).toUpperCase()

if(storageRules[prefix]){

setStorageType(storageRules[prefix].type)
setMinTemp(storageRules[prefix].min)
setMaxTemp(storageRules[prefix].max)

}else{

setStorageType("")
setMinTemp("")
setMaxTemp("")

}

}

// Handle section change
const handleSectionChange=(value)=>{

setSection(value)
detectStorage(value)

}

// LOAD SECTIONS
const loadSections=()=>{

if(!warehouseId) return

axios
.get(`http://localhost:5000/section/${warehouseId}`)
.then(res=>setList(res.data.data))
.catch(console.error)

}

useEffect(()=>{
loadSections()
},[])


// CLEAR FORM
const clearForm=()=>{

setSection("")
setStorageType("")
setMinTemp("")
setMaxTemp("")
setCapacity("")
setEditId(null)

}


// SUBMIT
const handleSubmit=()=>{

if(!section){
alert("Enter section name")
return
}

if(!capacity){
alert("Enter capacity")
return
}

const payload={
sectionName:section,
storageType,
minTemp,
maxTemp,
capacity,
warehouseManagerId:warehouseId
}

if(editId){

axios.put(`http://localhost:5000/section/${editId}`,payload)
.then(()=>{
alert("Section Updated")
clearForm()
loadSections()
})

}else{

axios.post("http://localhost:5000/section",payload)
.then(res=>{
alert(res.data.message)
clearForm()
loadSections()
})

}

}


// EDIT
const handleEdit=(item)=>{

setEditId(item._id)

setSection(item.sectionName)
setStorageType(item.storageType)
setMinTemp(item.minTemp)
setMaxTemp(item.maxTemp)
setCapacity(item.capacity)

}


// DELETE
const handleDelete=(id)=>{

if(!window.confirm("Delete this section?")) return

axios
.delete(`http://localhost:5000/section/${id}`)
.then(res=>{
alert(res.data.message)
loadSections()
})

}


// CALCULATE STATUS
const getStatus=(current,capacity)=>{

const percent = (current/capacity)*100

if(percent<70) return "green"
if(percent<90) return "yellow"
return "red"

}

return(

<div className={Styles.container}>

<div className={Styles.subcontainer}>

<h2 align="center" className={Styles.hd}>
SECTION
</h2>

<input
type="text"
placeholder="Enter Section (Example A1)"
className={Styles.inp}
value={section}
onChange={(e)=>handleSectionChange(e.target.value)}
/>

<input
type="text"
className={Styles.inp}
value={storageType}
placeholder="Storage Type"
readOnly
/>

<input
type="number"
className={Styles.inp}
value={minTemp}
placeholder="Min Temp"
readOnly
/>

<input
type="number"
className={Styles.inp}
value={maxTemp}
placeholder="Max Temp"
readOnly
/>

<input
type="number"
className={Styles.inp}
value={capacity}
placeholder="Section Capacity (kg)"
onChange={(e)=>setCapacity(e.target.value)}
/>

<div className={Styles.cntr}>

<button
className={Styles.sb}
onClick={handleSubmit}
>
{editId ? "Update" : "Submit"}
</button>

<button
className={Styles.cancel}
onClick={clearForm}
>
Cancel
</button>

</div>

</div>


<div className={Styles.tablebox}>

<table className={Styles.table}>

<thead>

<tr>
<th>SI No</th>
<th>Section</th>
<th>Storage</th>
<th>Temperature</th>
<th>Capacity</th>
<th>Current</th>
<th>Available</th>
<th>Status</th>
<th>Action</th>
</tr>

</thead>

<tbody>

{list.map((item,index)=>{

const current = item.currentLoad || 0
const available = item.capacity - current
const percent = Math.round((current/item.capacity)*100)
const status = getStatus(current,item.capacity)

return(

<tr key={item._id}>

<td>{index+1}</td>

<td>{item.sectionName}</td>

<td>{item.storageType}</td>

<td>
{item.minTemp}°C → {item.maxTemp}°C
</td>

<td>
{item.capacity} kg
</td>

<td>
{current} kg
</td>

<td>
{available} kg
</td>

<td>

{status==="green" && <span>🟢 {percent}% full</span>}
{status==="yellow" && <span>🟡 {percent}% full</span>}
{status==="red" && <span>🔴 {percent}% full</span>}

</td>

<td>

<button
className={`${Styles.iconBtn} ${Styles.editIcon}`}
onClick={()=>handleEdit(item)}
>
<FaEdit/>
</button>

<button
className={`${Styles.iconBtn} ${Styles.deleteIcon}`}
onClick={()=>handleDelete(item._id)}
>
<FaTrash/>
</button>

</td>

</tr>

)

})}

</tbody>

</table>

</div>

</div>

)

}

export default Section