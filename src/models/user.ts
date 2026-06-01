import pool from '../db';

type User = {
  id: string;
  email: string;
  passwordHash: string;
  role?: string;
};

export async function findUserByEmail(email: string) {
  const res = await pool.query('SELECT id, email, password_hash AS "passwordHash", role FROM users WHERE email = $1', [email]);
  return res.rows[0] as User | undefined;
}

export async function findUserById(id: string) {
  const res = await pool.query('SELECT id, email, password_hash AS "passwordHash", role FROM users WHERE id = $1', [id]);
  return res.rows[0] as User | undefined;
}

export async function createUser(user: User) {
  const res = await pool.query(
    'INSERT INTO users(id, email, password_hash, role) VALUES($1,$2,$3,$4) RETURNING id, email, password_hash AS "passwordHash", role',
    [user.id, user.email, user.passwordHash, user.role || 'user']
  );
  return res.rows[0] as User;
}

export async function saveRefreshToken(userId: string, token: string) {
  await pool.query('INSERT INTO refresh_tokens(user_id, token) VALUES($1,$2)', [userId, token]);
}

export async function removeRefreshToken(userId: string, token: string) {
  await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1 AND token = $2', [userId, token]);
}

export async function isRefreshTokenValid(userId: string, token: string) {
  const res = await pool.query('SELECT 1 FROM refresh_tokens WHERE user_id = $1 AND token = $2 LIMIT 1', [userId, token]);
  return res.rowCount != null && res.rowCount > 0;
}
//
export async function returnProjectsOverview(sector: string,payload : any) {
  let filterBuild =''
  // if(payload['project_name'] != null && payload['project_name'] != undefined && payload['project_name']!='' )
  //   filterBuild += ` AND "Project_Name"='${payload['project_name']}' `
  // if(payload['project_date'] != null && payload['project_date'] != undefined && payload['project_date']!='' )
  //   filterBuild += ` AND "Date" = '${payload['project_date']}'`
  const query = `Select "Days_To_Finish","Project_Name","ID","Net_Income","Status", "Date"::text from public."Projects" Where "Sector" = $1 ${filterBuild} ;`
  const res = await pool.query(query,[sector]);
  return res.rows.map(row => row); 
}
//
export async function returnProjectDetails(projectId: string) {
  const query = `SELECT SUM("Expenses") AS total from public."Project_Details" Where "Project_ID" = $1;`
  const res = await pool.query(query,[parseInt(projectId)]);
  if (res.rows[0].total != null && res.rowCount != null &&res.rowCount > 0) return res.rows[0].total; 
  else return 0
}

export async function returnPartners() {
  const query = `SELECT * FROM public."Partners";`;
  return pool.query(query).then(data=>{
    if(data.rowCount != null && data.rowCount > 0) return data.rows.map(row => row['First_Name']+' '+ row['Second_Name'] +' '+ row['ID']);
    else return []

  });
}

export async function selectPartners() {
  const query = `SELECT * FROM public."Partners";`;
  return pool.query(query).then(data=>{
    if(data.rowCount != null && data.rowCount > 0) return data.rows
    else return []
  });
}

export async function requestPartnersContribution() {
  const query = `SELECT * FROM public."Partners";`;
  const res = await pool.query(query);
  return res.rows;
}

export async function requestPartners(partnerID: string) {
  const queryName = `SELECT "First_Name", "Second_Name", "Third_Name" FROM public."Partners" WHERE "ID" = $1;`;
  const queryID = `SELECT * FROM public."Partners_Contribution" WHERE "First_Name" = $1 AND "Second_Name" = $2 AND "Third_Name" = $3;`;
  return pool.query(queryName, [parseInt(partnerID)]).then(data=>{
    if(data.rowCount != null && data.rowCount > 0 && data.rows[0] != null){
      return pool.query(queryID,[data.rows[0].First_Name,data.rows[0].Second_Name,data.rows[0].Third_Name]).then(data_=>{
        if(data_.rowCount != null && data_.rowCount > 0 && data_.rows[0] != null){
          let sum = 0
          data_.rows.forEach((row)=>{
            sum += parseInt(row.Amount);
          })
          return {data_: data_.rows, total: [{total: sum}]}
        }
        else return []
      })
    }
  }).catch(err=>{return err});
  
}

