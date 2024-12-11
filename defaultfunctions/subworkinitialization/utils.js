// const Subwork = require('../../models/Subworks.js');
// const Work = require('../../models/Works.js');

// exports.foundation = async (wid)=>{
//     let defaultfoundationnames=["earthwork","bed concrete","rr masonry","ss masonry","dpc"];
//     let defval=[{"earthwork":{"SFT":0,"CFT":19}},{"bed concrete":{"SFT":16,"CFT":0}},{"rr masonry":{"SFT":0,"CFT":18}},{"ss masonry":{"SFT":0,"CFT":17}},{"dpc":{"SFT":17,"CFT":0}}];
//     try{
//         defaultfoundationnames.forEach(async (subwork)=>{
//             const newSubwork = new Subwork({
//                 wid: wid, 
//                 name:subwork,
//                details:[]
//             });
    
//             await newSubwork.save();
//         });
//     }catch(err){console.log(err)}

// }

const Subwork = require('../../models/Subworks.js');

exports.foundation = async (wid) => {
    const defaultfoundationnames = ["earthwork", "bed concrete", "rr masonry", "ss masonry", "dpc"];
    const defval = [
        { "earthwork": { "SFT": 0, "CFT": 19 } },
        { "bed concrete": { "SFT": 16, "CFT": 0 } },
        { "rr masonry": { "SFT": 0, "CFT": 18 } },
        { "ss masonry": { "SFT": 0, "CFT": 17 } },
        { "dpc": { "SFT": 17, "CFT": 0 } }
    ];

    try {
        // Use for loop instead of forEach to handle async/await correctly
        for (let i = 0; i < defaultfoundationnames.length; i++) {
            const subworkName = defaultfoundationnames[i];
            const defaultValues = defval[i][subworkName];

            const newSubwork = new Subwork({
                wid: wid,
                name: subworkName,
                default: defaultValues,
                details: [],
                reductions:[]
            });

            await newSubwork.save(); // Save each subwork to the database
        }
        console.log("Foundation subworks initialized successfully.");
    } catch (err) {
        console.error("Error initializing foundation subworks:", err);
    }
};

