
const app = Sammy("#container",function(){
    this.use('Handlebars', 'hbs');
    /**
     * {
     *  _id: number,
     *  maker: string no longer than 50 characters,
     *  make: must be at least 4 symbols long, 
     *  model: must be at least 4 symbols long,
     *  year: must be between 1950 and 2050,
     *  description: must be more than 10 symbols,
     *  price: must be a positive number,
     *  imageURL: is required
     *  material: no longer than 20 character - is optional
     * }
     * {
        _id:1,
        maker:"temp",
        img:"imgURL",
        make:" the make",
        model:"a chair, probablt",
        year:2020,
        description:"this is an item",
        price:22,        
       } 
     */
    let loggedIn =false;
    let allFurnature = [
        // {
        //     _id:1,
        //     maker:"user",
        //     img:"imgURL",
        //     make:" the make",
        //     model:"a chair, probablt",
        //     year:2020,
        //     description:"this is an item",
        //     price:22,  
        //     material:"(Not Avaiable)"      
        //    }
    ]; //array of furniture objects
    let currentID= allFurnature.length+1;
  
   
    /**
     * (POST) /furniture/create -- create route and post down
     * All Furniture (GET): /furniture/all -- Home route
        Furniture Details (GET): /furniture/details/:_id -- details route
        My Furniture (GET): /furniture/mine 
        Delete Furniture (DELETE):  /furniture/delete/:_id
    */
    class RouteController{
        handleHome(context){
            
            context.loggedIn  = loggedIn;
            context.load("./views/header.hbs")
            .then((partial) => {
                //console.log(partial);
                context.partials={
                    header:partial
                };
                let url = "https://baas.kinvey.com/appdata/kid_B1FtXe9zD/furniture";
                let jsonData={
                    //mode: 'cors', // no-cors, *cors, same-origin
                    // credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization':"Basic Z3Vlc3Q6Z3Vlc3Q="
                      
                    },
                    //redirect: 'follow', // manual, *follow, error
                    //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    // body: JSON.stringify(data) // body data type must match "Content-Type" header
                  };
                //Basic Z3Vlc3Q6Z3Vlc3Q=
                fetch(url,jsonData).then((response)=>{
                    console.log(response.ok);
                    if(response.ok){
                        response.json().then((response)=>{
                            console.log(response);
                            allFurnature = response; 
                            context.hasFurniture = (allFurnature.length>0 ? true:false);
                            context.furnitureItem = allFurnature;
                            context.partial('./views/home.hbs');
                        });
                    }
                    else{
                        console.log("ERROR! "+ response.status);
                        console.log(response);
                    }
                });
               
            });
        }
        handleDetails(context){

            const id = context.params.id;
            let url = "https://baas.kinvey.com/appdata/kid_B1FtXe9zD/furniture/"+id;
            console.log(url)
            let jsonData={
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':"Basic Z3Vlc3Q6Z3Vlc3Q="
                },
            };
            //Basic Z3Vlc3Q6Z3Vlc3Q=
            fetch(url,jsonData).then((response)=>{
                console.log(response.ok);
                if(response.ok){
                    response.json()
                    .then((response)=>{
                        console.log(response);
                        const details = response;
                        // console.log(details);
                         context.loggedIn  = loggedIn;
                         context.load("./views/header.hbs")
                        .then((partial) => {
                             //console.log(partial);
                            context.partials={
                                header:partial
                            };
                            context.details = details;
                            context.partial('./views/details.hbs');
                        });
                        
                    });
                }
                else{
                    console.log("ERROR! "+ response.status);
                    console.log(response);
                }
            });
        }
        handleProfile(context){
            context.loggedIn  =loggedIn;
            //console.log(user)
            const userFurniture = allFurnature.filter(furniture => furniture.maker ==  window.sessionStorage.getItem("user"));
            //console.log(userFurniture);
            context.hasFurniture = (userFurniture.length>0 ? true:false);
            context.load("./views/header.hbs")
            .then((partial) => {
                //console.log(partial);
                context.partials={
                    header:partial
                };
                    
                    context.myFurnature = userFurniture;
                    context.partial('./views/profile.hbs');
                });
        }
        handleCreate(context){
            context.loggedIn  = loggedIn;
            context.load("./views/header.hbs")
            .then((partial) => {
                //console.log(partial);
                context.partials={
                    header:partial
                };
                // context.myFurnature = allFurnature;
                context.partial('./views/create.hbs');
            });
        }
        handleLogin(context){
            context.loggedIn  = loggedIn;
            context.load("./views/header.hbs")
            .then((partial) => {
                //console.log(partial);
                context.partials={
                    header:partial
                };
                // context.myFurnature = allFurnature;
                context.partial('./views/login.hbs');
            });
        }
    }
    class DataController{
        deleteItem(context){
            console.log("deleted Furnature!");
            allFurnature = allFurnature.filter(furniture => furniture._id != context.params._id);
            console.log(allFurnature);
            //TODO: Reoving data from the array
            //TODO Later:delete item from db
            this.redirect("#/furniture/mine");
        }
        addItem({ params }){
            console.log("Item Added!");
            //TODO: add data to the array
            //https://image.shutterstock.com/image-photo/light-wooden-tabletop-table-on-600w-514179574.jpg 
            //https://unsplash.com/photos/s7IIk_2dA7g 
            const {make, model,year, description, price, img, material } = params;
            //console.log(material)
            let passed =true;
            
            let makePass = make.length >= 4;
            let modelPass = model.length >= 4;
            let yearPass = year >=1950 && year <= 2050;
            let desPass = description.length > 10;
            let pricsPass = price > 0;
            let imgPass = validURL(img);
            let matPass = true;
            if(material != ""){
                matPass = material.length <= 20;
            }
            passed = makePass & modelPass & yearPass &
                    desPass & pricsPass & imgPass & matPass;
            if(passed){
                let furniture = {
                    make,
                    model,
                    year, 
                    description, 
                    price, 
                    img, 
                    material:(material!=""? material:"(Not Avaiable)")
                };
                
                allFurnature.push(furniture);

                this.redirect("#/furniture/mine");
            }   else{
                document.getElementById("errorBox").style.display = "block";
                if(!makePass){
                 document.getElementById('new-make').classList.add("is-invalid");
                }
                if(!modelPass){
                 document.getElementById('new-model').classList.add("is-invalid");
                }
                if(!yearPass){
                    document.getElementById('new-year').classList.add("is-invalid");
                }
                if(!desPass){
                    document.getElementById('new-description').classList.add("is-invalid");
                }
                if(!pricsPass){
                    document.getElementById('new-price').classList.add("is-invalid");
                }
                if(!imgPass){
                    document.getElementById('new-image').classList.add("is-invalid");
                }
                if(!matPass){
                    document.getElementById('new-material').classList.add("is-invalid");
                }
                  
            }
           
            //TODO Later:Add data to db
        }
        login({ params }){
            console.log("logged in");
            const { email, password } = params;

            let url = "https://baas.kinvey.com/user/kid_B1FtXe9zD/login";
            console.log(url);
            let auth = btoa(`${email}:${password}`);
            console.log(auth);
            // "Basic a2lkX0IxRnRYZTl6RDo2NjVmNDg4Y2FjMjY0ZjE4OTMyMWJkYzA3NmFiMWVlNg=="
            let jsonData={
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + auth
                    
                },
                body: JSON.stringify({
                    username:email,
                    password:password
                    
                })
            };
            fetch(url,jsonData).then(res=>{
                res.json()
                .then(JSONres => {
                    console.log(JSONres);
                    window.sessionStorage.setItem('user',JSONres.username);
                    window.sessionStorage.setItem("loggedIn",JSONres._kmd.authtoken);
                    loggedIn =true;
                    
                    this.redirect("#/furniture/mine");
                });
            });
           
        }
        logout(context){
            console.log("logged out");
            //if(window.sessionStorage.getItem("loggedIn") == undefined ||window.sessionStorage.getItem("loggedIn") == false){
                //place put an error either for the user or for us to identify a possible bug
            //}
            let url = "https://baas.kinvey.com/user/kid_B1FtXe9zD/_logout";
            console.log(url);
            let auth =  window.sessionStorage.getItem("loggedIn");
            console.log(auth);
            // "Basic a2lkX0IxRnRYZTl6RDo2NjVmNDg4Y2FjMjY0ZjE4OTMyMWJkYzA3NmFiMWVlNg=="
            let jsonData={
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Kinvey ' + auth
                    
                },

            };
            fetch(url,jsonData).then(res=>{
                console.log(res);
                window.sessionStorage.clear();
                loggedIn =false;
                this.redirect("#/");
                
            });
           
          ;
        }
    }

    let route = new RouteController();
    let data = new DataController();

    this.get("/", route.handleHome);

    this.get("#/furniture/details/:id", route.handleDetails);

    this.get("#/furniture/mine", route.handleProfile);//TODO

    this.get("#/furniture/delete/:_id", data.deleteItem); //TODO
    
    this.get("#/furniture/create", route.handleCreate); 
    this.post("#/furniture/create", data.addItem);//TODO
    
    this.get('#/login', route.handleLogin);
    this.post('#/login', data.login);
    this.get('#/logout', data.logout);

});

(function(){
    app.run("#/");
})();

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      //console.log(pattern.test(str));
    return !!pattern.test(str);
  }
