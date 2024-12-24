const router= require('express').Router();
const {AddUser,LoginUser,AddProject,AddWork,updateReduction,AddSubwork,deleteSubworkreduction,updateSubworkReduction,GetSubWorksDetailed,GenPdf,deleteWork,deleteSubWork,deleteProject,updateSubworkUnits,deleteSubwork,updateSubworkDetail,updateSubwork,GetWorks,GetSubWorks,GetProjects,addOrUpdateFields,getDefaultValues}=require('../controllers/controller');
const {excellformat,downloadsubworkPdf, downloadsubworkXcell}=require('../controllers/pdf');
const authenticateToken = require('../middleware/AuthMiddleware');

router.get('/',(req,res)=>{
    res.send('Hello World');
})

// add user 
router.post('/addUser',AddUser)
// loginuser
router.post('/loginUser',LoginUser);
//  Project 
router.post('/addProject/:uid',authenticateToken, AddProject);
router.delete('/deleteProject/:uid',authenticateToken, deleteProject);

//  Work 
router.post('/addWork/:pid',authenticateToken, AddWork);
router.delete('/deleteWork/:wid',authenticateToken, deleteWork);
//  Subwork 
router.post('/addSubWork/:wid',authenticateToken, AddSubwork);
router.put('/updateSubwork/:swid',authenticateToken,updateSubwork);
router.delete('/deletesubworkfield/:swid/:detailId',authenticateToken,deleteSubwork);
router.delete('/deletesubworkreduction/:swid/:detailId',authenticateToken,deleteSubworkreduction);
router.put("/updateSubworkDetail/:wid/:detailId",authenticateToken,updateSubworkDetail);
router.put("/updateSubworkReduction/:wid/:detailId",authenticateToken,updateSubworkReduction);
router.put("/save-units/:wid",authenticateToken,updateSubworkUnits);
router.put("/addreductions/:swid",authenticateToken,updateReduction);

router.delete('/deleteSubWork/:swid',authenticateToken, deleteSubWork);
// Default Values
router.post('/addDefault',authenticateToken, addOrUpdateFields);

// get projects
router.get('/getProjects/:uid',authenticateToken,GetProjects);
router.get('/getWorks/:pid',authenticateToken,GetWorks);


router.get('/getSubWorks/:wid',authenticateToken,GetSubWorks);

router.get('/getSubWorksDetailes/:wid',authenticateToken,GetSubWorksDetailed);
router.get('/getDefault/:userId',authenticateToken,getDefaultValues);


// Pdf generation
router.get('/pdf-generate/:wid',authenticateToken,GenPdf);
router.get('/subwork-pdf-generate/:swid',authenticateToken,downloadsubworkPdf);
router.get('/subwork-xcell-generate/:swid',authenticateToken,downloadsubworkXcell);
router.get('/xcel-generate/:wid',authenticateToken,excellformat);


module.exports=router;