import Users from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userSchema from "../dto/register.dto.js";
import loginSchema from "../dto/login.dto.js";

export const getUsers = async(req,res) => {
    try{
        const users = await Users.findAll({
            attributes:['id','name','email']
        });
        res.json(users);
    } catch(error){
        console.log(error);
    }
}

export const Register = async(req,res) => {
    
    const { error } = userSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');
        return res.status(400).json({ status: 'fail', message: errorMessage });
    }

    const {name,email,password,confirmPassword} = req.body;
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ status: 'fail', message: 'Email is already registered' });
    }

    if (password !== confirmPassword) return res.status(400).json({status: "fail", message:"Password and confirm password must match"});
    
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password,salt);
    try{
        await Users.create({
            name: name,
            email: email,
            password: hashPassword
        });
        res.json({status: "success", message: "Registration Successful"})
    } catch(error){
        console.log(error);
    }
}

export const Login = async(req,res) => {
    try{

        const { error } = loginSchema.validate(req.body);

        if (error) {
            const errorMessage = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');
            return res.status(400).json({ status: 'fail', message: errorMessage });
        }

        const user = await Users.findOne({where:{
            email: req.body.email
        }});
        const match = await bcrypt.compare(req.body.password,user.password);
        if (!match) return res.status(400).json({status: "fail", message: "Wrong Password"});

        const userId = user.id;
        const name = user.name;
        const email = user.email;
        const accessToken = jwt.sign({userId,name,email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({userId,name,email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });

        await Users.update({refresh_token:refreshToken},{
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken',refreshToken,{
            httpOnly: true,
            maxAge: 24*60*60*1000
        });
        res.json({accessToken});
    } catch (error){
        res.status(404).json({status: "fail", message:"Email not found"})
    }
}

export const refreshToken = async(req,res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);
        const user = await Users.findOne({
            where:{
                refresh_token: refreshToken
            }
        });
        if (!user) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);
            const userId = user.id;
            const name = user.name;
            const email = user.email;
            const accessToken = jwt.sign({userId,name,email}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '15s'
            });
            res.json({accessToken});
        });
    } catch (error){
        console.log(error);
    }
}

export const Logout = async(req,res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await Users.findOne({
        where:{
            refresh_token: refreshToken
        }
    });
    if (!user) return res.sendStatus(204);
    const userId = user.id;
    await Users.update({refresh_token:null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}