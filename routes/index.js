var express = require('express');
var router = express.Router();
var con = require("../config/config")
/* GET home page. */
const { checkuser } = require("../middleware/checkuser")
router.get('/', function (req, res, next) {

  let sql = " select * from product"
  con.query(sql, (err, products) => {
    if (err) {
      console.log(err)
    } else {
      if (req.session.user) {
        console.log(products)
        var user = req.session.user;
        var userid = req.session.user.id;
        let sql3 = "select count(*) as cartdata from cart where userid = ?"
        con.query(sql3, [userid], (err, rows) => {
          if (err) {
            console.log(err)
          } else {
            let cart = rows[0].cartdata;
            user.cart = cart;
            res.render('user/online', { user, products });
          }
        })

      } else {
        console.log(products)
        res.render('user/online', { products });
      }
    }
  });
});

router.get('/user', function (req, res, next) {
  res.render('user');
});
router.get('/mycart', function (req, res, next) {
  var user = req.session.user;
  let userid = user.id;
  var total = 0;
  var sql = "select product.id,product.Name,product.Price,product.Description,product.Img	,cart.id,cart.productid,cart.userid,cart.qty from product inner join cart on product.id =cart.productid where cart.userid=?";
  con.query(sql, [userid], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
      let product = result;
      product.forEach(object => {
        console.log(object.Price)
        total = object.Price * object.qty + total;
      });
      console.log("total:", total)
      let GST = (total * 18) / 100;
      let subTotal = total + GST;
      user.total = total;
      user.GST = GST;
      user.subTotal = subTotal;
      res.render("user/mycart", { user, product })
    }
  })
});


router.get('/userlogin', function (req, res, next) {
  res.render('user/userlogin');
});
router.get('/userregister', function (req, res, next) {
  res.render('user/userregister');
});

router.post('/Regdata', function (req, res, next) {
  console.log(req.body.email)
  let usermail = req.body.email;
  let sql = "select * from user where email = ?";
  con.query(sql, [usermail], (err, row) => {
    if (err) {
      console.log(err)
    }
    else {
      if (row.length > 0) {
        console.log("this email exist")
      } else {
        let data = req.body;
        let q = "insert into user  set ? ";
        con.query(q, data, function (err, result) {
          if (err) {
            console.log(err)
          } else {
            console.log("data inserted")
            res.redirect('/userlogin')
          }
        })
      }
    }
  })
  console.log(req.body)
});
router.post('/Logdata', function (req, res, next) {
  console.log(req.body)
  let email = req.body.email;
  let password = req.body.psw;
  let sql = "select * from user where email =? and password =?"
  con.query(sql, [email, password], (err, row) => {
    if (err) {
      console.log(err)
    } else {
      if (row.length > 0) {
        console.log("login success")
        req.session.user = row[0];
        res.redirect('/')
      } else {
        console.log("login unsuccesfull")
      }
    }
  })
});

router.get("/Addtocart/:id", checkuser, (req, res) => {
  console.log(req.params.id);
  let productid = req.params.id;
  userid = req.session.user.id;
  let sql1 = "select * from cart where userid = ? and productid=?";
  con.query(sql1, [userid, productid], (err, row) => {
    if (err) {
      console.log(err)
    } else {
      if (row.length > 0) {
        let q = row[0].qty;
        let cartid = row[0].id;
        q = q + 1;
        let sql2 = " update cart set qty=? where id=?"
        con.query(sql2, [q, cartid], (err, results) => {
          if (err) {
            console.log(err)
          } else {
            res.redirect("/")
          }
        })
      } else {
        let data = {
          productid,
          userid

        }
        let sql = "insert into cart set ?"
        con.query(sql, data, (err, result) => {
          if (err) {
            console.log(err)
          }
          else {
            res.redirect('/')
          }
        })
        console.log("Add to cart is working...")
      }
    }
  })




});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect('/')
})


  
  router.get('/addqty/:id',(req, res)=>{
    var id =req.params.id;
    var userid =req.session.user.id;
    var sql = "select * from cart where id = ? and userid =?"
    con.query(sql, [id,userid], (err,row)=>{
      if(err){
        console.log(err)
      }else{
        var fqty = row[0].qty;
        if(newqty==0){
          newqty=1;
        }else{
          var newqty = fqty+1;
        }

       
        var sql2 = "update cart set qty =? where id =? and userid = ?"}
        con.query(sql2, [newqty,id,userid], (err, result) => {
          if (err) {
            console.log(err)
          }
          else {
            res.redirect('/mycart')
          }
        })
      } )
    });
  
router.get('/subqty/:id',(req, res)=>{
  var id =req.params.id;
  var userid =req.session.user.id;
  var sql = "select * from cart where userid = ? and id =?"
  con.query(sql, [userid, id], (err,row)=>{
    if(err){
      console.log(err)
    }else{
      var fqty = row[0].qty;
      var newqty = fqty-1;
      if(newqty==0){
        newqty=1;
      }
      var sql2 = "update cart set qty =? where id =? and userid = ?"}
      con.query(sql2, [newqty,id,userid], (err, result) => {
        if (err) {
          console.log(err)
        }
        else {
          res.redirect('/mycart')
        }
      })
    } )
  });

router.get("/remove/:Id",(req,res)=>{
  let id=req.params.Id;
  console.log(id)
  var sql = "delete from cart where id = ?";
  con.query(sql,[id],(err,row)=>{
    if(err){
      console.log(err)
    }else{
      res.redirect("/mycart")
    }
  })
})

  module.exports = router;
  
  