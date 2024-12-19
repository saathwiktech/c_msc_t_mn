const User = require('../models/User');
const Project = require('../models/ProjectModel');
const Work = require('../models/Works');
const Subwork = require('../models/Subworks');
const UserFields = require('../models/Default');
require('dotenv').config();
const excellformat = async (req, res) => {
    try {
        const { wid } = req.params;
        const work = await Work.findById({ _id:wid });
        // console.log(work);
        const pid = work.pid;
        const projeccct = await Project.findById({ _id: pid });
        
        const subworkslist = await Subwork.find({ wid: work._id });
        let payload = {
            project: projeccct.name,
            clientName: projeccct.clientDetails.clientname,
            work: work,
            subworks: subworkslist
        };

        // Send the request to another server
        //console.log(JSON.stringify(payload));
        const response = await fetch(process.env.PDF_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        // console.log(JSON.stringify(payload))
        if (!response.ok) {
            throw new Error('Failed to fetch PDF');
        }
        const pdfBuffer = await response.arrayBuffer();

        // Set headers to forward PDF to the client
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
        res.status(200).send(Buffer.from(pdfBuffer));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
};

module.exports = {excellformat};