export async function addPartner(partner : any) {
  const query2 = `Select Max("ID") as max FROM public."Partners"`;
  return pool.query(query2).then(async(data)=>{
    console.log(data.rows)
    let largest = 1;
    if(data.rowCount != null && data.rowCount > 0 && data.rows[0].max != null)  largest = parseInt( data.rows[0].max)+1;
    const query = `INSERT INTO public."Partners" ("First_Name", "Second_Name", "Third_Name", "ID") VALUES ($1, $2, $3,$4) RETURNING *;`;
    const res = await pool.query(query, [partner['First_Name'], partner['Second_Name'], partner['Third_Name'],largest]);
    if(res.rowCount != null && res.rowCount > 0)
      return res.rows[0];  
    else return []
  })
  
}
// 
export async function returnProjectImages(projectId: string) {
  const query = "Select \"imgae\" from public.\"Project_Images\" Where \"Project_ID\" = $1;";
  const res = await pool.query(query, [projectId]);
  if(res.rowCount != null && res.rowCount > 0)
    return res.rows.map(row => row); 
  else return []
}

//
export async function setProjectImages(projectId: string, images : Express.Multer.File[]) {
  images.forEach(async element => {
  const queryUpdate = " Insert Into public.\"Project_Images\"(\"Project_ID\" , \"imgae\") VALUES($1, $2);"; 
    await pool.query(queryUpdate, [projectId, element.buffer]);
  });
}

export async function requestTaxesExpenses(sector : string)
{
  let queryString : string = '';
  queryString = `Select T."Name",E."Withdraw_Amount", E."Date"::text FROM public."Taxes" T 
                INNER JOIN public."Sector_Withdraw" E 
                ON T."Expenses_ID" = E."ID"
                WHERE T."Sector" = $1;`
  return pool.query(queryString,[sector]).then((data)=>{
    if(data.rowCount != null && data.rowCount > 0)
    return data.rows;
  else return []
  }).catch((err)=>{
    console.log(err)
    return err;
  })
}

export async function requestStaffExpenses(sector : string){
  let queryString : string = ``
  queryString = `Select S2."First_Name",S2."Second_Name", E."Withdraw_Amount" ,S."Bonus",S."Cuts"  FROM public."StaffExpenses" S
                INNER JOIN public."Sector_Withdraw" E 
                ON S."Expenses_ID" = E."ID"
				        INNER JOIN public."Staff" S2
                ON S2."ID"= S."Staff_ID"
				        WHERE S2."Sector_Name" = $1`
  return pool.query(queryString,[sector]).then((data)=>{
    if(data.rowCount != null && data.rowCount > 0)
    return data.rows;
    else return []
  }).catch((err)=>{
    console.log(err)
    return err;
  })
}

export async function returnExpenses(value: string) {
  
  let query =''
  if(value && Object.keys(value).length > 0){
    if(value === '1'){
    query = "SELECT e.\"Amount\", e.\"Date\"::text,t.\"Name\"FROM public.\"Expenses\" e JOIN public.\"Taxes\" t ON e.\"ID\" = t.\"Expenses_ID\";";}
    else if(value  === '2' as string){query = "SELECT e.\"Amount\", e.\"Date\"::text,t.\"Name\"FROM public.\"Expenses\" e JOIN public.\"Materials\" t ON e.\"ID\" = t.\"Expenses_ID\";";}
    else if(value === '3'){query = "SELECT s.\"First_Name\", e.\"Amount\", e.\"Date\"::text FROM public.\"Expenses\" e JOIN public.\"StaffExpenses\" t ON e.\"ID\" = t.\"Expenses_ID\" JOIN public.\"Staff\" s ON t.\"Staff_ID\" = s.\"ID\";";}
  }
  const res = await pool.query(query);
  if(res.rowCount != null && res.rowCount > 0)
    return res.rows.map(row => row); 
  else return []
  }


export async function returnStaff(sector : string){
  const query = "SELECT \"First_Name\" , \"Second_Name\" , \"Third_Name\" , \"ID\" FROM public.\"Staff\" WHERE \"Sector_Name\" = $1;";
  const res = await pool.query(query,[sector]);
  if(res.rowCount != null && res.rowCount > 0)
  return res.rows.map(
    row => {
      let name = row['First_Name'] +" "+ row['Second_Name']+" " + row['Third_Name'];
      let id = row['ID'];
      return {name , id};

  })
  else return []
}

