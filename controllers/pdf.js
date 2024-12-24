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
        const response = await fetch(`${process.env.PDF_URL}/generate-pdf`, {
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

const downloadsubworkPdf = async (req, res) => {
    try {
        const { swid } = req.params;

        if (!swid) {
            return res.status(400).json({ message: "Subwork ID is required" });
        }

        const subwork = await Subwork.findById(swid);
        if (!subwork) {
            return res.status(404).json({ message: "Subwork not found" });
        }

        const work = await Work.findById(subwork.wid).select('pid name ');
        if (!work) {
            return res.status(404).json({ message: "Work not found" });
        }
        // console.log(work)
        const project = await Project.findById(work.pid).select("name clientDetails.clientname");
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        let payload = {
            project: project.name,
            clientName: project.clientDetails.clientname,
            work: work.name,
            subworks: subwork
        };
        const response = await fetch(`${process.env.PDF_URL}/generate-pdf-subwork`, {
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
        console.error("Error in downloadsubworkPdf:", error);
        res.status(500).json({ message: "An error occurred" });
    }
};
const downloadsubworkXcell = async (req, res) => {
    try {
        const { swid } = req.params;

        if (!swid) {
            return res.status(400).json({ message: "Subwork ID is required" });
        }

        const subwork = await Subwork.findById(swid);
        if (!subwork) {
            return res.status(404).json({ message: "Subwork not found" });
        }

        const work = await Work.findById(subwork.wid).select('pid name');
        if (!work) {
            return res.status(404).json({ message: "Work not found" });
        }

        const project = await Project.findById(work.pid).select("name clientDetails.clientname");
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        let payload = {
            project: project.name,
            clientName: project.clientDetails.clientname,
            work: work.name,
            subworks: subwork,
        };

        const response = await fetch(`${process.env.PDF_URL}/generate-xlsx-subwork`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch Excel');
        }

        const excelBuffer = await response.arrayBuffer();

        // Set headers to forward Excel to the client
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="subwork_report.xlsx"');
        res.status(200).send(Buffer.from(excelBuffer));
    } catch (error) {
        console.error("Error in downloadsubworkXcell:", error);
        res.status(500).json({ message: "An error occurred" });
    }
};

module.exports = {excellformat,downloadsubworkPdf,downloadsubworkXcell};
