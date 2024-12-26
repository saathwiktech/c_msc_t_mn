const User = require('../models/User');
const Project = require('../models/ProjectModel');
const Work = require('../models/Works');
const Subwork = require('../models/Subworks');
const UserFields = require('../models/Default');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { initializeWork } = require('../defaultfunctions/work.default');
const { initializeSubwork } = require('../defaultfunctions/subwork.default');
const XLSX = require("xlsx");
const numberToWords = require('number-to-words');
const JWT_SECRET = process.env.JWT_SECRET;
const AddUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User has been added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add user", details: err.message });
  }
};

const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "5h" });
    res.status(200).json({ message: "User logged in successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log in", details: err.message });
  }
};


const AddProject = async (req, res) => {
  const userId = req.params.uid;
  const pid = Date.now();
  const { name, clientname, clientnumber, clientaddress } = req.body;

  if (!name || !clientname || !clientnumber || !clientaddress) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const existingProject = await Project.findOne({ pid });
    if (existingProject) {
      return res.status(400).json({ error: 'Project already exists' });
    }

    const newProject = new Project({
      pid,
      name,
      clientDetails: { clientname, clientnumber, clientaddress },
      userId,
    });

    await newProject.save();
    res.status(201).json({ message: 'Project added successfully', project: newProject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add project', details: err.message });
  }
}

const AddWork = async (req, res) => {
  const { pid } = req.params;
  const { name, sft, cft } = req.body;
  const wid = Date.now();
  if (!name || !wid) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const project = await Project.findOne({ "_id": pid });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const newWork = new Work({
      wid,
      name, sft, cft,
      pid: project._id,
    });

    await newWork.save();
    res.status(201).json({
      message: `Work '${name}' added to project '${project.name}'`,
      work: newWork,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add work', details: err.message });
  }
}

const AddSubwork = async (req, res) => {
  const { wid } = req.params;
  const { name, length, breadth, depth, totalval } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const work = await Work.findOne({ "_id": wid });
    if (!work) {
      return res.status(404).json({ error: 'Work not found' });
    }

    const newSubwork = new Subwork({
      wid: work._id,
      name,
      details: [],
      reductions: [],
    });

    await newSubwork.save();
    res.status(201).json({
      message: `Subwork '${name}' added to work '${work.name}'`,
      subwork: newSubwork,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add subwork', details: err.message });
  }
}
const updateSubwork = async (req, res) => {
  const { swid } = req.params;
  const { newDetails } = req.body;

  try {
    const subwork = await Subwork.findById(swid);

    if (!subwork) {
      return res.status(404).json({ error: "Subwork not found" });
    }

    if (!Array.isArray(newDetails)) {
      return res.status(400).json({ error: "newDetails must be an array" });
    }
    newDetails.forEach((detail) => {
      const { name, length, breadth, depth, number, quantity } = detail;

      subwork.details.push({
        id: `${Date.now()}${Math.floor(Math.random() * 10000)}`,
        name: name || "Unnamed",
        length: length || 0,
        breadth: breadth || 0,
        depth: depth || 0,
        number: number || 1,
        quantity: quantity || 0,
      });
    });
    await subwork.save();

    return res.status(200).json({ message: "Subworks added successfully", subwork });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "An error occurred while adding subworks" });
  }
};


const GetProjects = async (req, res) => {
  const uid = req.params.uid;
  try {

    const projects = await Project.find({ userId: uid }).select('name _id');
    if (!projects) {
      return res.status(404).json({ message: 'No projects' });
    }

    res.status(200).json({ message: 'Projects fetched successfully', projects: projects });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch projects', details: err.message });
  }

}
const deleteSubwork = async (req, res) => {

  const { swid, detailId } = req.params;
  try {
    // Use $pull to remove the subdocument from the `details` array
    const updatedSubwork = await Subwork.findByIdAndUpdate(
      swid,
      { $pull: { details: { id: detailId } } }, // Match the subdocument by its `id` field
      { new: true } // Return the updated document
    );

    if (!updatedSubwork) {
      return res.status(404).json({ message: 'Subwork not found' });
    }

    res.status(200).json({
      message: 'Subwork detail deleted successfully',
      updatedSubwork,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
const deleteSubworkreduction = async (req, res) => {

  const { swid, detailId } = req.params;
  try {
    // Use $pull to remove the subdocument from the `details` array
    const updatedSubwork = await Subwork.findByIdAndUpdate(
      swid,
      { $pull: { reductions: { id: detailId } } }, // Match the subdocument by its `id` field
      { new: true } // Return the updated document
    );

    if (!updatedSubwork) {
      return res.status(404).json({ message: 'Subwork not found' });
    }

    res.status(200).json({
      message: 'Subwork Reductions deleted successfully',
      updatedSubwork,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const GetWorks = async (req, res) => {
  const pid = req.params.pid;
  try {

    const works = await Work.find({ pid: pid }).select('name _id');
    
    if (works.length === 0) {
      await initializeWork(pid).then(async (e) => {
        
        const works = await Work.find({ pid: pid }).select('name _id');
        return res.status(200).json({ message: 'Works fetched successfully', works: works });
      })
      // return res.status(404).json({ message: 'No Works' });
    } else {

      res.status(200).json({ message: 'Works fetched successfully', works: works });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch Works', details: err.message });
  }

}

const GetSubWorks = async (req, res) => {
  const wid = req.params.wid;
  try {
    let subworks = await Subwork.find({ wid: wid }).select('name _id');

    if (subworks.length === 0) {
      await initializeSubwork(wid);
      subworks = await Subwork.find({ wid: wid }).select('name _id');
      return res.status(200).json({ message: 'SubWorks fetched successfully', subworks });
    }
    return res.status(200).json({ message: 'SubWorks fetched successfully', subworks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch SubWorks', details: err.message });
  }
};

const initializeDefaultFields = async (userId) => {
  const existingFields = await UserFields.findOne({ userId });

  if (!existingFields) {
    const defaultFields = [
      { name: "foundation", units: [{ name: "SFT", value: 0 }, { name: "CFT", value: 0 }] },
      { name: "painting", units: [{ name: "SFT", value: 0 }, { name: "CFT", value: 0 }] },
      { name: "centering", units: [{ name: "SFT", value: 0 }, { name: "CFT", value: 0 }] },
    ];

    const newFields = new UserFields({ userId, fields: defaultFields });
    await newFields.save();
  }
};
const getDefaultValues = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    let userFields = await UserFields.find({ userId });

    if (!userFields) {
      await initializeDefaultFields(userId); 
      userFields = await UserFields.findOne({ userId }); 
    }

    res.status(200).json({ message: "Fields retrieved successfully.", data: userFields });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving fields.", details: error.message });
  }
};

const addOrUpdateFields = async (req, res) => {
  const { userId, newFields } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  if (!newFields || !Array.isArray(newFields)) {
    return res.status(400).json({ error: "New fields must be an array of objects with name, SFT, and CFT." });
  }

  try {
    const userFields = await UserFields.findOne({ userId });

    if (!userFields) {
      return res.status(404).json({ error: "User not found. Add default values first." });
    }
    newFields.forEach(({ name, sft = 0, cft = 0 }) => {
      if (!name) {
        throw new Error("Field name is required for each field.");
      }
      const existingField = userFields.fields.find((field) => field.name === name);

      if (existingField) {

        existingField.units = [
          { name: "SFT", value: sft },
          { name: "CFT", value: cft },
        ];
      } else {
        userFields.fields.push({
          name,
          units: [
            { name: "SFT", value: sft },
            { name: "CFT", value: cft },
          ],
        });
      }
    });
    await userFields.save();

    res.status(200).json({
      message: "Fields added or updated successfully.",
      data: userFields,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating fields.", details: error.message });
  }
};

const GetSubWorksDetailed = async (req, res) => {
  const wid = req.params.wid;
  try {

    const subworks = await Subwork.find({ _id: wid });
    if (!subworks) {
      return res.status(404).json({ message: 'No SubWorks' });
    }

    res.status(200).json({ message: 'SubWorks fetched successfully', subworks: subworks });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch Works', details: err.message });
  }
}

const updateSubworkDetail = async (req, res) => {
  const { wid, detailId } = req.params;
  const updatedDetail = req.body;
  updatedDetail.id = detailId;
  try {
    const subwork = await Subwork.findById(wid);
    if (!subwork) {
      return res.status(404).json({ message: "Subwork not found" });
    }

    // Find the detail to update
    const detailIndex = subwork.details.findIndex((d) => d.id === detailId);
    if (detailIndex === -1) {
      return res.status(404).json({ message: "Detail not found" });
    }

    // Update the detail
    subwork.details[detailIndex] = { ...subwork.details[detailIndex], ...updatedDetail };

    // Save the updated subwork
    await subwork.save();

    res.status(200).json({
      message: "Subwork detail updated successfully",
      updatedSubwork: subwork,
    });
  } catch (error) {
    console.error("Error updating subwork detail:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
const updateSubworkReduction = async (req, res) => {
  const { wid, detailId } = req.params;
  const updatedDetail = req.body;
  updatedDetail.id = detailId;
  try {
    const subwork = await Subwork.findById(wid);
    if (!subwork) {
      return res.status(404).json({ message: "Subwork not found" });
    }

    // Find the detail to update
    const detailIndex = subwork.reductions.findIndex((d) => d.id === detailId);
    if (detailIndex === -1) {
      return res.status(404).json({ message: "Detail not found" });
    }

    // Update the detail
    subwork.reductions[detailIndex] = { ...subwork.reductions[detailIndex], ...updatedDetail };

    // Save the updated subwork
    await subwork.save();

    res.status(200).json({
      message: "Subwork Reductions updated successfully",
      updatedSubwork: subwork,
    });
  } catch (error) {
    console.error("Error updating subwork detail:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

const updateSubworkUnits = async (req, res) => {
  const { wid } = req.params;
  const updatedDetail = req.body; // { SFT: "1", CFT: "34" }

  try {

    const SFT = parseFloat(updatedDetail.SFT);
    const CFT = parseFloat(updatedDetail.CFT);

    const subwork = await Subwork.updateOne(
      { "_id": wid },
      {
        $set: {
          "default.SFT": SFT, // Ensure these are numbers
          "default.CFT": CFT,
        }
      }
    );

    if (subwork.modifiedCount === 0) {
      return res.status(404).json({ message: "Subwork not found or no change made" });
    }
    res.status(200).json({
      message: "Subwork detail updated successfully",
      updatedSubwork: { SFT: SFT, CFT: CFT },
    });
  } catch (error) {
    console.error("Error updating subwork detail:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
const deleteProject = async (req, res) => {
  const { uid } = req.params;  // Assuming you have a user ID here
  const { pid } = req.body;    // The project ID to be deleted

  try {
    // Step 1: Delete all Subworks associated with the Project
    await Subwork.deleteMany({ 'wid': { $in: await Work.find({ pid }).select('_id') } });

    // Step 2: Delete all Works associated with the Project
    await Work.deleteMany({ pid });

    // Step 3: Delete the Project
    const deletedProject = await Project.findByIdAndDelete(pid);

    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Respond with a success message
    res.status(200).json({
      message: 'Project and its associated works and subworks deleted successfully'
    });

  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Failed to delete project', details: err.message });
  }
};
const deleteWork = async (req, res) => {
  const { wid } = req.params;

  try {
    // Step 1: Delete all Subworks associated with the Work
    await Subwork.deleteMany({ 'wid': wid });

    // Step 2: Delete the Work
    const deletedWork = await Work.findByIdAndDelete(wid);

    if (!deletedWork) {
      return res.status(404).json({ message: 'Work not found' });
    }

    // Respond with a success message
    res.status(200).json({
      message: 'Work and its associated subworks deleted successfully'
    });

  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Failed to delete work', details: err.message });
  }
};
const deleteSubWork = async (req, res) => {
  const { swid } = req.params;  // The subwork ID to be deleted

  try {
    // Step 1: Delete the Subwork
    const deletedSubWork = await Subwork.findByIdAndDelete(swid);

    if (!deletedSubWork) {
      return res.status(404).json({ message: 'Subwork not found' });
    }
    res.status(200).json({
      message: 'Subwork deleted successfully'
    });

  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Failed to delete subwork', details: err.message });
  }
};
const GenPdf = async (req, res) => {
  try {
    const { wid } = req.params;

    // Fetch work and subworks data
    const work = await Work.findById(wid);
    const pid = work.pid;
    const projeccct = await Project.findById({ _id: pid })
    if (!work) {
      return res.status(404).json({ message: "Work not found" });
    }

    const subworkslist = await Subwork.find({ wid: work._id });
    if (!subworkslist || subworkslist.length === 0) {
      return res.status(404).json({ message: "No subworks found for this work" });
    }

    // Prepare the Excel sheet data
    const rows = [];
    let totalsum = 0;
    let detailsqnt = 0;
    let reductionqnt = 0;
    let dsum = 0;
    let rsum = 0;
    let mul = 0;

    // rows.push({ Section: `Project: ${projeccct.name}`, Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: "", Total: "" });
    // rows.push({ Section: `Client: ${projeccct.clientDetails.clientname}`, Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: "", Total: "" });
    // rows.push({ Section: "", Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: "", Total: "" }); // Empty row for spacing

    //   rows.push(
    //     { Section: `Project: ${projeccct.name || "N/A"}`, Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: "", Total: "", unit: "" },
    //     { Section: `Client: ${projeccct.clientDetails.clientname || "N/A"}`, Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: "", Total: "", unit: "" },
    //     { Section: "", Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: "", Total: "", unit: "" }, // Blank row for spacing
    // );


    subworkslist.forEach((subwork) => {
      let sum = 0;
      let rrsum = 0;
      let defVal = subwork.default;
      let defname = ''

      // heading for subwork
      rows.push(
        { Section: subwork.name, Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: "", Unit: "",Total:"" }
      );
      let trackdetailsamount = 0;
      let trackreductionamount = 0;

      subwork.details.forEach((detail) => {
        let qnt = 0;  // Initialize qnt for each detail


        if (defVal.SFT !== 0) {
          mul = defVal.SFT;
          qnt = detail.length * detail.breadth * detail.number;
          sum += qnt;
          detailsqnt += sum;
          defname = 'SFT'
          // dsum+=sum;
        }
        if (defVal.CFT !== 0) {
          mul = defVal.CFT;
          qnt = detail.length * detail.breadth * detail.number * detail.depth;
          sum += qnt;
          detailsqnt += sum;
          // dsum+=sum;
          defname = 'CFT'
        }
        rows.push({
          Section: "",
          Name: detail.name || "",
          Number: detail.number || "",
          Length: detail.length || 0,
          Breadth: detail.breadth || 0,
          Depth: detail.depth || 0,
          Quantity: qnt || 0,
        });

        // Subwork total and reduction
      });
      trackdetailsamount = (sum * mul);
      rows.push(
        { Section: "", Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: `${new Intl.NumberFormat('en-IN').format(sum)+" "+defname} `, Unit: ``, Total: `` } //${mul + "₹ /" + defname}//₹${new Intl.NumberFormat('en-IN').format(sum * mul)}
      );
      dsum += (sum * mul);
      rows.push(
        { Section: "Deductions", Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: "", Unit: "", Total: "" }
      );

      // loop for reductions
      subwork.reductions.forEach((detail) => {
        let qnt = 0;  // Initialize qnt for each detail


        if (defVal.SFT !== 0) {
          mul = defVal.SFT;
          qnt = detail.length * detail.breadth * detail.number;
          rrsum += qnt;
          reductionqnt += rrsum;
          defname = 'SFT'
        }
        if (defVal.CFT !== 0) {
          mul = defVal.CFT;
          qnt = detail.length * detail.breadth * detail.number * detail.depth;
          rrsum += qnt;
          reductionqnt += rrsum;
          defname = 'CFT'
        }
        rows.push({
          Section: "",
          Name: detail.name || "",
          Number: detail.number || "",
          Length: detail.length || 0,
          Breadth: detail.breadth || 0,
          Depth: detail.depth || 0,
          Quantity: qnt || 0,
        });


        // Subwork total and reduction
      });

      trackreductionamount = (rrsum * mul);
      rows.push(
        { Section: "", Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: `${new Intl.NumberFormat('en-IN').format(rrsum)+" "+defname}`, Unit: ``, Total: `` } //${mul + "₹ /" + defname} //₹${new Intl.NumberFormat('en-IN').format(rrsum * mul)}
      );
      rsum += (rrsum * mul);

      // rows.push(
      //   { Section: "", Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: "", Total: `${new Intl.NumberFormat('en-IN').format(rsum)}` }
      // );
      rows.push(
        { Section: "", Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: "", Unit: "", Total: `` }
      );
      rows.push(
        { Section: "", Name: "", Number: "", Length: "", Breadth: "", Depth: `Total`, Quantity: `${new Intl.NumberFormat('en-IN').format(sum-rrsum)} `,Unit:`${mul + "₹ /" + defname}`, Total: `₹ ${new Intl.NumberFormat('en-IN').format((sum-rrsum)*mul)} ` }
      );
      // rows.push(
      //   { Section: "", Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: `${subwork.name} =`,Unit:"", Total: `₹${new Intl.NumberFormat('en-IN').format(trackdetailsamount - trackreductionamount)}` }
      // );
      rows.push(
        { Section: "", Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: "",Unit:"", Total: "" }
      );
      rows.push(
        { Section: "", Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: "",Unit:"", Total: "" }
      );
      totalsum += trackdetailsamount - trackreductionamount;
    });

    rows.push(
      { Section: "", Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: "", Unit: "", Total: "" }
    );
    rows.push(
      { Section: "", Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: "", Unit: "", Total: "" }
    );

    // Grand total
    rows.push(
      { Section: "", Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: "Grand total", Unit: "", Total: `₹ ${new Intl.NumberFormat('en-IN').format(totalsum)}` }
    );
    let numberwords = numberToWords.toWords(totalsum);
    rows.push(
      { Section: `Project Name: ${projeccct.name}`, Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: "", Unit: "", Total: `` }
    );
    rows.push(
      { Section: `Client : ${projeccct.clientDetails.clientname}`, Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: "", Unit: "", Total: `` }
    );
    rows.push(
      { Section: `Client : ${projeccct.clientDetails.clientnumber}`, Name: "", Number: "", Length: "", Breadth: "", Depth: "", Quantity: "", Unit: "", Total: `${numberwords}` }
    );

    // Create a new workbook and add the data
    const worksheet = XLSX.utils.json_to_sheet(rows, {
      header: ["Section", "Name", "Number", "Length", "Breadth", "Depth", "Quantity", "Unit", "Total"],
    });
    // Set column widths
    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 8 },
      { wch: 6 },
      { wch: 6 },
      { wch: 6 },
      { wch: 6 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subwork Details");

    // Convert workbook to binary buffer
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Set response headers and send the buffer
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=Subwork_Details.xlsx");
    res.send(excelBuffer);
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const updateReduction = async (req, res) => {
  const { swid } = req.params;
  const { newDetails } = req.body;
  try {
    const subwork = await Subwork.findById(swid);

    if (!subwork) {
      return res.status(404).json({ error: "Subwork not found" });
    }

    if (!Array.isArray(newDetails)) {
      return res.status(400).json({ error: "newDetails must be an array" });
    }
    newDetails.forEach((detail) => {
      const { name, length, breadth, depth, number, quantity } = detail;

      subwork.reductions.push({
        id: `${Date.now()}${Math.floor(Math.random() * 10000)}`,
        name: name || "Unnamed",
        length: length || 0,
        breadth: breadth || 0,
        depth: depth || 0,
        number: number || 1,
        quantity: quantity || 0,
      });
    });
    await subwork.save();

    return res.status(200).json({ message: "Subworks added successfully", subwork });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "An error occurred while adding subworks" });
  }
};


module.exports = { AddUser, updateReduction, deleteSubworkreduction, updateSubworkReduction, deleteSubwork, GenPdf, deleteSubWork, deleteProject, deleteWork, updateSubworkUnits, updateSubworkDetail, LoginUser, AddProject, AddWork, AddSubwork, GetWorks, GetProjects, GetSubWorks, addOrUpdateFields, getDefaultValues, GetSubWorksDetailed, updateSubwork };