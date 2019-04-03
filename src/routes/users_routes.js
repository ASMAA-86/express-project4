import { BadParamsError } from "../lib/custom_errors";
import models from "./../db/models";
import passport from "passport"
import express  from "express"
import jwt from "jsonwebtoken";
const tokenAuth = passport.authenticate("jwt", { session: false });
const localAuth = passport.authenticate("local", { session: false });
const User = models.User;

// instantiate a router (mini app that only handles routes)
const router = express.Router();

router.post("/sign-up", (req, res, next) => {
  // start a promise chain, so that any errors will pass to `handle`
  Promise.resolve(req.body.credentials)
    .then(credentials => {
      if (
        !credentials ||
        !credentials.password ||
        credentials.password !== credentials.password_confirmation
      ) {
        throw new BadParamsError();
      } else {
        console.log(credentials)
        return User.create({
          email: credentials.email,
          hashedPassword: credentials.password,
          name: credentials.name,
          phone: credentials.phone,
          address:  credentials.address,
          car:  credentials.car,
          cost: parseFloat(credentials.cost),
          avalable: credentials.avalable
        })
      }
    })
    .then(user => {

   
      const payload = {
        id: user.id,
        email: user.email,
        expires: process.env.JWT_EXPIRATION_D + "d"
      };

      // assigns payload to req.user
      req.login(payload, { session: false }, error => {
        if (error) {
          next();
        }

        // generate a signed json web token and return it in the response
        const token = jwt.sign(JSON.stringify(payload), process.env.PASS_KEY);

        // assign our jwt to the cookie
        res
          .cookie("jwt", token, { httpOnly: true, secure: false })
          .status(201)
          .json({ id: req.user.id, email: req.user.email });
      });
    })
    // pass any errors along to the error handler
    .catch(e => next(e));
});

router.post("/sign-in", localAuth, (req, res, next) => {
  if (req.user) {
    // This is what ends up in our JWT
    const payload = {
      id: req.user.id,
      email: req.user.email,
      expires: process.env.JWT_EXPIRATION_D + "d"
    };

    // assigns payload to req.user
    req.login(payload, { session: false }, error => {
      if (error) {
        next();
      }

      // generate a signed json web token and return it in the response
      const token = jwt.sign(JSON.stringify(payload), process.env.PASS_KEY);

      // assign our jwt to the cookie
      res
        .cookie("jwt", token, { httpOnly: true, secure: false })
        .status(200)
        .json({ id: req.user.id, email: req.user.email });
    });
  }
});

router.patch("/change-password", tokenAuth, (req, res, next) => {
  if (!req.body.passwords.new) throw new BadParamsError();

  User.findOne({
    where: {
      email: req.user.email
    }
  })
    .then(user => {
      if (user != null) {
        if (user.validPassword(req.body.passwords.old)) {
          user.bcrypt(req.body.passwords.new);

          res.status(200).json({ msg: "success" });
        } else {
          throw new BadParamsError();
        }
      } else {
        throw new BadParamsError();
      }
    })
    .catch(e => (next));
});




//To show all trainer in Home Page?
router.get('/api/users',(req,res)=>{

  models.User.findAll().then(users => {
      res.status(200).json({users: users});
  }).catch(e => console.log(e));
  })


  //To update one user
router.patch("/api/user/:id", (req, res, next) => {
  //console.log('id is ', req.params.id);
  //console.log('body is ', req.body);
  //using id to find the user
  //using update method to modify data
  User.findByPk(req.params.id)
    .then(user => {
      return user.update({
        email: req.body.user.email,
        name: req.body.user.name,
        phone: req.body.user.phone,
        address:  req.body.user.address,
        car: req.body.user.car,
        cost: req.body.user.cost,
        avalable: req.body.user.avalable
      })
    })
    .then(user => res.status(200).json(user))
    .catch(e => console.log(e));
});


//To show one user
router.get("/user/:id",(req,res,next)=>{
  //For test
  //res.status(200).json({ msg: 'still working'});
  models.User.findByPk(req.params.id).then(user =>
      {
  res.status(200).json({user:user})
      }).catch(e => console.log(e));
  
  })

  
  //To post is already when they sign up
   

  //To delete one user
  router.delete('/api/user/:id', (req, res, next) => {
    models.User.findByPk(req.params.id)
    //person is reference to the record
    .then(user => {
        user.destroy()
        .then(()=>{res.status(200).json({
            result:`Record ID ${req.params.id} Deleted`,
            success: true
        });
        
    })
    .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
});


export default router;

