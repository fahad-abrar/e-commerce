import jwt from 'jsonwebtoken'

const signInJwt = (user)=>{

    // make a payload to store in the token
    const payload ={
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
    const SECRET = process.env.JWT_SECRET
    const EXPIRES = process.env.JWT_EXPIRES

    // to sign in jwt
    const token = jwt.sign(payload, SECRET, {
        expiresIn: EXPIRES
    })

    // return the sing in token
    return token

}

export default signInJwt
