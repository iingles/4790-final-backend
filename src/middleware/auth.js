import jwt from 'jsonwebtoken'

export const createTokens = (user) => {
    const accessToken = jwt.sign({
        userId: user._id.toString(),
        email: user.email
    },
    process.env.ACCESS_TOKEN_SECRET,

    {
        expiresIn: '7d'
    }
    )

    const refreshToken = jwt.sign({
        userId: user._id.toString(),
        email: user.email
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: "7d"
    }
    )

    return {
        refreshToken,
        accessToken
    }
}

export const auth = (req, res, next) => {
    const authHeader = req.get('Authorization')

    
    // If there is no authorization header, set isAuth to false and go to the next middleware
    if (!authHeader) {
        req.isAuth = false
        return next()
    }
    
    

    const token = authHeader.split(' ')[1]
    let decodedToken
    // console.log("token: " + token + "\n")
    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    } catch (err) {
        // console.log(req.isAuth)        
        return next()
    }

    // If the decoded token is undefined, set isAuth to false

    if (!decodedToken) {
        req.isAuth = false
        return next()
    }
    
    // If we make it here, set isAuth to true
    req.userId = decodedToken.userId
    req.isAuth = true
    
    next()
}