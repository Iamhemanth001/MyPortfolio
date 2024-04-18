require("dotenv").config();
const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const mongoose =  require('mongoose');
const User = require("./models/feedback.js");
const app = express();

const PORT = process.env.PORT || 5000;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended : true}));

try{
    app.listen(PORT,()=>{
        console.log(`App is listing on the PORT ${PORT}`);
    })
}catch(err){
    res.send("Got Some Error");
    console.log(err);
}

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connection Successful");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

main();

app.get("/home",(req,res)=>{
    res.render("home.ejs");
})

app.post("/home/contact",async (req,res)=>{
        const {name,email,message} = req.body;
        try {
            await User.create({
              name,
              message,
              email
            }).then((res)=>{
                console.log(res);
            }).catch((err)=>{
                console.log(err);
                res.send("Got Some Error");
            });
          } catch (err) {
            console.error(err);
          }
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ar.lifts007@gmail.com',
                pass: 'eamq otgz qksc vkqa'
            }
        });
        
        let mailOptions = {
            from: "ar.lifts007@gmail.com",
              to: email,
              subject: "Appreciation for Your Feedback on My Portfolio Website",
              text: `Dear ${name},
I hope this email finds you well. I wanted to take a moment to express my sincere gratitude for the valuable feedback you provided on my portfolio website. Your insights and suggestions have been immensely helpful in improving the user experience and overall quality of the website.
              
Your feedback regarding My Portfolio was particularly insightful, and I have already implemented some of the recommended changes based on your input. Your contribution has contributed significantly to enhancing the functionality and visual appeal of the website.
        
I truly appreciate your time and effort in providing constructive feedback. Your support and encouragement mean a lot to me as I strive to create an engaging and professional online presence.
        
Thank you once again for your valuable input. I look forward to sharing further updates with you as I continue to enhance my portfolio website.

Best regards,
Hemanth Kumar`, 
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) { 
                console.log(error);
                return res.send("Got Some Error");
            } else {
                console.log('Email sent: ' + info.response);
                res.render("thank.ejs");
            }
        });
})


