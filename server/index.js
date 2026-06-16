// -------------------- Imports --------------------
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cron = require("node-cron")

const http = require("http");
const { Server } = require("socket.io");

// -------------------- App Setup --------------------
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect("mongodb+srv://mubina:mubina@cluster0.n2dvweq.mongodb.net/db_mainproject")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// -------------------- File Upload Setup --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./public/uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });



app.get("/greetings", async (req, res) => {
  res.send({ "msg": "Hello World" })
})



const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")





const verifyToken = (req, res, next) => {

  const token = req.headers.authorization

  if (!token) return res.status(401).json({ message: "No token" })

  try {
    const decoded = jwt.verify(token, "secretkey")
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ message: "Invalid token" })
  }

}




// -------------------- Schemas & Models --------------------
const districtSchema = new mongoose.Schema(
  { districtName: { type: String, required: true, trim: true } },
  { collection: "districts", timestamps: true }
);
const District = mongoose.model("District", districtSchema);



const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true,
      default: ""
    }

  },
  {
    collection: "category",
    timestamps: true
  }
);

const Category = mongoose.model("Category", categorySchema);


const brandSchema = new mongoose.Schema(
  { brandName: { type: String, required: true, trim: true } },
  { collection: "brand", timestamps: true }
);
const Brand = mongoose.model("Brand", brandSchema);




const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  password: { type: String, required: true },
  address: { type: String },
  photo: { type: String, default: "" },
  districtId: { type: mongoose.Schema.Types.ObjectId, ref: "District", required: true },
  status: { type: String, enum: ["active", "inactive", "pending"], default: "pending" },
}, { collection: "warehouses", timestamps: true }

);
const Warehouse = mongoose.model("Warehouse", warehouseSchema);



const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    password: { type: String, required: true }
  },
  { collection: "admin", timestamps: true }
);
const Admin = mongoose.model("admin", adminSchema);



const subcategorySchema = new mongoose.Schema({
  subcategoryName: { type: String, required: true, trim: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
}, { collection: "subcategory", timestamps: true });

const Subcategory = mongoose.model("subcategory", subcategorySchema);






const productTemplateSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcategory"
  },

  storageType: {
    type: String,
    enum: [
      "Deep Freeze",
      "Frozen Storage",
      "Cooler Storage",
      "Pharma Storage"
    ]
  }

}, { collection: "producttemplate", timestamps: true })

const ProductTemplate = mongoose.model("ProductTemplate", productTemplateSchema)



app.get("/producttemplate", async (req, res) => {

  try {

    const data = await ProductTemplate.find()
      .populate({
        path: "subcategoryId",
        populate: {
          path: "categoryId"
        }
      })

    res.json({ data })

  } catch (err) {

    res.status(500).json({ error: err.message })

  }

})



app.get("/producttemplate/subcategory/:id", async (req, res) => {

  try {

    const data = await ProductTemplate.find({
      subcategoryId: req.params.id
    })

    res.json({ data })

  } catch (err) {

    res.status(500).json({ error: err.message })

  }

})


app.post("/producttemplate", async (req, res) => {

  try {

    const { name, subcategoryId, storageType } = req.body

    const data = await ProductTemplate.create({
      name,
      subcategoryId,
      storageType
    })

    res.json({
      message: "Product Template Created",
      data
    })

  } catch (err) {

    res.status(500).json({ error: err.message })

  }

})

app.put("/producttemplate/:id", async (req, res) => {

  try {

    const data = await ProductTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json({
      message: "Updated successfully",
      data
    })

  } catch (err) {

    res.status(500).json({ error: err.message })

  }

})


app.delete("/producttemplate/:id", async (req, res) => {

  try {

    await ProductTemplate.findByIdAndDelete(req.params.id)

    res.json({
      message: "Deleted successfully"
    })

  } catch (err) {

    res.status(500).json({ error: err.message })

  }

})






app.get("/dashboard/:wid", async (req, res) => {

  const wid = req.params.wid

  const totalProducts = await Product.countDocuments()

  const sections = await Section.find({ warehouseManagerId: wid })

  const alerts = await Alert.countDocuments({ warehouseId: wid })

  res.json({
    totalProducts,
    totalSections: sections.length,
    alerts
  })

})




