module.exports={
    checkuser :(req,res,next)=>{
        if(req.session.user){
            console.log("sessioncreated",req.session.user)
            next();
        }
        else{
            res.redirect("/");
        }
    }
}