exports.masonry = async (wid) => {
    const masonryData = [
        { name: "Laterite Stone Masonry", SFT: 38, CFT: 0 },
        { name: "Laterite Stone Masonry 9\" thick", SFT: 23, CFT: 0 },
        { name: "Laterite Stone Masonry 6\" thick", SFT: 23, CFT: 0 },
        { name: "Laterite Stone Masonry 6\" & 9\" thick", SFT: 40, CFT: 0 },
        { name: "Laterite Stone Masonry 9\" thick per Nos", SFT: 22, CFT: 0 },
        { name: "Laterite Stone Masonry 6\" thick per Nos", SFT: 22, CFT: 0 },
        { name: "Laterite Stone Masonry 9\" thick per Sft", SFT: 35, CFT: 0 },
        { name: "Laterite Stone Masonry 6\" thick per Sft", SFT: 36, CFT: 0 },
        { name: "4\" Brick Masonry", SFT: 30, CFT: 0 },
        { name: "4\" & 6\" Solid Block Masonry", SFT: 25, CFT: 0 },
        { name: "Block Masonry 4\" & 6\" Per Nos", SFT: 26, CFT: 0 },
        { name: "Block Masonry 4\" & 6\" Per Sft", SFT: 38, CFT: 0 },
        { name: "Block Masonry 4\" thick", SFT: 30, CFT: 0 },
        { name: "Block Masonry 6\" thick", SFT: 25, CFT: 0 },
        { name: "Interior Wall Plastering - Sponge & Tapi Finish", SFT: 16, CFT: 0 },
        { name: "Ceiling Plastering - Sponge Finish", SFT: 16, CFT: 0 },
        { name: "Beam, Plinth Beam & Pillar Plastering", SFT: 37, CFT: 0 },
        { name: "Slab Plastering", SFT: 16, CFT: 0 },
        { name: "Nice Plastering", SFT: 16, CFT: 0 },
        { name: "Exterior Wall Plastering", SFT: 16, CFT: 0 },
        { name: "Water Patti & Beading Per Rft", SFT: 28, CFT: 0 },
        { name: "Mason Per Nos", SFT: 1100, CFT: 0 },
        { name: "Helper Per Nos", SFT: 900, CFT: 0 }
    ];

    try {
        for (const masonry of masonryData) {
            const newSubwork = new Subwork({
                wid: wid, // Work ID reference
                name: masonry.name,
                default: {
                    SFT: masonry.SFT,
                    CFT: masonry.CFT
                },
                details: [],
                reductions:[] // Empty details array for now
            });

            await newSubwork.save(); // Save the subwork to the database
        }
        console.log("Masonry subworks initialized successfully.");
    } catch (err) {
        console.error("Error initializing masonry subworks:", err);
    }
};
exports.centering = async (wid) => {
    const centeringData = [
        { name: "10 ft Slab - 5\" thick", SFT: 50, CFT: 0 },
        { name: "10 ft Slab - 2-way Rod extra", SFT: 5, CFT: 0 },
        { name: "12 ft Slab - 5\" thick", SFT: 70, CFT: 0 },
        { name: "10 ft slab - 5\" above", SFT: 0, CFT: 130 },
        { name: "12 ft slab - 5\" above", SFT: 0, CFT: 140 },
        { name: "R.C.C Retaining Wall", SFT: 0, CFT: 180 },
        { name: "4\" thick R.C.C Retaining Wall", SFT: 70, CFT: 0 },
        { name: "Above 4\" thick R.C.C Retaining Wall", SFT: 0, CFT: 150 },
        { name: "Step", SFT: 0, CFT: 90 },
        { name: "Step (Waist Slab) - 5\"", SFT: 50, CFT: 0 },
        { name: "Step - 5\" above", SFT: 0, CFT: 130 },
        { name: "Landing Slab", SFT: 50, CFT: 0 },
        { name: "Lintel", SFT: 0, CFT: 90 },
        { name: "Footing", SFT: 0, CFT: 85 },
        { name: "Bed - 4\" thick", SFT: 15, CFT: 0 },
        { name: "Bed - 6\" thick", SFT: 20, CFT: 0 },
        { name: "Plinth Beam", SFT: 0, CFT: 140 },
        { name: "R.C.C Column", SFT: 0, CFT: 170 },
        { name: "R.C.C Beam", SFT: 0, CFT: 150 },
        { name: "Column & Beam (6\" thick)", SFT: 0, CFT: 170 },
        { name: "3 & 4 Side Slab", SFT: 120, CFT: 0 },
        { name: "Drop Works", SFT: 75, CFT: 0 },
        { name: "Round Slab", SFT: 170, CFT: 0 },
        { name: "Round Beam", SFT: 0, CFT: 220 },
        { name: "R.C.C Beam", SFT: 0, CFT: 185 },
        { name: "Round Arch", SFT: 0, CFT: 150 },
        { name: "Round Pillar", SFT: 0, CFT: 150 },
        { name: "Round Pillar 1'", SFT: 0, CFT: 170 },
        { name: "Pedestal", SFT: 0, CFT: 140 },
        { name: "R.C.C Chejja", SFT: 50, CFT: 0 },
        { name: "R.C.C Drop", SFT: 75, CFT: 0 },
        { name: "15% Jump per Floor", SFT: 0, CFT: 0 }
    ];

    try {
        for (const centering of centeringData) {
            const newSubwork = new Subwork({
                wid: wid, // Work ID reference
                name: centering.name,
                default: {
                    SFT: centering.SFT,
                    CFT: centering.CFT
                },
                details: [],
                reductions:[] // Empty details array for now
            });

            await newSubwork.save(); // Save the subwork to the database
        }
        console.log("Centering subworks initialized successfully.");
    } catch (err) {
        console.error("Error initializing centering subworks:", err);
    }
};
exports.flooring = async (wid) => {
    const flooringData = [
        { name: "1'0\" X 1'0\" Tile Flooring Per Sft", SFT: 17, CFT: 0, RFT: 3 },
        { name: "2'0\" X 2'0\" Tile Flooring Per Sft", SFT: 18, CFT: 0, RFT: 3 },
        { name: "2'0\" X 4'0\" Tile Flooring Per Sft", SFT: 19, CFT: 0, RFT: 3 },
        { name: "5'3\" X 2'8\" Tile Flooring Per Sft", SFT: 22, CFT: 0, RFT: 3 },
        { name: "8'7\" X 2'8\" Tile Flooring Per Sft", SFT: 28, CFT: 0, RFT: 3 },
        { name: "With Spacer Fitting Flooring Per Sft Extra", SFT: 30, CFT: 0, RFT: 0 },
        { name: "1'6\" X 1'0\" Wall Tile Per Sft", SFT: 20, CFT: 0, RFT: 3 },
        { name: "Granite Fitting Wall Per Sft/Rft", SFT: 0, CFT: 0, RFT: 35 },
        { name: "Granite Fitting Floor Per Sft/Rft", SFT: 0, CFT: 0, RFT: 30 },
        { name: "Granite Half Moulding Per Rft", SFT: 0, CFT: 0, RFT: 45 },
        { name: "Granite Full Moulding Per Rft", SFT: 0, CFT: 0, RFT: 90 },
        { name: "Granite Double Moulding Per Rft", SFT: 0, CFT: 0, RFT: 180 },
        { name: "Mason Per Nos", SFT: 1400, CFT: 0, RFT: 0 },
        { name: "Helper Per Nos", SFT: 900, CFT: 0, RFT: 0 }
    ];

    try {
        for (const flooring of flooringData) {
            const newSubwork = new Subwork({
                wid: wid, // Work ID reference
                name: flooring.name,
                default: {
                    SFT: flooring.SFT,
                    CFT: flooring.CFT,
                    RFT: flooring.RFT
                },
                details: [],
                reductions:[] // Empty details array for now
            });

            await newSubwork.save(); // Save the subwork to the database
        }
        console.log("Flooring subworks initialized successfully.");
    } catch (err) {
        console.error("Error initializing flooring subworks:", err);
    }
};
exports.painting = async (wid) => {
    const paintingData = [
        {
            name: "Interior Ceiling and Wall (2 coats Fine Putty + 1 coat of interior primer + 2 coats emulsion)",
            SFT: 8.0,
            CFT: 0
        },
        {
            name: "Exterior Wall and Ceiling (1 coat of interior primer + 2 coats Exterior emulsion)",
            SFT: 5.0,
            CFT: 0
        },
        {
            name: "Exterior Wall and Ceiling (2 coats of Base Coats + 2 coats of Top Coats)",
            SFT: 6.0,
            CFT: 0
        },
        {
            name: "Oil Paint - Window Gills & Doors (1 coat of primer + 2 coats Top coats)",
            SFT: 18.0,
            CFT: 0
        }
    ];

    try {
        for (const painting of paintingData) {
            const newSubwork = new Subwork({
                wid: wid, // Work ID reference
                name: painting.name,
                default: {
                    SFT: painting.SFT,
                    CFT: painting.CFT,
                    RFT: painting.RFT
                },
                details: [],
                reductions:[] // Empty details array for now
            });

            await newSubwork.save(); // Save the subwork to the database
        }
        console.log("Painting subworks initialized successfully.");
    } catch (err) {
        console.error("Error initializing painting subworks:", err);
    }
};