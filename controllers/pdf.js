const User = require('../models/User');
const Project = require('../models/ProjectModel');
const Work = require('../models/Works');
const Subwork = require('../models/Subworks');
const UserFields = require('../models/Default');
require('dotenv').config();
const excellformat = async (req, res) => {
    try {
        const { wid } = req.params;
        const work = await Work.findById({ _id: wid });
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
        // console.log(payload);
        // const response = await fetch('http://localhost:11000/prxpdf', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(payload)
        // });
        console.log("Request sent from the main server ");
        console.log("Request sent from the main server ",process.env.PDF_URL);
        const response = await fetch(`${process.env.PDF_URL}/prxpdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        console.log("Recieved",response);
        if (!response.ok) {
            throw new Error('Failed to fetch PDF');
        }
        const pdfBuffer = await response.arrayBuffer();

        // Set headers to forward PDF to the client
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
        res.status(200).send(Buffer.from(pdfBuffer));
        // Wait for the response and parse it as JSON
        // const result = await response.json();
        // console.log(result);

        // // Send a response back to the client
        // res.status(200).json({ message: "Excel generated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
};

module.exports = {excellformat};