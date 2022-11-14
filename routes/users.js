var express = require('express');
const con = require('../config/config');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('admin/adminlogin');
});
router.get("/adminhome",(req,res)=>{
  if(req.session.admin){
    res.render("admin/adminHome")
  }
})
router.post('/adminlogin', (req, res) => {
  console.log(req.body.email)
  console.log(req.body.psw)
  let mail = "admin@gmail.com";
  let pass = "admin";
  let admindata={
    mail,
    pass
  }
  if (mail == req.body.email && pass == req.body.psw) {
    console.log("login success")
    req.session.admin=admindata;
    res.redirect("/users/adminhome")
  }
  else {
    console.log("login error")
    res.redirect("/users")
  }

})

router.post('/addproduct', (req, res) => {
  console.log("prduct addig root")
  console.log(req.body);
  console.log(req.files);
  if (!req.files) return res.status(400).send("no files were upload");
  var file = req.files.img;
  var upload_img = file.name;
  let sql = "insert into product set?"
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
    file.mv("public/images/products/" + file.name, function (err) {
      if (err) {
        res.send("error while upload image")
      } else {
        var data = req.body;
        data.img = upload_img;
        con.query(sql, data, (err, result) => {
          if (err) {
            console.log(err)
          }
          else {
            res.redirect("/users/adminhome")
          }
        })
      }
    })
  }
  else {
    console.log('uploading error')
  }
})
module.exports = router;
