import React,{useState,useEffect} from "react"
import axios from "axios"
import Styles from "./AddProduct.module.css"

const AddProduct=()=>{

const wid=sessionStorage.getItem("wid")

const[category,setCategory]=useState("")
const[subcategory,setSubcategory]=useState("")
const[product,setProduct]=useState("")
const[storageType,setStorageType]=useState("")
const[section,setSection]=useState("")
const[temperature,setTemperature]=useState("")
const[quantity,setQuantity]=useState("")
const[expiryDate,setExpiryDate]=useState("")
const[staff,setStaff]=useState("")

const[categories,setCategories]=useState([])
const[subcategories,setSubcategories]=useState([])
const[products,setProducts]=useState([])
const[staffList,setStaffList]=useState([])

useEffect(()=>{

axios.get("http://localhost:5000/category")
.then(res=>setCategories(res.data.categoryData))

axios.get(`http://localhost:5000/warehouse/${wid}/staff`)
.then(res=>setStaffList(res.data.data))

},[])

useEffect(()=>{

if(!category)return

axios.get(`http://localhost:5000/category/${category}/subcategories`)
.then(res=>setSubcategories(res.data.data))

},[category])

useEffect(()=>{

if(!subcategory)return

axios.get(`http://localhost:5000/producttemplate/subcategory/${subcategory}`)
.then(res=>setProducts(res.data.data))

},[subcategory])

const handleProduct = async(id)=>{

const selected = products.find(p=>p._id===id)

setProduct(id)

if(selected){

setStorageType(selected.storageType)

try{

const res = await axios.get(
`http://localhost:5000/section/auto/${wid}/${selected.storageType}`
)

if(!res.data.data){

alert("⚠ No storage space available for this product")

setProduct("")
setStorageType("")
setTemperature("")
setSection("")

return
}

setSection(res.data.data._id)

setTemperature(
`${res.data.data.minTemp} → ${res.data.data.maxTemp}`
)

}catch(err){

alert("Error finding section")

}

}

}



const handleSubmit = async () => {

if(!product || !section || !quantity || !staff){
  alert("Please fill all required fields")
  return
}

const selectedProduct = products.find(p => p._id === product)

await axios.post("http://localhost:5000/product",{
  productTemplateId: product,
  name: selectedProduct?.name,
  quantity,
  expiryDate,
  sectionId:section,
  categoryId:category,
  subcategoryId:subcategory,
  staffId:staff,

  temperature: Number(
    temperature.split("→")[0]   
  )
})

alert("Product Added")

alert("Product Added")

setCategory("")
setSubcategory("")
setProduct("")
setQuantity("")
setExpiryDate("")
setStaff("")
setTemperature("")
setStorageType("")
setSection("")
}

return(

<div className={Styles.container}>
<div className={Styles.card}>
<h2 className={Styles.title}>Add Product</h2>

{/* CATEGORY */}
<div className={Styles.field}>
<label>Category</label>
<select value={category} onChange={(e)=>{
setCategory(e.target.value)
setSubcategory("")
}}>
<option value="">Select Category</option>
{categories.map(c=>(
<option key={c._id} value={c._id}>{c.categoryName}</option>
))}
</select>
</div>

{/* SUBCATEGORY */}
<div className={Styles.field}>
<label>Subcategory</label>
<select value={subcategory} onChange={(e)=>setSubcategory(e.target.value)}>
<option value="">Select Subcategory</option>
{subcategories.map(s=>(
<option key={s._id} value={s._id}>{s.subcategoryName}</option>
))}
</select>
</div>

{/* PRODUCT */}
<div className={Styles.field}>
<label>Product</label>
<select value={product} onChange={(e)=>handleProduct(e.target.value)}>
<option value="">Select Product</option>
{products.map(p=>(
<option key={p._id} value={p._id}>
{p.name}
</option>
))}
</select>
</div>

{/* SECTION CARD */}
{section && (
<div className={Styles.sectionCard}>
<h4>📦 Assigned Section</h4>
<p><b>ID:</b> {section}</p>
<p><b>Storage:</b> {storageType}</p>
<p><b>Temperature:</b> {temperature}</p>
</div>
)}

{/* INPUTS */}
<input
type="number"
placeholder="Quantity"
value={quantity}
onChange={(e)=>setQuantity(e.target.value)}
/>

<input
type="date"
value={expiryDate}
onChange={(e)=>setExpiryDate(e.target.value)}
/>

<select value={staff} onChange={(e)=>setStaff(e.target.value)}>
<option>Select Staff</option>
{staffList.map(s=>(
<option key={s._id} value={s._id}>{s.staffName}</option>
))}
</select>

<button onClick={handleSubmit} className={Styles.submit}>
Add Product
</button>

</div>
</div>
)
}

export default AddProduct