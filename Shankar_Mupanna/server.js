const express=require('express');
const passport=require('passport');
const app=express();
const LocalStrategy=require('passport-local').Strategy;
app.use(express.json());                       // this line is a middleware that allows us to parse JSON data from the request body.
const requestLogger=(req,res,next)=>{
    console.log("Request URL :-",req.url,"Request Method :-",req.method,"Request date :-",new Date().toLocaleString);
    next();
}

app.use(requestLogger);                       // this line is a middleware that allows us to log the request URL, method and date of the request.

passport.use(new LocalStrategy((username,password,done)=>{
    const user = users.find((u)=>u.username==username);
    if(!user){
        return done(null,false,{message:"Incorrect Username"});
    }
    if(user.password!=password){
        return done(null,false,{message:"Incorrect Password"});
    }
    return done(null,user);
}));

app.use(passport.initialize());

const isAuthenticated=passport.authenticate('local',{session:false});

let hotels=[];
let users=[];

app.post("/register",(req,res)=>{
    try{
        console.log(req.body);
        const newUser={
            id:users.length+1,
            name:req.body.name,
            username:req.body.username,
            email:req.body.email,
            password:req.body.password
        };
        users.push(newUser);
        res.status(200).json({message:"User Registered Successfully"});
        
    } catch (error){
       res.status(500).json(error);
    }
})

app.post("/login",isAuthenticated,(req,res)=>{
    try{
        res.status(200).json({message:"User Logged In Successfully"});
    } catch (error){
        res.status(500).json(error);
    }
})

app.get("/",(req,res)=>{
    res.status(200).json({message:"Welcome to Hotel"});
});

app.get("/hotels",(req,res)=>{
    try{
        res.status(200).json(hotels);
    }catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }
});

// we can write request and response in any name but it is a good practice to write them as req and res.
// 200 and 500 are status codes for success and error respectively. 
// 200 means the request was successful and 500 means there was an internal server error.

app.get("/hotels/:id", (req,res)=>{
    try{
        const hotel=hotels.find((c)=>c.id==req.params.id);
        if(!hotel){
            res.status(404).json({message:"Hotel Not Found"});
        }else{
            res.status(200).json(hotel);
        }
    } catch (error){
        response.status(500).json(error);
    }
})

app.post("/hotels",isAuthenticated, (req,res)=>{
    try{
        const newHotel={
            id:hotels.length+1,
            name:req.body.name,
            location:req.body.location,
            rating:req.body.rating,
            pricePerNight:req.body.pricePerNight
        }
        hotels.push(newHotel);
        res.status(201).json({message:"Hotel Created Successfully"});
    } catch (error){
        res.status(500).json(error);
    }
})

app.put("/hotels/:id",isAuthenticated, (req,res)=>{
    try{
        const hotel=hotels.find((c)=>c.id==req.params.id);
        if(!hotel){
            return res.status(404).json({message:"Hotel Not Found"});
        } else{
            hotel.name=req.body.name;
            hotel.location=req.body.location;
            res.status(200).json({message:"Hotel Updated Successfully"});
        }
    } catch (error){
        res.status(500).json(error);
    }
})

app.delete("/hotels/:id",isAuthenticated, (req,res)=>{
    try{
        const hotelIndex=hotels.findIndex((c)=>c.id==req.params.id);
        if(hotelIndex==-1){
            return res.status(404).json({message:"Hotel Not Found"});
        }else{
        hotels.splice(hotelIndex,1);
        res.status(200).json({message:"Hotel Deleted Successfully"});
    }
    } catch (error){
        res.status(500).json(error);
    }
})

app.listen(4000,()=>{
    console.log("Server is running on port 4000");
})