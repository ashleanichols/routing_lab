class RouteController{
    handleHome(context){
        let loggedIn = window.sessionStorage.getItem('loggedIn') !== null;
        context.loggedIn  = loggedIn;
        context.load("./views/header.hbs")
        .then((partial) => {
            //console.log(partial);
            context.partials={
                header:partial
            };
            let url = "https://baas.kinvey.com/appdata/kid_B1FtXe9zD/furniture";
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
                    response.json().then((response)=>{
                        console.log(response);
                        let allFurnature = response; 
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
        let loggedIn = window.sessionStorage.getItem('loggedIn') !== null;
        const id = context.params.id;
        let url = "https://baas.kinvey.com/appdata/kid_B1FtXe9zD/furniture/"+id;
        console.log(url);
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
        let loggedIn = window.sessionStorage.getItem('loggedIn') !== null;
        context.loggedIn  =loggedIn;
        //console.log(user)
        let url = "https://baas.kinvey.com/appdata/kid_B1FtXe9zD/furniture";
        let jsonData={
            headers: {
                'Content-Type': 'application/json',
                'Authorization':'Kinvey ' + window.sessionStorage.getItem("loggedIn")
            },
        };
            //Basic Z3Vlc3Q6Z3Vlc3Q=
            fetch(url,jsonData).then((response)=>{
                console.log(response.ok);
                if(response.ok){
                    response.json().then((response)=>{
                        console.log(response);
                        let allFurnature = response; 
                        const userFurniture = allFurnature.filter(furniture => furniture._acl.creator ==  window.sessionStorage.getItem("user"));
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
                        });
                    }
                    else{
                        console.log("ERROR! "+ response.status);
                        console.log(response);
                    }
            });
    }
    handleCreate(context){
        let loggedIn = window.sessionStorage.getItem('loggedIn') !== null;
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
        let loggedIn = window.sessionStorage.getItem('loggedIn') !== null;
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

export default RouteController;