const { Router } = require("express")
const { z } = require("zod")
const { userModel } = require("../db")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')

const userRouter = Router()

userRouter.post("/signup", async function(req, res){
    
    // adding zod validation
    const requireBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(8).max(30).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/),
        firstName: z.string().min(3).max(16),
        lastName: z.string().min(3).max(16)
    })

    const parseDataWithSuccess = requireBody.safeParse(req.body)

    if(!parseDataWithSuccess.success) {
        res.json({
            message: "Incorrect format",
            error: parseDataWithSuccess.error
        })
        return
    }

    const {email, password, firstName, lastName} = req.body;

    try {
        //password hashing
        const hashedPassword = await bcrypt.hash(password, 5);

        // creating userModel
        await userModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
        })
    } catch (e) {
        console.log("Error while putting it into the DB");
        
    }

    res.json({
        message: "Signup succeeded"
    })
})

userRouter.post("/signin", async function(req, res) {
    const {email, password} = req.body

    const user =  await userModel.findOne({
        email: email
    })

    if (!user) {
        res.status(403).json({
            message: "User does not exist in our DB"
        })
        return
    }
    const matchedPassword = await bcrypt.compare(password, user.password)

    if (matchedPassword) {
        const token = jwt.sign({
            id: user._id.toString()
        }, process.env.JWT_USER_PASSWORD)

        res.json({
            message: "Signin successful",
            token: token
        })
    } else {
        res.status(403).json({
            message: "Incorrect password"
        })
    }
})

module.exports = {
    userRouter: userRouter
}