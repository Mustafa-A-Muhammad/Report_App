import express, { NextFunction } from 'express';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {returnProjectExpenses,requestAddInvestorToProjectContribution,requestMainToPartnerTransfer,requestMainToSectorTransfer,requestAddPartnerContribution,requestAddNewProject,requestStaffExpenses,requestTaxesExpenses, requestProjectFinish ,setProjectPaymentContribution, returnProjectsOverview ,createUser, findUserByEmail, findUserById, saveRefreshToken, isRefreshTokenValid, removeRefreshToken, returnStaff, returnExpenses, setProjectImages, returnImages, getSectors, setProjectExpenses, reqeustStaffSalaryReg, requestMaterialExpenses, requestExpensesReg, addStaffMember, returnPartners, returnSectors, requestProjectMonetary, addPartner, selectPartners, getCompanyCapitals, requestAddPartnerSectorContribution, requestPartnersContribution, requestPartners } from '../models/user';
import multer from 'multer';
import { fileTypeFromBuffer } from "file-type";

const router = express.Router();
const ACCESS_SECRET: jwt.Secret = process.env.ACCESS_SECRET ?? 'dev_access_secret';
const REFRESH_SECRET: jwt.Secret = process.env.REFRESH_SECRET ?? 'dev_refresh_secret';
const ACCESS_EXPIRES = process.env.ACCESS_EXPIRES ?? '15m';
const REFRESH_EXPIRES = process.env.REFRESH_EXPIRES ?? '7d';

let requestAuthenticated = false;
function checkRequestAuth(req: express.Request , res: express.Response , next: express.NextFunction) {
  // Check for Authorization header
  let requestAuthHeader = req.headers['authorization'];
  
  if(requestAuthHeader !== undefined && requestAuthHeader.split(' ')[0] === 'Bearer'){
    if(requestAuthHeader.split(' ').length > 0)
      {
        
        let payload : jwt.JwtPayload | string
        try{
            payload= jwt.verify(requestAuthHeader.split(' ')[1],ACCESS_SECRET) as jwt.JwtPayload;
            if(typeof payload !== 'string' && payload.exp !== undefined)
              if(payload.exp >= Math.floor(Date.now() / 1000)){
                
                
                requestAuthenticated = true;
              }
        }catch(err){
            requestAuthenticated = false;
        } 
    }
    else if(requestAuthHeader.split(' ').length <= 0){
        
        requestAuthenticated = false;
    }
  }
  else{
    requestAuthenticated = true;
  }
  next(); // continue to next middleware/route
}

const upload = multer(); // keep files in memory


router.post("/upload", upload.array("file",10), (req, res) => {
  
  setProjectImages(req.body.projectId, req.files as Express.Multer.File[]); // Example project name, replace with actual logic
  res.send("Upload successful");
});

router.get('/sectors/capital', async (req, res) => {
  try { 
    const sectors = getSectors();
    res.json({ sectors});
  }catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }}
);

router.post('/payment/contribution', async (req, res) => {
  try {
        const { projectId, contribution } = req.body;
        setProjectPaymentContribution(projectId, contribution).then((result=>{
          res.json({ message: 'Payment contribution recorded successfully' ,result});
        }));
   
  }catch (err) {
      res.json({message:'Payment contribution FAILD'});
  }
});

router.post('/project/details',(req,res)=>{
  try{
      const  {projectID , details} = req.body;
      
      setProjectExpenses(projectID,details)
      res.json({message : 'Project Expenses Done'})
  }catch(err){
    res.json({message : 'Project Expenses FAILD'})
  }
})

