import jwt from 'jsonwebtoken';

export const verifyToken = async ( req , res , next ) => {
    try {
        let token = req.header("Authorization");                            // We are accessing the token which is present in the req header

        if(!token){
            return res.status(403).send( " Access denied ");
        }

        if(token.startsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token , process.env.JWT_SECRET);        // Verifying the jwt token
        req.user = verified;                                                // Once it is marked as verified we execute the further actions

        next();

    } catch (error) {
        res.status(500).json({ error : error.message })
    }
}