export async function reqeustStaffSalaryReg(requestBody : {id:number,salary : number,bonus: number, cuts: number,sector : string}) {
  let query = ``;
  query = `SELECT MAX("ID") FROM public."Sector_Withdraw"`
  let InID = 0;
  pool.query(query).then((data)=>{
    InID = 1
    if(data.rows[0].max != null && data.rowCount !=null && data.rowCount > 0) InID = parseInt(data.rows[0].max) + 1
    query = `INSERT INTO public."Sector_Withdraw" ("ID","Withdraw_Amount","Details","Date","Sector_Name") VALUES ($1,$2,$3,$4,$5)`
    pool.query(query,[InID , requestBody.salary,"راتب",new Date().toISOString(),requestBody['sector']]).then(
    (data)=>{
      query = `INSERT INTO public."StaffExpenses" ("Expenses_ID","Staff_ID","Bonus","Cuts") VALUES ($1,$2,$3,$4)`
      pool.query(query,[InID,requestBody.id,requestBody.bonus,requestBody.cuts]).then((data)=>{
        updateSectorCapital(requestBody.sector,(requestBody.salary + requestBody.bonus - requestBody.cuts) * -1)
      })
    }
  )
  })
  

}
  


export async function returnImages(id: string) {
  try{
  const query = "SELECT \"imgae\" FROM public.\"Project_Images\" Where \"Project_ID\" = $1;";
  const res = await pool.query(query,[id]);  
  return {res: res.rows, rowCount: res?.rowCount || 0};
  }catch(err){
    console.error('Error fetching images:', err);
    return { rowCount: 0};
  }
}

// export async function returnSectorsCapital(){
//   const query = `SELECT 
//     COALESCE(inv."Sector_Name", p."Sector_Name") AS sector_name,
//     inv.total_amount AS investment_total,
//     p.total_amount AS partners_total,
//     COALESCE(inv.total_amount,0) + COALESCE(p.total_amount,0) AS combined_total
// FROM (
//     SELECT isc."Sector_Name", SUM(i."amount") AS total_amount
//     FROM public."Investment_Sector_Contribution" isc
//     JOIN public."Investment" i
//       ON isc."Investment_ID" = i."ID"
//     GROUP BY isc."Sector_Name"
// ) inv
// FULL OUTER JOIN (
//     SELECT "Sector_Name", SUM("Amount") AS total_amount
//     FROM public."Partners_Sector_Contribution"
//     GROUP BY "Sector_Name"
// ) p
// ON inv."Sector_Name" = p."Sector_Name"
// ORDER BY sector_name ASC;
// `;
//   const res = await pool.query(query);
//   return res.rows.map(row => row);
// }
export async function getCompanyCapitals() {
  try {
    const totalCapitalResult = await pool.query(
      'SELECT * FROM public."Sector" ORDER BY "ID" DESC;'
    );

    // const totalPartnersContribution = await pool.query(`
    //   SELECT SUM("Amount") as total_contribution FROM public."Partners_Contribution"`)

    // const totalPartnersWithdraw = await pool.query(`
    //   SELECT SUM("Amount") as total_withdraw FROM public."Partners_Withdraw"`)

    // const sectorCapitalResult = await pool.query(
    //   'SELECT "Sector_Name", SUM("Amount") AS "Sector_Capital_Records" FROM public."Investment_Sector_Contribution" GROUP BY "Sector_Name";'
    // );

    // const sectorWithdrawResult = await pool.query(
    //   'SELECT "Sector_Name", SUM("Withdraw_Amount") AS "Sector_Withdraw_Records" FROM public."Sector_Withdraw" GROUP BY "Sector_Name";'
    // );

    
    // let sectorsCapital = sectorCapitalResult.rows;
    // let companyCapital =  totalCapitalResult.rows[0]?.Total_Capital_Records ?? 0
    // let partnersWidraw = totalPartnersWithdraw.rows[0]?.total_withdraw ?? 0
    // let partnersCapital = totalPartnersContribution.rows[0]?.total_contribution ?? 0;
    // let sectorsWithdraw =  sectorWithdrawResult.rows;
    if (totalCapitalResult.rowCount != null)
      return totalCapitalResult.rows
    else return []
  } catch (err) {
    console.error('getCompanyCapitals error:', err);
    throw err;
  }
}
export async function returnSectors(){
  const query = `SELECT "Sector_Name" FROM public."Sector" Order BY "ID" DESC;`;
  const res = await pool.query(query);
  return res.rows.map(row => row['Sector_Name']);
}

