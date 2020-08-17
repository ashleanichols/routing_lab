
const app = Sammy("#container",function(){
    this.use('Handlebars', 'hbs');
    /**
     * {
     *  id: number,
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
        id:1,
        createdBy:"temp",
        img:"imgURL",
        make:" the make",
        model:"a chair, probablt",
        year:2020,
        Description:"this is an item",
        price:22,        
       } 
     */
    
    let allFurnature = [
        {
            id:1,
            maker:"user",
            img:"imgURL",
            make:" the make",
            model:"a chair, probablt",
            year:2020,
            description:"this is an item",
            price:22,  
            material:"(Not Avaiable)"      
           }
    ]; //array of furniture objects
    let currentID= allFurnature.length+1;
    let loggedIn = false;
    let user= "";
    /**
     * (POST) /furniture/create -- create route and post down
     * All Furniture (GET): /furniture/all -- Home route
        Furniture Details (GET): /furniture/details/:id -- details route
        My Furniture (GET): /furniture/mine 
        Delete Furniture (DELETE):  /furniture/delete/:id
    */
    class RouteController{
        handleHome(context){
            context.loggedIn  =loggedIn;
            context.load("./views/header.hbs")
            .then((partial) => {
                //console.log(partial);
                context.partials={
                    header:partial
                };
                context.hasFurniture = (allFurnature.length>0 ? true:false);
                context.furnitureItem = allFurnature;
                context.partial('./views/home.hbs');
            });
        }
        handleDetails(context){
            const id = parseInt(context.params.id);
            const details = allFurnature.find(furniture => furniture.id === id);
           // console.log(details);
            context.loggedIn  =loggedIn;
            context.load("./views/header.hbs")
            .then((partial) => {
                //console.log(partial);
                context.partials={
                    header:partial
                };
                context.details = details;
                context.partial('./views/details.hbs');
            });
        }
        handleProfile(context){
            context.loggedIn  =loggedIn;
            //console.log(user)
            const userFurniture = allFurnature.filter(furniture => furniture.maker == user);
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
            context.loggedIn  =loggedIn;
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
            context.loggedIn  =loggedIn;
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
            //TODO: Reoving data from the array
            //TODO Later:delete item from db
        }
        addItem({ params }){
            console.log("Item Added!");
            //TODO: add data to the array
            //https://image.shutterstock.com/image-photo/light-wooden-tabletop-table-on-600w-514179574.jpg  
            const {make, model,year, description, price, img, material } = params;
            //console.log(material)
            let furniture = {
                id: currentID,
                maker:user,
                make,
                model,
                year, 
                description, 
                price, 
                img, 
                material:(material!=""? material:"(Not Avaiable)")
            };
            currentID++;
            allFurnature.push(furniture);

            this.redirect("#/furniture/mine");
            //TODO Later:Add data to db
        }
        login({ params }){
            console.log("logged in");
            const { email, password } = params;
             
            user= email;
            loggedIn = true;
            this.redirect("#/furniture/mine");
        }
        logout(context){
            console.log("logged out");
            loggedIn = false;
            user= "";
            this.redirect("#/");
        }
    }

    let route = new RouteController();
    let data = new DataController();

    this.get("/", route.handleHome);

    this.get("#/furniture/details/:id", route.handleDetails);

    this.get("#/furniture/mine", route.handleProfile);

    this.get("#/furniture/delete/:id", data.deleteItem);
    
    this.get("#/furniture/create", route.handleCreate);
    this.post("#/furniture/create", data.addItem);
    
    this.get('#/login', route.handleLogin);
    this.post('#/login', data.login);
    this.get('#/logout', data.logout);

});

(function(){
    app.run("#/");
})();