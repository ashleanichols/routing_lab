class DataController{
    deleteItem(context){
        console.log("deleted Furnature!");
        console.log(context.params.id);
        const id = context.params.id;
        let url =`https://baas.kinvey.com/appdata/kid_B1FtXe9zD/furniture/${id}`;
        let jsonData={
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':'Kinvey ' + window.sessionStorage.getItem("loggedIn")
            },
        };
        fetch(url,jsonData).then(res=>{
            console.log(res);
            if(res.ok){
                res.json().then((res)=>{
                    console.log(res);
                    this.redirect("#/furniture/mine");
                });
            }
            else{
                console.log("ERROR: "+res.status);
            }
        });
        
        
        this.redirect("#/furniture/mine")
        console.log(res);
        
    }
    addItem({ params }){
        console.log("Item Added!");
        //TODO: add data to the array
        //https://image.shutterstock.com/image-photo/light-wooden-tabletop-table-on-600w-514179574.jpg 
        //https://unsplash.com/photos/s7IIk_2dA7g
        /**
          table
          table
          2020
          This is a table with a discription
          2
          https://unsplash.com/photos/s7IIk_2dA7g
         */ 
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
            
            let url ="https://baas.kinvey.com/appdata/kid_B1FtXe9zD/furniture";
            let detials = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Kinvey ' + window.sessionStorage.getItem("loggedIn")
                    
                },
                body: JSON.stringify({
                    make,
                    model,
                    year, 
                    description, 
                    price, 
                    img, 
                    material
                })
            };

            fetch(url,detials).then((response)=>{
                if(response.status ==201){
                    console.log("added successfully!");
                    this.redirect("#/furniture/mine");
                }
                else{
                    document.getElementById("errorBox").style.display = "block";
                }
            });
            
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
                window.sessionStorage.setItem('user',JSONres._id);
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
       
      
    }
}


export default DataController;