export async function setProjectPaymentContribution( projectID : string, details : {sector : string ,amount:string,details:string,date:string,contributor :string ,stoppages: string}) {
  let query = ``;
  getSectors().then((sectors)=>{
    if(sectors){
      const queryLID = `SELECT MAX("ID") AS Largest_ID FROM public."Sector_Withdraw";`
      pool.query(queryLID).then((res)=>{
        const largestID = res.rows[0]?parseInt(res.rows[0]['largest_id'])+1 : 0;
        
        query = `INSERT INTO public."Sector_Withdraw"("Withdraw_Amount", "Details", "Sector_Name", "ID","Date") VALUES ($1,$2,$3,$4,$5) `
        pool.query(query,[parseInt(details.amount),details.details,details.contributor, largestID,details.date]).then(
          (res)=>{
            const PPCLID = `SELECT MAX("ID") "ID" FROM public."Project_Payment_Contribution"`
            pool.query(PPCLID).then((res)=>
              {
              const queryInsertToProject_Payment = `INSERT INTO public."Project_Payment_Contribution" ("ID","Project_ID","Sector_Withdraw_ID") VALUES ($1,$2,$3)`
              pool.query(queryInsertToProject_Payment,[res.rows[0].ID+1,projectID,largestID]).then(dataIn=>{
                updateSectorCapital(details['sector'],parseInt(details.amount) * -1)
              })
            });
            
          }
      );  
      });
      
    }
  }).catch((err)=>{return err});
  
  //await pool.query(query, [details['amount'], details['contributor'], JSON.stringify(details)]);
}

export async function setProjectExpenses(projectID: number, details:{expenses : number,expensesDetails: string,date: string}){
  let query = ``;
  query = `SELECT MAX("ID") as ID FROM public."Project_Details"`
  pool.query(query).then((res)=>{
    console.log(res.rows)
    let largest = 1
    if(res.rowCount != null  && res.rowCount > 0 && res.rows[0].id != null) largest =parseInt(res.rows[0].id)+1;
    query = `INSERT INTO public."Project_Details"("Expenses", "Expenses_Details", "Date", "Project_ID", "ID")
    VALUES ($1,$2,$3,$4,$5);`  
    pool.query(query,[details.expenses,details.expensesDetails,details.date,projectID,largest]).then((result)=>{
    })
    return true;
  }).catch(()=> {return false})
  
}

export async function getSectors(){
  const query = `SELECT "Sector_Name" FROM public."Sector" ORDER BY "ID" DESC;`;
  const res = await pool.query(query);
  return res.rows;
}

export async function requestProjectFinish(projectID : string){
  const query = `UPDATE public."Projects" SET "Status" = 'Done' WHERE "ID" = $1;`
  return pool.query(query,[parseInt(projectID)]).then(data=>{
    let query2 = `SELECT 
    ppc."Project_ID",
    SUM(I."Payment") AS total_payment
    FROM "Investors" I
    JOIN "Project_Payment_Contribution" ppc
        ON I."ID" = ppc."Investors_ID"
    WHERE ppc."Project_ID" = $1
    GROUP BY ppc."Project_ID";`
    return pool.query(query2,[parseInt(projectID)]).then((data)=>{
      let result = 0
      if(data.rowCount != null && data.rowCount > 0 && data.rows[0].total_payment) result = parseInt(data.rows[0].total_payment)
      else result = 0;
        return returnProjectDetails(projectID).then(data_=>{

          let expenses = 0
          if(data_ != null && data_ != undefined) expenses = data_
          updateSectorCapital('الرئيسية', result - expenses)
          pool.query(
            `Update public."Projects" SET "Net_Income" = $1 Where "ID" = $2`,[result - expenses, parseInt(projectID)]
          )
        })
      //   pool.query(
      //     `Select max("ID") as max From public."Investment"`).then(res_2=>{
      //       let queryQ = `INSERT INTO public."Investment" ("ID","Project_ID","amount") 
      //                 VALUES ($1,$2,$3) ` 
        
      //   if(data.rowCount != null && data.rowCount > 0)
      //     pool.query(queryQ,[parseInt(res_2.rows[0].max)+1, parseInt(projectID),result - expenses]).then(res1=>{
      //       pool.query(
      //         `Update public."Projects" SET "Net_Income" = $1 Where "ID" = $2`,[result - expenses, parseInt(projectID)]
      //       )
      //     })
        
      //   else pool.query(queryQ,[parseInt(res_2.rows[0].max)+1,parseInt(projectID),0]).then(ress=>{
      //     pool.query(
      //         `Update public."Projects" SET "Net_Incom" = $1 Where "ID" = $2`,[result - expenses, parseInt(projectID)]
      //       )
      //   })
      //     })
        
      // //return data;
      // })
    
    })
      
  })
}