router.post('/project/add', (req, res) => {
  try {
    const project = req.body;
    
    // TODO: persist project using model function if implemented
    requestAddNewProject(project);
    res.json({ message: 'Project added', project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/images/:id', async (req, res) => {
  try {
    const images = await returnImages(req.params.id);
    if (images?.rowCount > 0) { 
    res.setHeader("Content-Type", "application/json"); // Set appropriate content type based on your image format
    res.send(images.res);
    }
    else res.status(404).json({ message: 'No images found for this project' });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
    try {
      
      const { email, password, role } = req.body.payload;
      if (!email || !password) return res.status(400).json({ message: 'email and password required' });
      const existing = await findUserByEmail(email);
      if (existing) return res.status(409).json({ message: 'User exists' });
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await createUser({ id: uuidv4(), email, passwordHash, role: role || 'user' });
      res.json({ id: user.id, email: user.email });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  

});

router.post('/projects', async (req, res) => {
      const projects = await returnProjectsOverview(req.body.sector as string,req.body.payload);
      
      res.json({ projects: projects });
});

router.get('/projects/:id',(req,res)=>{
  
    const id = req.params.id;
    if(id && typeof id === 'string')
    {
        requestProjectFinish(id).then((res_)=>{
          res.json({total_income :res_})
        });
      
    }
})

router.get('/staff/:id', async(req,res)=>{
    const id = req.params.id;
    const staff = await returnStaff(id);
    res.json(staff);
});

router.post('/staff/add', async (req, res) => {
  try {
    const staff = await addStaffMember(req.body);
    res.json(staff);
  } catch (error) {
    console.error('staff/add error:', error);
    res.status(500).json({ error: 'Failed to add staff member' });
  }
})

router.post('/staff/salary/:id',(req,res)=>{
  const id = req.params.id;
  
  reqeustStaffSalaryReg(req.body).then((data)=>{
    res.json(data);
  })

})

router.post('/sector/expenses/:id',(req, res)=>{
  const id = req.params.id;
  requestExpensesReg(req.body.data).then((data)=>{
  })
  res.json("recived")
})



router.post('/drawer-items', async(req,res)=>{
   getSectors().then((data)=>{
    res.json(data)
   })
   
});





router.post('/login', async (req, res) => {
  if(!requestAuthenticated){  
    try {
    
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      ACCESS_SECRET,
      { expiresIn: ACCESS_EXPIRES as jwt.SignOptions['expiresIn'] }
    );
    const refreshToken = jwt.sign(
      { sub: user.id },
      REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRES as jwt.SignOptions['expiresIn'] }
    );
    await saveRefreshToken(user.id, refreshToken);
    res.json({ accessToken, refreshToken , user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
  }
  else{
    return res.status(409).json({ message: 'User is authenticated/expired' });
  }
  
});

router.post('/refresh', async (req, res) => {
 
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });
      try {
        const payload: any = jwt.verify(refreshToken, REFRESH_SECRET);
        const userId = payload.sub as string;
        const valid = await isRefreshTokenValid(userId, refreshToken);
        if (!valid) return res.status(401).json({ message: 'Invalid refresh token' });
        // rotate
        await removeRefreshToken(userId, refreshToken);
        const newRefresh = jwt.sign({ sub: userId }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES as jwt.SignOptions['expiresIn'] });
        await saveRefreshToken(userId, newRefresh);
        const user = (await findUserById(userId)) || { id: userId, email: undefined, role: 'user' } as any;
        const accessToken = jwt.sign({ sub: userId, email: user.email, role: user.role }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES as jwt.SignOptions['expiresIn'] });
        res.json({ accessToken, refreshToken: newRefresh });
      } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
  
});

router.post('/logout', async (req, res) => {
  if(!requestAuthenticated){
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });
    try {
      const payload: any = jwt.verify(refreshToken, REFRESH_SECRET);
      await removeRefreshToken(payload.sub, refreshToken);
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: 'Invalid token' });
    }
  }
  else{
    return res.status(409).json({ message: 'User is authenticated/expired' });
  }
  
});

function checkUserCredentials(requestPayload: express.Request): boolean {
  const authHeader = requestPayload.headers['authorization'];
  if (!authHeader || typeof authHeader !== 'string') return false;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return false;
  try {
    jwt.verify(parts[1], ACCESS_SECRET);
    return true;
  } catch (err) {
    return false;
  }
}

router.get('/taxes/expenses/:value', async(req,res)=>{
 
    
    const expenses = await requestTaxesExpenses(req.params.value);
    res.json(expenses);
  
});

router.get('/materials/expenses/:id',(req,res)=>{
  
  const sector = req.params.id;
  requestMaterialExpenses(sector).then((data)=>{
    res.json(data);
  })

})

router.get('/staff/expenses/:id',(req , res)=>{
  const id = req.params.id;
  
  requestStaffExpenses(id).then((data)=>{
    res.json(data)
  })
})

router.post('/percentage-labels',(req, res)=>{
  returnPartners().then((data)=>{
    res.json(data)
  })
})

router.get('/project/monetary/:id',(req,res)=>{
  const id = parseInt(req.params.id);
  requestProjectMonetary(id).then(data=>{
    res.json(data);
  })
})

router.post('/partner/add',(req,res)=>{
  const body = req.body
  addPartner(body).then((data)=>{
    res.json(data)
  })
  
})

router.get('/partners',(req,res)=>{
  selectPartners().then((data)=>{
    res.json(data)
  })
  
})

router.get('/partner-contribution', async (req, res) => {
  try {
    const partners = await requestPartnersContribution();
    res.json(partners);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/partner-contribution', async (req, res) => {
  try {
    const { partnerID } = req.body;
    console.log('Received partnerID:', partnerID); // Debug log
    const contribution = await requestPartners(partnerID);
    res.json(contribution);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/company-capital',(req,res)=>{
  getCompanyCapitals().then((data)=>{
    res.json({data});
  })
  
})

router.post('/partner/contribution', (req , res)=>{
  let payload = req.body;
  requestAddPartnerSectorContribution(payload).then(res_=>{
    res.json(res_);
  })
})

router.post('/partners/contributionDemo',(req,res)=>{
  requestAddPartnerContribution(req.body).then((data)=>{
    res.json(data)
  })
})

router.post('/main-sector-transfer',(req,res)=>{
  requestMainToSectorTransfer(req.body).then(data=>{
    res.json(data)
  })
})

router.post('/main-partner-transfer',(req,res)=>{
  requestMainToPartnerTransfer(req.body)
})

router.post('/investor-to-project-contribution',(req, res)=>{
  if(req.body != null && req.body != undefined && Object.keys(req.body).length > 0){
    requestAddInvestorToProjectContribution(req.body).then(data=>{
      res.json(data)
    })
  }
})

router.post('/projects-report',(req,res)=>{
  returnProjectExpenses(req.body.Project_ID).then(data=>{
    res.json(data);
  })
})

export  {router , checkUserCredentials};
