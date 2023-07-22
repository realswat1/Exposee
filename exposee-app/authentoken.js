import pkg from 'jsonwebtoken'; 
const {verify} =pkg;

function validate_Token (req , res, next){
    const access_Token = req.header("access_Token");
    if (!access_Token) return res.json({error: "user not logged in"});
    try{
        const validtoken = verify(access_Token, "iamtheSwat1*");
        if (validtoken){
            return next();
        }
    }catch(err){
        return res.json({error:err});
    }
};
export default validate_Token;