export async function requestMaterialExpenses(sector : string){
  let queryString : string = '';
  let secNum : string = sector;
  queryString = `Select M."Name",E."Withdraw_Amount", E."Date"::text FROM public."Materials" M 
                INNER JOIN public."Sector_Withdraw" E 
                ON M."Expenses_ID" = E."ID"
                WHERE M."Sector" = $1;`
  return pool.query(queryString,[secNum]).then((data)=>{
    return data.rows;
  }).catch((err)=>{
    return err;
  })
}

export async function requestExpensesReg(payload :any){
  console.log(payload)
  let query = ``;
  let maxExpen = 0
  let table = ''
  switch(payload['type']){
    case 'موجودات' : table = 'Materials' ; break;
    case 'تشغيلية':
    case 'نهائية' : table = 'Taxes'; break;
  }
  query = `SELECT MAX("ID") FROM public."Sector_Withdraw"`
  return pool.query(query).then((data)=>{
  maxExpen = 1
  console.log(data.rows)
  if(data.rows[0].max != null && data.rowCount != null && data.rowCount > 0 ) maxExpen= parseInt(data.rows[0].max)+1;
  query = `INSERT INTO public."Sector_Withdraw" ("ID","Withdraw_Amount","Details","Date","Sector_Name") VALUES ($1,$2,$3,$4,$5)`
  return pool.query(query,[maxExpen,payload['expenses'],payload['details'],payload['date'],payload['sector']]).then((data)=>{
    if(table === 'Materials'){
      query = `SELECT MAX("ID") FROM public."Materials"`
      let max_In = 1
      pool.query(query).then((data)=>{
        query = `INSERT INTO public."Materials" ("ID","Name","Expenses_ID","Sector") VALUES ($1,$2,$3,$4)`
        if(data.rows[0].max != null && data.rowCount != null && data.rowCount > 0) {max_In  = data.rows[0].max+1}
        pool.query(query,[max_In, payload['details'],maxExpen,payload['sector']]).then(data=>{
          updateSectorCapital(payload['sector'],payload['expenses'] * -1)
        })
      })
      

    }else if(table ==='Taxes'){
      query = `SELECT MAX("ID") FROM public."Taxes"`
      pool.query(query).then((data_)=>{
        let max_in_ = 1
        if(data_.rows[0].max != null && data_.rowCount != null && data_.rowCount > 0) max_in_ = data_.rows[0].max
        query = `INSERT INTO public."Taxes" ("ID","Name","Expenses_ID","Sector") VALUES ($1,$2,$3,$4)`
        pool.query(query,[max_in_+1, payload['details'],maxExpen,payload['sectorToNum']]).then(data=>{
          updateSectorCapital(payload['sector'],payload['expenses'] * -1)
        
      })
      })
      
    }
  })
  })
}