app.get("/section/auto/:wid/:storageType", async (req, res) => {

  try {

    const { wid, storageType } = req.params

    const sections = await Section.aggregate([

      {
        $match: {
          warehouseManagerId: new mongoose.Types.ObjectId(wid),
          storageType: storageType
        }
      },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "sectionId",
          as: "products"
        }
      },

      {
        $addFields: {
          currentLoad: {
            $sum: "$products.quantity"
          }
        }
      },

      {
        $addFields: {
          available: {
            $subtract: ["$capacity", "$currentLoad"]
          }
        }
      },

      {
        $match: {
          available: { $gt: 0 }   // only sections with space
        }
      },

      {
        $sort: { available: -1 }  // choose section with most space
      },

      {
        $limit: 1
      }

    ])

    if (sections.length === 0) {

      return res.json({
        message: "No space available",
        data: null
      })

    }

    res.json({
      data: sections[0]
    })

  } catch (err) {

    console.log(err)

  }

})




const staffSchema = new mongoose.Schema({
  staffName: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  password: { type: String, required: true },
  photo: { type: String, default: "" },

  warehouseManagerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true
  }
}, { collection: "staff", timestamps: true });
const Staff = mongoose.model("Staff", staffSchema);




const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  details: { type: String },
  quantity: { type: Number },
  temperature: { type: Number },
  expiryDate: { type: Date },

  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "subcategory" },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },

  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending"
  }

}, { collection: "product", timestamps: true });
const Product = mongoose.model("Product", productSchema);




const sectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      required: true,
      trim: true
    },

    storageType: {
      type: String,
      enum: [
        "Deep Freeze",
        "Frozen Storage",
        "Cooler Storage",
        "Pharma Storage"
      ],
      required: true
    },

    minTemp: {
      type: Number,
      required: true
    },

    maxTemp: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.minTemp
        },
        message: "Max temperature must be greater than Min temperature"
      }
    },

    capacity: {
      type: Number,
      required: true
    },

    warehouseManagerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true
    },

    lastStatus: {
      type: String,
      enum: ["normal", "warning", "critical"],
      default: "normal"
    }

  },
  { collection: "section", timestamps: true }
)
const Section = mongoose.model("Section", sectionSchema)




const generateTemperature = async () => {

  const sections = await Section.find()

  for (const s of sections) {

    const min = Number(s.minTemp)
    const max = Number(s.maxTemp)

    if (isNaN(min) || isNaN(max)) {
      console.log("Invalid temperature range for section:", s.sectionName)
      continue
    }

    const randomTemp =
      Math.floor(Math.random() * (max - min + 6)) + (min - 3)

    let status = "normal"

    if (randomTemp > max) {
      status = "critical"
    } else if (randomTemp > max - 2) {
      status = "warning"
    }

    // ✅ ALERT ONLY IF STATUS CHANGED
    if (status !== s.lastStatus) {

      if (status === "warning" || status === "critical") {

        const alert = await Alert.create({
          type: "temperature",
          sectionId: s._id,
          warehouseId: s.warehouseManagerId,
          severity: status,
          message: `Temperature in ${s.sectionName} (${s.storageType}) is ${randomTemp}°C`
        })

        io.emit("newAlert", alert) // ✅ FIXED
      }

      if (status === "normal") {
        console.log(`${s.sectionName} temperature back to normal`)
      }

      s.lastStatus = status
      await s.save()
    }

    // ✅ STORE TEMPERATURE
    const newTemp = await Temperature.create({
      sectionId: s._id,
      temperature: randomTemp,
      status
    })

    const populatedTemp = await newTemp.populate(
      "sectionId",
      "sectionName minTemp maxTemp storageType"
    )

    // ✅ EMIT CORRECT DATA
    io.emit("temperatureUpdate", populatedTemp)
  }
}
// TEMPERATURE GENERATOR
let running = false

cron.schedule("*/1 * * * *", async () => {

  if (running) {
    console.log("Skipping cron — still running")
    return
  }

  running = true

  try {
    await generateTemperature()
  } catch (err) {
    console.error("Temperature error:", err)
  }

  running = false
})


const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },

    warehouseManagerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true
    },

    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null
    },

    reply: {
      type: String,
      default: ""
    }

  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);


const reportSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: true
  },

  workDone: {
    type: String,
    required: true
  }

}, { collection: "report", timestamps: true });

const Report = mongoose.model("Report", reportSchema);



const placeSchema = new mongoose.Schema(
  {
    placeName: { type: String, required: true, trim: true },
    districtId: { type: mongoose.Schema.Types.ObjectId, ref: "District", required: true },
  },
  { collection: "places", timestamps: true }
);
const Place = mongoose.model("Place", placeSchema);


