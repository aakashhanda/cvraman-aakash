// find all hotels by city

const { db } = require("../jwt/model/UserSchema")

// select * from hotels where city=Mumbai
db.hotels.find({city_name:"Mumbai"}).pretty()

//projection {condition},{projection}
db.hotels.find({},{})

//all hotels names
db.hotels.find({},{name:1})

//all hotels names where city = mumbai
db.hotels.find({"city_name":"Mumbai"},{name:1,city_name:1})

//get all hotels where room type is 1
db.hotels.find({"type.roomtype":"1",city_name:'Manali'},{name:1,city_name:1})

//hotel with price less than 500

db.hotels.find({cost:{$gt:4000,$lt:5000}},{name:1,cost:1,_id:0})