export async function requestAddNewProject(project: any){
  try {
    const maxRes = await pool.query(`SELECT MAX("ID") as max FROM public."Projects"`);
    const maxVal = maxRes.rows[0]?parseInt(maxRes.rows[0].max) : 0;
    const newId = Number(maxVal || 0) + 1;

    const insertQuery = `INSERT INTO public."Projects" ("Project_Name","ID","Sector","Status","Location","Init_Cost","Days_To_Finish","Date") VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    const values = [
      project.projectName ?? project.Project_Name ?? null,
      newId,
      project.sector ?? project.Sector ?? null,
      project.status ?? 'Pending',
      project.projectLoc ?? project.Location ?? null,
      project.projectInitCost ?? project.Init_Cost ?? null,
      project.projectFinishDays ?? project.Days_To_Finish ?? null,
      project.date ?? project.date ?? null
    ];

    const res = await pool.query(insertQuery, values);
    return res.rows[0];
  } catch (err) {
    console.error('requestAddNewProject error:', err);
    throw err;
  }
}

export async function addStaffMember(payload: any) {
  const maxRes = await pool.query(`SELECT MAX("ID") as max FROM public."Staff"`);
  let max = 1
  if(maxRes.rows[0].max != null && maxRes.rowCount != null && maxRes.rowCount > 0) max = maxRes.rows[0].max
  const maxVal = max
  const newId = Number(maxVal || 0) + 1;

  const insertQuery = `INSERT INTO public."Staff" ("First_Name","Second_Name","Third_Name","ID","Sector_Name") VALUES ($1,$2,$3,$4,$5) RETURNING *`;
  const values = [
    payload.firstname ?? payload.firstName ?? null,
    payload.secondname ?? payload.secondName ?? null,
    payload.thirdname ?? payload.thirdName ?? null,
    newId,
    payload.sector  ?? payload.sectorName ?? null
  ];

  const result = await pool.query(insertQuery, values);
  return result.rows[0];
}

export async function requestProjectMonetary(projectID: number){
  let query1 = `SELECT 
    ppc."Project_ID",
    SUM(sw."Withdraw_Amount") AS Total_Withdraw
    FROM "Sector_Withdraw" sw
    JOIN "Project_Payment_Contribution" ppc
        ON sw."ID" = ppc."Sector_Withdraw_ID"
    WHERE ppc."Project_ID" = $1
    GROUP BY ppc."Project_ID";`
    
  let query2 = `SELECT 
    ppc."Project_ID",
    SUM(I."Payment") AS Total_Payment,
    SUM(I."Sub_Amount") AS Sub_Amount
    FROM "Investors" I
    JOIN "Project_Payment_Contribution" ppc
        ON I."ID" = ppc."Investors_ID"
    WHERE ppc."Project_ID" = $1
    GROUP BY ppc."Project_ID";`
  let query3 = `SELECT 
              SUM("Expenses") AS Total_Expenses
              FROM "Project_Details"
              WHERE "Project_ID" = $1;`
  let query4 = `SELECT"Init_Cost" FROM "Projects"  
                WHERE "ID" = $1
                `
                
    return pool.query(query1,[projectID]).then((res)=>{
      const totalSectorCont = parseInt(res.rows[0]?.total_withdraw || 0);
      return pool.query(query2,[projectID]).then((res)=>{
        const totalInvestorCont = parseInt(res.rows[0]?.total_payment || 0)
        const subAmount = parseInt(res.rows[0]?.sub_amount || 0)
        return pool.query(query3,[projectID]).then((res)=>{
          const totalExpenses = parseInt(res.rows[0]?.total_expenses || 0);
          return pool.query(query4,[projectID]).then((res)=>{
            const initCost = res.rows[0]?.Init_Cost || 0;
            const income = totalInvestorCont - totalExpenses;
            return {Init_Cost : initCost , Income : income, Expenses : totalExpenses,Total_Contribution : totalInvestorCont , Sector_Contribution : totalSectorCont, Stoppages : subAmount}; 
      })
    })})}).catch((err)=>{
      return [err]
      console.error('Error calculating project monetary details:', err);
    });
  
}

export async function requestAddPartnerSectorContribution(payload : any) {
  try {
    const query = `SELECT "First_Name", "Second_Name", "Third_Name", CONCAT("First_Name", "Second_Name", "Third_Name") AS "ConcatenatedName" FROM public."Partners"
                  WHERE "First_Name"= $1 AND "Second_Name" = $2 AND "Third_Name" = $3 `;

    const payloadAmount = payload['amount'];
    const payloadDate = payload['date'];
    const res = await pool.query(query,payload['name']);

    if (res.rowCount == null && res.rowCount == 0) {
      return null;
    }

    const insertQuery = `INSERT INTO public."Partners_Contribution" ("First_Name", "Second_Name", "Third_Name", "Amount", date) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
    const insertValues = [
      payload['name'][0],
      payload['name'][1],
      payload['name'][2],
      payloadAmount,
      payloadDate,
    ];

    const insertRes = await pool.query(insertQuery, insertValues);
    if(insertRes.rowCount != null && insertRes.rowCount > 0){
      updateSectorCapital('الرئيسية', payloadAmount)
    }
    else return []
    
  } catch (err) {
    console.error('Error in requestAddPartnerSectorContribution:', err);
    throw err;
  }
}

