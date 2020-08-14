let loggedin = false;
let user= "";
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
     *  Material: no longer than 20 character - is optional
     * }
     */
    let allFurnature = []; //array of furniture objects
    
    /**
     * (POST) /furniture/create -- create route and post down
     * All Furniture (GET): /furniture/all -- Home route
        Furniture Details (GET): /furniture/details/:id -- details route
        My Furniture (GET): /furniture/mine 
        Delete Furniture (DELETE):  /furniture/delete/:id
    */
    class RouteController{
        handleHome(context){
            context.loggedin  =loggedin;
            context.loadPartials({ })
                .then(() => {
                    context.allFurnature = allFurnature;
                    context.partial('./views/home.hbs');
                });
        }
        handleDetails(context){
            const id = parseInt(context.params.id);
            //const details = allFurnature.find(furniture => furniture.id === id);
            context.loggedin  =loggedin;
            context.loadPartials({ })
                .then(() => {
                    //context.details = details;
                    context.partial('./views/details.hbs');
                });
        }
        handleProfile(context){
            context.loggedin  =loggedin;
            context.loadPartials({ })
                .then(() => {
                    context.myFurnature = allFurnature;
                    context.partial('./views/profile.hbs');
                });
        }
        handleCreate(context){
            context.loggedin  =loggedin;
            context.loadPartials({ })
            .then(() => {
                // context.myFurnature = allFurnature;
                context.partial('./views/create.hbs');
            });
        }
        handleLogin(context){
            context.loggedin  =loggedin;
            context.loadPartials({ })
            .then(() => {
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
            //TODO Later:Add data to db
        }
        login({ params }){
            console.log("logged in");
            const { email, password } = params;
             
 
            loggedin = true;
            this.redirect("#/furniture/mine");
        }
        logout(context){
            console.log("logged out");
            loggedin = false;
            let user= "";
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