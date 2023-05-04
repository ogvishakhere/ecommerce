var express = require('express');
var router = express.Router();
var con = require("../config/config")
/* GET home page. */
const { checkuser } = require("../middleware/checkuser")
let razorpay = require("../payment/razorpay")
// router.get('/', function (req, res, next) {
//       if(req.session.user){
//         res.render('user/online');
//       }
//   let sql = " select * from product"
//   con.query(sql, (err, products) => {
//     if (err) {
//       console.log(err)
//     } else {
//       if (req.session.user) {
//         console.log(products)
//         var user = req.session.user;
//         var userid = req.session.user.id;
//         let sql3 = "select count(*) as cartdata from cart where userid = ?"
//         con.query(sql3, [userid], (err, rows) => {
//           if (err) {
//             console.log(err)
//           } else {
//             let cart = rows[0].cartdata;
//             user.cart = cart;
//             res.render('user/online', { user, products });
//           }
//         })

//       } else {
//         console.log(products)
//         
//       }
//     }
//   });
// });
router.get('/',(req,res)=>{
        let sql = "select * from product";
        con.query(sql,(err,products)=>{
            if(err){
              console.log(err)
            }else{
              console.log(products)
              let user = req.session.user;
              res.render('user/online', { products,user });
            }
        })
     
})
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
        console.log("login failed ")
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



router.get('/addqty/:id', (req, res) => {
  var id = req.params.id;
  var userid = req.session.user.id;
  var sql = "select * from cart where id = ? and userid =?"
  con.query(sql, [id, userid], (err, row) => {
    if (err) {
      console.log(err)
    } else {
      var fqty = row[0].qty;
      if (newqty == 0) {
        newqty = 1;
      } else {
        var newqty = fqty + 1;
      }


      var sql2 = "update cart set qty =? where id =? and userid = ?"
    }
    con.query(sql2, [newqty, id, userid], (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        res.redirect('/mycart')
      }
    })
  })
});

router.get('/subqty/:id', (req, res) => {
  var id = req.params.id;
  var userid = req.session.user.id;
  var sql = "select * from cart where userid = ? and id =?"
  con.query(sql, [userid, id], (err, row) => {
    if (err) {
      console.log(err)
    } else {
      var fqty = row[0].qty;
      var newqty = fqty - 1;
      if (newqty == 0) {
        newqty = 1;
      }
      var sql2 = "update cart set qty =? where id =? and userid = ?"
    }
    con.query(sql2, [newqty, id, userid], (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        res.redirect('/mycart')
      }
    })
  })
});

router.get("/remove/:Id", (req, res) => {
  let id = req.params.Id;
  console.log(id)
  var sql = "delete from cart where id = ?";
  con.query(sql, [id], (err, row) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect("/mycart")
    }
  })
})
router.get("/createOrder/:amount",(req,res)=>{
  console.log (req.params.amount)
  let amount=parseInt(req.params.amount);
  console.log( typeof(amount))
  let user=req.session.user;
  var options={
    amount:amount * 100,
    currency:"INR",
    receipt:"order_rcptid_11"
  };
  razorpay.orders.create(options, function(err, order) {
    console.log(err);
    console.log(order);
    res.render('user/checkout',{order,user})
  });
})
router.post('/verify',async(req,res)=>{
  console.log(req.body);
  console.log("verify")
let data = req.body;
  var crypto = require('crypto')
  var order_id =data['response[razorpay_order_id]']
  var payment_id =data['response[razorpay_payment_id]']
  const razorpay_signature=data['response[razorpay_signature]']
  const key_secret="2WRH4p5ngXPANhYSCrrP1rxK";
  let hmac=crypto.createHmac('sha256',key_secret);
  await hmac.update(order_id + "|" + payment_id);
  const generated_signatue = hmac.digest('hex');
  console.log(razorpay_signature,generated_signatue)
  if(razorpay_signature === generated_signatue){
   console.log("verified transaction")
   let sql="update cart set status = 'purchased' where userid = ?"
   let userid=req.session.user.id;
   con.query(sql,[userid],(err,result)=>{
    if(err){
      console.log(err)
    }else{
      res.redirect('/myorders')
    }
   })
  }
      else{
        console.log("payment error..")
  }
}
)
router.get('/myorders',(req,res)=>{
  var sql= "select products.price,products.id,products.name,products.description,products.img,cart.qty from products inner join cart on products.id=cart.productid where cart.userid = ? and cart.status ='purchased' " 
  let userid=req.session.user.id;
  let user = req.session.user;
  con.query(sql,[userid],(err,result)=>{
    if(err){
      console.log(err)
    }else{
      let orderedProducts = result
      console.log(orderedProducts)
      res.render("user/myorders",{user,orderedProducts})
    }
  })
})

module.exports = router;

