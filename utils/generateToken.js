import jwt from 'jsonwebtoken';

const generateToken = (userID) => {
    return jwt.sign({id: userID}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}

export default generateToken;