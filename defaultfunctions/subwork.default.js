const Subwork = require('../models/Subworks.js');
const Work = require('../models/Works.js');
const { foundation,masonry,centering,flooring,painting } = require('./subworkinitialization/utils.js');
exports.initializeSubwork = async (wid) => {
    // search name 
    const workname = await Work.findOne({ _id: wid });
    // if (workname.name) {

        switch (workname.name) {
            case "foundation":
                return await foundation(wid);
            case "masonry":
                return await masonry(wid);
            case "centering":
                return await centering(wid);
            case "flooring":
                return await flooring(wid);
            case "painting":
                return await painting(wid);
            default:
                return;
        }
    // }

};