export async function requestAddPartnerContribution(payload : any){
  return pool.query(
    `INSERT INTO public."Partners_Contribution"("First_Name", "Second_Name", "Third_Name", "Amount", date)
    VALUES ($1,$2,$3,$4,$5);`, [payload['First_Name'],payload['Second_Name'],payload['Third_Name'],payload['Amount'],new Date().toISOString()]).then(data=>{
      return data.rows
    })
}

export async function requestMainToSectorTransfer(payload : any){
  updateSectorCapital(payload['sector'],payload['amount'])
  updateSectorCapital('الرئيسية',payload['amount'] *-1)
  
}

export async function requestMainToPartnerTransfer(payload : any){
  
  let query = `INSERT INTO public."Partners_Withdraw" ("Amount","Date","First_Name","Second_Name","Third_Name")
              VALUES ($1,$2,$3,$4,$5) RETURNING * `
    return pool.query(query,[payload['Amount'],payload['Date'],payload['First_Name'],payload['Second_Name'],payload['Third_Name']]).then((data)=>{
      updateSectorCapital('الرئيسية', (payload['Amount'] * -1))
      return data.rows;
    })  
  
}

export async function requestAddInvestorToProjectContribution(payload : any) {
  pool.query(`
    Select max("ID") as max From "Investors"`).then(data=>{
    let largest = 1
    if(data.rowCount != null && data.rowCount > 0 && data.rows[0].max != null) largest = parseInt(data.rows[0].max) +1
    const query = `
    INSERT INTO public."Investors"
    ("ID","First_Name", "Second_Name", "Third_Name", "Payment", "Details", "Date", "Project_ID", "Sub_Amount")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)
    RETURNING *;
  `;
  pool.query(query,[largest,payload.First_Name,
    payload.Second_Name,
    payload.Third_Name,
    payload.Payment,
    payload.Details,
    payload.Date,
    payload.Project_ID,
    payload.Sub_Amount]).then(data=>{
      pool.query(
        `Select max("ID") as max From public."Project_Payment_Contribution"`
      ).then(PPCData=>{
        let IDe = 1
        if(PPCData.rowCount !=null && PPCData.rowCount > 0 && PPCData.rows[0].max != null) IDe = PPCData.rows[0].max +1
        const query = `
        INSERT INTO public."Project_Payment_Contribution"
        ("ID","Investors_ID", "Project_ID")
        VALUES ($1, $2,$3)
        RETURNING *;
      `;
      const values = [
        IDe,
        data.rows[0].ID,  // integer
        data.rows[0].Project_ID     // integer
      ];
      pool.query(query,values)
      })
      
    })
    })
  
}

export async function returnProjectExpenses(projectID : number) {
  let SectorWithdrawQuery = 
  `SELECT *
    FROM public."Project_Payment_Contribution" PPC
    INNER JOIN public."Sector_Withdraw" SW
    ON PPC."Sector_Withdraw_ID" = SW."ID"
    WHERE PPC."Project_ID" = $1`
  let InvestorsContQuery = 
  `SELECT *
    FROM public."Project_Payment_Contribution" PPC
    INNER JOIN public."Investors" Inv
    ON PPC."Investors_ID" = Inv."ID"
    WHERE PPC."Project_ID" = $1`
  let ProjectExpensesQuery = `
    SELECT "Expenses","Expenses_Details","Date" 
    FROM public."Project_Details"
    WHERE "Project_ID" = $1`
  
return pool.query(SectorWithdrawQuery,[projectID]).then(data=>{
  return pool.query(InvestorsContQuery,[projectID]).then(data2=>{
    return pool.query(ProjectExpensesQuery,[projectID]).then(data3=>{
      return {sector_contribution : data.rows, investors_contribution : data2.rows,expenses : data3.rows}
    })
    
  })
})
}

function updateSectorCapital(sector : string , amount : number){
  pool.query(
        `SELECT "Capital" , "Sector_Name" FROM public."Sector" WHERE "Sector_Name" = $1`,[sector]
      ).then(dataInCap=>{
        if(dataInCap.rowCount != null && dataInCap.rowCount > 0){
          let capital = parseInt(dataInCap.rows[0].Capital) + amount;
          pool.query(
            `UPDATE public."Sector" SET "Capital" = $1 WHERE "Sector_Name" = $2`,[capital,sector]
          ).then(inDat=>{
            if(inDat.rowCount != null )return inDat;
            else return []
          })
          
        }
      })
}