const alertSchema = new mongoose.Schema({

  type: {
    type: String,
    enum: ["temperature", "expiry", "equipment", "door"]
  },

  message: {
    type: String
  },

  severity: {
    type: String,
    enum: ["critical", "warning", "info"],
    default: "info"
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section"
  },

  warehouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse"
  }

}, { timestamps: true })

const Alert = mongoose.model("Alert", alertSchema)

const temperatureSchema = new mongoose.Schema({

  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true
  },

  status: {
    type: String,
    enum: ["normal", "warning", "critical"]
  },

  temperature: {
    type: Number,
    required: true
  },

  recordedAt: {
    type: Date,
    default: Date.now
  }

}, { collection: "temperature", timestamps: true })

const Temperature = mongoose.model("Temperature", temperatureSchema)


// -------------------- DISTRICT API --------------------
app.post("/district", async (req, res) => {
  try {
    const { name } = req.body;
    await District.create({ districtName: name });

    res.json({ "msg": "Inserted Success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/district", async (req, res) => {
  try {
    const districtData = await District.find()

    res.json({ districtData: districtData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.get("/districtById/:id", async (req, res) => {
  try {
    const districtData = await District.findById(req.params.id)

    res.json({ districtData: districtData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/district/:id", async (req, res) => {
  try {
    await District.findByIdAndDelete(req.params.id)

    res.json({ "msg": "deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/district/:id", async (req, res) => {
  try {
    const { districtName } = req.body;
    await District.findByIdAndUpdate(req.params.id, { districtName });

    res.json({ "msg": "Updated Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});






// -------------------- PRODUCT API --------------------

app.get("/admin/dashboard", async (req, res) => {
  try {

    const totalWarehouses = await Warehouse.countDocuments()
    const totalStaff = await Staff.countDocuments()
    const totalProducts = await Product.countDocuments()
    const totalCategories = await Category.countDocuments()
    const totalAlerts = await Alert.countDocuments()

    const recentWarehouses = await Warehouse.find()
      .sort({ createdAt: -1 })
      .limit(5)

    const recentProducts = await Product.find()
      .populate("categoryId", "categoryName")
      .sort({ createdAt: -1 })
      .limit(5)

    const recentAlerts = await Alert.find()
      .sort({ createdAt: -1 })
      .limit(5)

    res.json({
      stats: {
        totalWarehouses,
        totalStaff,
        totalProducts,
        totalCategories,
        totalAlerts
      },
      recentWarehouses,
      recentProducts,
      recentAlerts
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


app.post("/product", async (req, res) => {
  try {

    const {
      name,
      details,
      quantity,
      expiryDate,
      sectionId,
      categoryId,
      subcategoryId,
      staffId,
      temperature
    } = req.body

    const section = await Section.findById(sectionId)

    const current = await Product.aggregate([
      {
        $match: {
          sectionId: new mongoose.Types.ObjectId(sectionId)
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" }
        }
      }
    ])

    const currentLoad = current.length ? current[0].total : 0

    if (currentLoad + Number(quantity) > section.capacity) {

      return res.status(400).json({
        message: "Section capacity exceeded"
      })

    }

    const product = await Product.create({

      name,
      details,
      quantity,
      expiryDate,
      sectionId,
      categoryId,
      subcategoryId,
      staffId,
      temperature

    })

    res.json({ message: "Product added successfully", product })

  } catch (err) {

    res.status(500).json({ error: err.message })

  }

})




app.put("/product/:id", async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully", data: updatedProduct });

  } catch (err) {
    console.error("UPDATE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// GET PRODUCTS BY STAFF
app.get("/product/staff/:sid", verifyToken, async (req, res) => {
  try {
    const { sid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sid)) {
      return res.status(400).json({ message: "Invalid Staff ID" });
    }

    const data = await Product.find({ staffId: sid })
      .populate("sectionId", "sectionName minTemp maxTemp storageType")
      .populate("categoryId", "categoryName")
      .populate("subcategoryId", "subcategoryName")
      .populate("staffId", "staffName");

    res.json({ data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET PRODUCTS BY WAREHOUSE
app.get("/product/warehouse/:wid", async (req, res) => {
  try {
    const { wid } = req.params;

    const data = await Product.find()
      .populate({
        path: "sectionId",
        match: { warehouseManagerId: wid }
      })
      .populate("categoryId", "categoryName")
      .populate("subcategoryId", "subcategoryName")
      .populate({
        path: "staffId",
        match: { warehouseManagerId: wid }
      });

    const filtered = data.filter(
      (p) => p.sectionId !== null || p.staffId !== null
    );

    res.json({ data: filtered });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});






app.get("/warehouse/:wid/staff", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.wid)) {
      return res.status(400).json({ message: "Invalid Warehouse ID" });
    }

    const data = await Staff.find({
      warehouseManagerId: req.params.wid
    });

    res.json({ data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/warehouse/:wid/sections", async (req, res) => {
  try {
    const data = await Section.find({
      warehouseManagerId: req.params.wid
    });

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/category/:cid/subcategories", async (req, res) => {
  try {
    const data = await Subcategory.find({
      categoryId: req.params.cid
    });

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// -------------------- SECTION API --------------------

// Create Section
app.post("/section", async (req, res) => {
  try {

    const { sectionName, storageType, minTemp, maxTemp, capacity, warehouseManagerId } = req.body

    if (!sectionName || !storageType || minTemp === "" || maxTemp === "" || !capacity) {
      return res.status(400).json({ message: "All fields required" })
    }

    await Section.create({
      sectionName,
      storageType,
      minTemp: Number(minTemp),
      maxTemp: Number(maxTemp),
      capacity: Number(capacity),
      warehouseManagerId
    })

    res.json({ message: "Section added successfully" })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get Sections by Warehouse
app.get("/section/:id", async (req, res) => {

  try {

    const id = req.params.id

    const sections = await Section.aggregate([

      {
        $match: {
          warehouseManagerId: new mongoose.Types.ObjectId(id)
        }
      },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "sectionId",
          as: "products"
        }
      },

      {
        $addFields: {
          currentLoad: {
            $sum: "$products.quantity"
          }
        }
      },

      {
        $project: {
          sectionName: 1,
          storageType: 1,
          minTemp: 1,
          maxTemp: 1,
          capacity: 1,
          currentLoad: 1
        }
      }

    ])

    res.json({
      success: true,
      data: sections
    })

  } catch (error) {

    console.log(error)
    res.status(500).json({ message: "Error loading sections" })

  }

})

// Delete Section
app.delete("/section/:id", async (req, res) => {
  try {
    await Section.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Create Automatic Alert Generator
const generateAlerts = async () => {

  const products = await Product.find().populate("sectionId")

  for (const p of products) {

    if (!p.expiryDate) continue

    const today = new Date()
    const expiry = new Date(p.expiryDate)

    const diff = (expiry - today) / (1000 * 60 * 60 * 24)

    let severity = null
    let message = ""

    if (diff < 0) {
      severity = "critical"
      message = `${p.name} already expired`
    }
    else if (diff <= 2) {
      severity = "warning"
      message = `${p.name} expiring in ${Math.ceil(diff)} days`
    }

    if (severity) {

      const exists = await Alert.findOne({
        type: "expiry",
        productId: p._id,
        severity
      })

      if (!exists) {
        await Alert.create({
          type: "expiry",
          productId: p._id,
          warehouseId: p.sectionId?.warehouseManagerId,
          message,
          severity
        })
      }

    }

  }
}






// Alert API
app.get("/alerts/:wid", async (req, res) => {

  try {

    const data = await Alert.find({
      warehouseId: req.params.wid
    })
      .populate("productId", "name")
      .sort({ createdAt: -1 })
      .limit(50)

    res.json({ data })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }

})


// CREATE REPORT
app.post("/report", async (req, res) => {
  try {
    const { productId, staffId, workDone } = req.body;

    await Report.create({
      productId,
      staffId,
      workDone,
    });

    await Product.findByIdAndUpdate(productId, {
      status: "completed"
    });

    res.json({ message: "Report submitted & product completed" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Reports By Product (for warehouse)

app.get("/report/product/:pid", async (req, res) => {
  try {

    const data = await Report.find({
      productId: req.params.pid   // ✅ CORRECT FIELD
    })
      .sort({ createdAt: -1 })
      .populate("staffId", "staffName email")
      .populate("productId", "name");

    console.log("REPORT DATA:", data); // 👈 debug

    res.json({ data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get Reports By Staff
app.get("/report/staff/:sid", async (req, res) => {
  try {

    const data = await Report.find({
      staffId: req.params.sid
    })
      .sort({ createdAt: -1 })
      .populate("productTemplateId", "name storageType")
      .populate("sectionId", "sectionName")
      .populate("categoryId", "categoryName")
      .populate("subcategoryId", "subcategoryName")

    res.json({ data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// CREATE COMPLAINT
app.post("/complaint", async (req, res) => {
  try {
    const { title, content, warehouseManagerId, staffId } = req.body;

    await Complaint.create({
      title,
      content,
      warehouseManagerId,
      staffId
    });

    res.json({ message: "Complaint submitted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET COMPLAINTS BY WAREHOUSE
app.get("/complaint/:wid", async (req, res) => {
  try {
    const data = await Complaint.find({
      warehouseManagerId: req.params.wid
    })
      .populate("staffId", "staffName email")
      .sort({ createdAt: -1 });

    res.json({ data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE COMPLAINT
app.delete("/complaint/:id", async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/complaint/single/:id", async (req, res) => {
  try {
    const data = await Complaint.findById(req.params.id);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// -------------------- SUBCATEGORY API --------------------

// Create subcategory
app.post("/subcategory", async (req, res) => {
  try {
    const { subcategoryName, categoryId } = req.body;

    await Subcategory.create({ subcategoryName, categoryId });

    res.json({ msg: "Inserted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get subcategories
app.get("/subcategory", async (req, res) => {
  try {
    const data = await Subcategory.find()
      .populate("categoryId", "categoryName");

    res.json({ data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete("/subcategory/:id", async (req, res) => {
  try {
    await Subcategory.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// -------------------- STAFF API --------------------

app.post("/staff", upload.single("photo"), async (req, res) => {

  try {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { name, email, password, warehouseManagerId } = req.body;

    if (!warehouseManagerId) {
      return res.status(400).json({
        message: "Warehouse ID missing"
      });
    }

    const photo = req.file ? req.file.filename : "";

    const hashedPassword = await bcrypt.hash(password, 10)

    await Staff.create({
      staffName: name,
      email,
      password: hashedPassword,
      photo,
      warehouseManagerId
    });

    res.json({ message: "Staff registered successfully" });

  } catch (err) {


    res.status(500).json({ error: err.message });
  }
});



// Temperature API
app.post("/temperature", async (req, res) => {

  try {

    const { sectionId, temperature } = req.body

    const data = await Temperature.create({
      sectionId,
      temperature
    })

    res.json({
      message: "Temperature recorded",
      data
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }

})

// Create Temperature Fetch API (For Charts)
app.get("/temperature/:wid", async (req, res) => {

  try {

    const sections = await Section.find({
      warehouseManagerId: req.params.wid
    })

    const ids = sections.map(s => s._id)

    const data = await Temperature.find({
      sectionId: { $in: ids }
    })
      .populate("sectionId", "sectionName minTemp maxTemp storageType")
      .sort({ recordedAt: 1 })

    res.json({ data })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }

})



app.post("/category", async (req, res) => {
  try {
    const { categoryName } = req.body;

    await Category.create({ categoryName });

    res.json({ msg: "Inserted Success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/category", async (req, res) => {
  try {

    const categoryData = await Category.aggregate([
      {
        $lookup: {
          from: "products",        // product collection
          localField: "_id",
          foreignField: "categoryId",
          as: "products"
        }
      },
      {
        $addFields: {
          productCount: { $size: "$products" }
        }
      },
      {
        $project: {
          categoryName: 1,
          description: 1,
          productCount: 1
        }
      }
    ]);

    res.json({ categoryData });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/categoryById/:id", async (req, res) => {
  try {
    const categoryData = await Category.findById(req.params.id)

    res.json({ categoryData: categoryData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/category/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id)

    res.json({ "msg": "deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/category/:id", async (req, res) => {
  try {
    const { categoryName } = req.body;

    await Category.findByIdAndUpdate(
      req.params.id,
      { categoryName },
      { new: true }
    );

    res.json({ msg: "Updated Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/brand", async (req, res) => {
  try {
    console.log(req.body);

    const { brandName } = req.body;
    await Brand.create({ brandName });

    res.json({ "msg": "Inserted Success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/brand", async (req, res) => {
  try {
    const brandData = await Brand.find()

    res.json({ brandData: brandData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/brand/:id", async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id)

    res.json({ "msg": "deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

///.....warehouse reg

app.post("/warehouse", upload.single("photo"), async (req, res) => {
  try {
    let { name, email, password, address, districtId } = req.body;

    email = email.toLowerCase(); // ✅ ADD THIS

    const hashedPassword = await bcrypt.hash(password, 10);

    const photo = req.file ? `/${req.file.filename}` : "";

    await Warehouse.create({
      name,
      email,
      password: hashedPassword,
      address,
      photo,
      districtId
    });

    res.json({ message: "Warehouse added successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



///.....admin reg

app.post("/adminregistration", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);


    const hashedPassword = await bcrypt.hash(password, 10)

    await Admin.create({
      name,
      email,
      password: hashedPassword
    });

    res.json({ message: "Admin added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});









///.....login 



app.post("/login", async (req, res) => {

  const { email, password } = req.body;

  const lowerEmail = email.toLowerCase(); // ✅ FIX

  let user = await Admin.findOne({ email: lowerEmail });

  if (!user) user = await Warehouse.findOne({ email: lowerEmail });

  if (!user) user = await Staff.findOne({ email: lowerEmail });
  if (!user) {
    return res.status(401).json({ message: "Invalid email" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.constructor.modelName },
    "secretkey",
    { expiresIn: "1d" }
  );

  res.json({
    token,
    role: user.constructor.modelName,
    id: user._id,
    name: user.name || user.staffName,
    message: "Login successful"
  });
});



// -------------------- WAREHOUSE DETAIL --------------------
app.get("/warehouse/:id", async (req, res) => {
  try {
    const data = await Warehouse.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id)
        }
      },
      {
        $lookup: {
          from: "districts",
          localField: "districtId",
          foreignField: "_id",
          as: "district"
        }
      },
      { $unwind: "$district" },
      {
        $project: {
          fullName: "$name",
          email: 1,
          photo: 1,
          districtName: "$district.districtName",
          _id: 0
        }
      }
    ]);

    if (!data.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ data: data[0] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// -------------------- STAFF DETAIL --------------------
app.get("/staff/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json({
      data: {
        fullName: staff.staffName,
        email: staff.email,
        photo: staff.photo,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// -------------------- STAFF UPDATE --------------------
app.put("/staff/:id", async (req, res) => {
  try {
    const { fullName, email } = req.body;

    await Staff.findByIdAndUpdate(req.params.id, {
      staffName: fullName,
      email: email
    });

    res.json({ message: "Updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// -------------------- WAREHOUSE UPDATE --------------------
app.put("/warehouse/:id", async (req, res) => {
  try {
    const { fullName, email, districtId } = req.body;

    await Warehouse.findByIdAndUpdate(
      req.params.id,
      {
        name: fullName,
        email: email,
        districtId: districtId
      },
      { new: true }
    );

    res.json({ message: "Updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// -------------------- CHANGE PASSWORD WAREHOUSE --------------------
app.put("/warehousepwd/:id", async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const warehouse = await Warehouse.findById(req.params.id)

  const isMatch = await bcrypt.compare(oldPassword, warehouse.password)

  if (!isMatch) {
    return res.json({ message: "Old password incorrect" })
  }
  if (!warehouse)
    return res.json({ message: "Old password is incorrect" });

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  warehouse.password = hashedPassword
  await warehouse.save();
  res.json({ message: "Password changed successfully" });
});


// -------------------- CHANGE PASSWORD STAFF --------------------
app.put("/staffpwd/:sid", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { sid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sid)) {
      return res.status(400).json({ message: "Invalid Staff ID" });
    }

    const staff = await Staff.findById(sid);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, staff.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    staff.password = hashedPassword
    await staff.save()




    res.json({ message: "Password changed successfully" });

  } catch (err) {
    console.error("Password Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});





// GET ALL PRODUCTS
app.get("/product", verifyToken, async (req, res) => {
  try {
    const data = await Product.find()
      .populate("sectionId", "sectionName minTemp maxTemp storageType")
      .populate("categoryId", "categoryName")
      .populate("subcategoryId", "subcategoryName")
      .populate("staffId", "staffName");

    res.json({ data });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE PRODUCT
app.delete("/product/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.put("/product/complete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ❗ Expiry check
    if (product.expiryDate && new Date(product.expiryDate) < new Date()) {
      return res.status(400).json({
        message: "Cannot complete expired product"
      });
    }

    // Staff restriction
    if (role === "staff") {
      if (!product.staffId) {
        return res.status(400).json({ message: "No staff assigned" });
      }

      if (product.staffId.toString() !== userId) {
        return res.status(403).json({
          message: "You can complete only your own products"
        });
      }
    }

    product.status = "completed";
    await product.save();

    res.json({ message: "Product marked as completed" });

  } catch (err) {
    console.error("COMPLETE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});





app.put("/complaint/reply/:id", async (req, res) => {
  try {
    const { reply } = req.body;

    await Complaint.findByIdAndUpdate(req.params.id, {
      reply
    });

    res.json({ message: "Reply updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// -------------------- Start Server --------------------


server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});