router.post('/login',(req,res) => {
    User.findOne({email:req.body.email},(err,data) => {
        if(err) return res.status(500).send("Error while Login");
        // in case user not found
        if(!data) return res.send({auth:false,token:'No User Found Register First'});
        else{
            // compare password if user found
            // (userinput, password in db)
            const passIsValid = bcrypt.compareSync(req.body.password,data.password);
            // if password not match
            if(!passIsValid) return res.send({auth:false,token:'Invalid Password'});
            // generate token
            // (tell on which unqiue key, secret, expire time(3600 1 hrs))
            var token = jwt.sign({id:data._id},config.secret,{expiresIn:3600})
            //res.send({auth:true,token:token})

            if(!token) res.send({auth:false,token:'No Token Provided'})
            //if token provided ask jwt to check
            jwt.verify(token,config.secret,(err,data) => {
                if(err) res.send('Error while fetching')
                // get id from jwt token
                // find user on basis of id
                User.findById(data.id,(err,result) => {
                    res.send(result)
                })
            })

        }
    })
})