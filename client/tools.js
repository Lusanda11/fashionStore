
// Significant global shortcuts
// ----------------------------------------------------------------------------------------------------------------------------
    const Global = globalThis;

    const dump = console.log.bind(console);
// ----------------------------------------------------------------------------------------------------------------------------




// Evolve :: define embedded functionality
// ----------------------------------------------------------------------------------------------------------------------------
    const Evolve = function Evolve (target)
    {
        return function caller(struct)
        {
            let attrib, config;

            for (attrib in struct)
            {
                config = {configurable:false, enumerable:false, writeable:false, value: struct[attrib]}
                Object.defineProperty(target, attrib, config);
            };
        };
    };
// ----------------------------------------------------------------------------------------------------------------------------




// Detect :: detect typeof variable accurately
// ----------------------------------------------------------------------------------------------------------------------------
    const Detect = function Detect(what)
    {
        let parted = Object.prototype.toString.call(what).toLowerCase().slice(1,-1).split(" ");
        let result = parted[1].slice(0,4);
        return result;
    };
// ----------------------------------------------------------------------------------------------------------------------------





// Select :: replacement for `document.querySelectorAll()` .. and friends
// ----------------------------------------------------------------------------------------------------------------------------
    Evolve(Object.prototype)
    ({
        Select()
        {
            let entity = (this || Global),
                family = Detect(entity),
                params = [...arguments],
                picker = undefined,
                result = undefined,
                output = [];


            if (family == "arra")
            {
                for (picker of params)
                {
                    result = entity[picker];
                    output.push(result);
                };

                return output;
            };


            if (family == "html")
            {
                for (picker of params)
                {
                    result = [].slice.call( document.querySelectorAll(picker) );
                    result.map((node)=>{ output.push(node) });
                };

                return output;
            };


            if (family == "obje")
            {
                output = {};
                for (picker of params)
                {
                    output[picker] = entity[picker];
                };

                return output;
            };

            return output;
        }
    });
// ----------------------------------------------------------------------------------------------------------------------------





// Delete :: replacement for `foo.parentNode.removeChild(foo)`
// ----------------------------------------------------------------------------------------------------------------------------
    const Delete = function Delete (struct)
    {
        let format = (typeof struct);
        let search, object;
        let result = 0;

        if (format === "string")
        {
            search = Select(struct);
            for (object of search)
            {
                if (!object.parentNode){ continue };
                result ++;
                object.parentNode.removeChild(object)
            };

            return result;
        };


        if (!struct.parentNode){ return 0 };
        struct.parentNode.removeChild(struct)
        return 1;
    };
// ----------------------------------------------------------------------------------------------------------------------------




// shim :: provide CRUD-like functionality to all elements
// ----------------------------------------------------------------------------------------------------------------------------
    Evolve(HTMLElement.prototype)
    ({
        Insert(struct)
        {
            this.appendChild(struct)
        },


        Modify(struct)
        {
            let attrib;

            for (attrib in struct)
            {
                this.setAttribute(attrib, struct[attrib]);
            };
        },
    });
// ----------------------------------------------------------------------------------------------------------------------------





// shim :: Object.prototype.Supply : provide missing attributes
// ----------------------------------------------------------------------------------------------------------------------------
        Evolve(Object.prototype)
        ({
            Supply(struct)
            {
                if (Detect(struct) !== "obje"){ return this };

                Reflect.ownKeys(struct).map((name)=>
                {
                    if ((this[name] === undefined) || (this[name] === null) )
                    { this[name] = struct[name] };
                });

                return this;
            },


            Remove()
            {
                let entity = (this || Global);
                let params = [...arguments];
                let number = 0;
                let family = Detect(entity);
                let search, result;

                search = entity.Select(...params);

                if (family === "html")
                {
                    output = [];
                    search.map((node)=>
                    {
                        output.push(node);
                        node.parentNode.removeChild(node);
                    });

                    return output;
                };


                if (family === "obje")
                {
                    params.map((prop)=>
                    {
                        delete entity[prop]
                    });

                    return search;
                };


                if (family === "arra")
                {
                    params.map((prop)=>
                    {
                        entity.splice(prop,(prop+1));
                    });

                    return search;
                };
            },
        });
// ----------------------------------------------------------------------------------------------------------------------------




// Create :: replacement for `document.createElement()`
// ----------------------------------------------------------------------------------------------------------------------------
    const Create = function Create (struct)
    {
        let format = Detect(struct);
        let result, object, attrib;


        if (format === "stri")
        {
            result = document.createElement(struct);
            return result;
        };


        if (format === "obje")
        {
            object = struct.node;
            delete struct.node;

            result = document.createElement(object);
            attrib = Object.keys(struct);

            for (attrib in struct)
            {
                result.setAttribute(attrib, struct[attrib]);
            };

            return result;
        };


        if (format === "rege")
        {
            return function caller(schema)
            {
                let format = Detect(schema);
                let string = ( (format == "func") ? schema.toString() : "" );
                let locate;

                if (!!string)
                {
                    string = ("constructor "+string.slice(string.indexOf("(")));
                    locate = string.indexOf("=>");
                    if (locate > 0)
                    {
                        string =
                        (
                            string.slice(0, locate) +
                            string.slice( (locate+2) )
                        );
                    };
                };

                let result = Function(`return ( class ${this.name} { ${string} } )`)();

                if (format == "obje")
                { return result.Supply(schema) }
                else if (format == "func")
                {
                    return new result();
                };
            }
            .bind({name:struct.toString().slice(1,-1)})
        };
    };
// ----------------------------------------------------------------------------------------------------------------------------




// Server :: PHP API
// ----------------------------------------------------------------------------------------------------------------------------
    Evolve(Global)
    ({
        Server:
        {
            Select(target, config)
            {
                config = (config || {}).Supply({method:"GET", format:"blob", filter:null});

                return new Promise(function then(finish, reject)
                {

                });
            },
        }
    });
// ----------------------------------------------------------------------------------------------------------------------------





// init :: clean start
// ----------------------------------------------------------------------------------------------------------------------------


    // let james = Create()(function()
    // {
    //     this.name = "James";
    // });
    //
    //


    // Global.Listen("hello").then(()=>
    // {
    //     dump("hi!");
    //     // Evolve(Global)({Viewer:document.body});
    //     // Viewer.innerHTML = "";
    //     // dump( Viewer.childNodes );
    // });
    //
    // Global.Signal("hello");


    // Global.addEventListener("load", ()=>
    // {
    //     Evolve(Global)({Viewer:document.body});
    //     Viewer.innerHTML = "";
    //     dump( Viewer.childNodes );
    // });
// ----------------------------------------------------------------------------------------------------------------------------





// hack here
// ----------------------------------------------------------------------------------------------------------------------------
    // Server.Select("assets/images/lady.jpg").then
    // (
    //     function finish(object)
    //     {
    //         dump(object)
    //     },
    //
    //     function failed(reason)
    //     {
    //         dump(reason)
    //     },
    // );
// ----------------------------------------------------------------------------------------------------------------------------
