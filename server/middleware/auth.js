const jwt = require('jsonwebtoken');
exports.auth=async(req,resp,next)=>{
    // console.log("STARt of AUTH")
    const token=req.header("Authorization")?.replace("Bearer ","");
    if(!token){
        return resp.json({
            success:false,
            message:"Token Missing"
        })
    }
    // console.log("TOken in backend-",token);
   try {
        const payload = jwt.verify(token, "HELLO");
        // console.log("DECODED in Auth--", payload);
        req.user=payload;
    }
    catch (err) {
        console.log("Error in Verifying Token", err)
    }
    next();
}
