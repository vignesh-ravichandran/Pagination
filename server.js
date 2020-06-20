const express=require('express');
const sql=require('./modals/db.js');
const bodyParser=require('body-parser');
const md5 = require('md5');



const app=express();

app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));



app.get('/',(req,res)=>{

    res.render('login');
})

//home after login
app.post('/login',(req,res)=>{

    const formUsername=req.body.username;
    const formPassword=req.body.password;

    sql.query(`SELECT username, password, salt FROM ilance_users WHERE username="${formUsername}"`, function (err, result, fields) {
        if (err) throw err;
        
        const dbPassword=result[0].password;
        const dbSalt=result[0].salt;
       
       
       const hased=md5(md5(formPassword)+dbSalt);

       if(dbPassword===hased){
        res.render("home");
       }else{
            res.redirect('/');
       }     
       });   
   
})

//home without login for test
app.get('/testhome',(req,res)=>{

    
    res.render('home');
})

//project list data

app.post('/projects',(req,res)=>{
    let page=1;
    const perpage=2;
    let totalrecords=0;
    let sortvar='date_added DESC';
    let numberofpages=0;
    sql.query("SELECT ilance_projects.project_title AS projecttitle, ilance_users.username As user FROM ilance_projects JOIN ilance_users ON ilance_projects.user_id=ilance_users.user_id", function (err, result, fields) {
        if (err) throw err;
       totalrecords=result.length;       
       //actual
       numberofpages=parseInt(totalrecords/perpage);
      

      const limit=parseInt(req.body.page);
      if(req.body.page!=undefined){
          
          page=req.body.page;
      }
      if(req.body.sortby!=undefined){
         
          sortvar=req.body.sortby;
      }
    
      let offsetvar= 2* (page-1);
      
      
      sql.query(`SELECT ilance_projects.project_title AS projecttitle, ilance_projects.date_added, ilance_users.username As user, ilance_categories.category AS category FROM ilance_projects JOIN ilance_users ON ilance_projects.user_id=ilance_users.user_id LEFT JOIN ilance_categories ON ilance_projects.cid=ilance_categories.cid ORDER BY ${sortvar} LIMIT 2 OFFSET ${offsetvar}`, function (err, result, fields) {
        if (err) throw err;
       //console.log(result);
       
       const data={
           pageno: numberofpages,
           list: result
       }
       
      res.json(data);

      });
      
      }); 
      
    });




app.listen(5000,()=>{
    console.log('server is listening at 5000');
})