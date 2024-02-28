class MainClass {
    constructor(requestProduct, collection, reqType) {
        this.instance = null;
        this.resultToSend = null;
        switch(requestProduct) {
            case "laptop" : this.instance = new Laptop(requestProduct, collection, reqType);
            break;
            case "computer" : this.instance = new Computer(requestProduct, collection, reqType);
            break;
            case "phone" : this.instance = new Phone(requestProduct, collection, reqType);
            break;
            case "tablet" : this.instance = new Tablet(requestProduct, collection, reqType);
            break;
            case "mouse" : this.instance = new Mouse(requestProduct, collection, reqType);
            break;
            case "monitor" : this.instance = new Monitor(requestProduct, collection, reqType);
            break;
            case "disk" : this.instance = new Disk(requestProduct, collection, reqType);
            break;
            case "TV" : this.instance = new TV(requestProduct, collection, reqType);
            break;
            case "camera" : this.instance = new Camera(requestProduct, collection, reqType);
            break;
            default : this.instance = new Request(requestProduct, collection, reqType);
            break;
        }
    }

    async getResult() {
        if(this.instance) {
            this.resultToSend = await this.instance.request();
            return this.resultToSend;
        }
        else {
            return null;
        }
    }
}

//--------------------------------------------------------------------------------------------------
//Classes that handles the different types of requests that can be send form the user

class Request {
    constructor(requestProduct, collection, reqType) {
        this.requestProduct = requestProduct;
        this.collection = collection;
        this.reqType = reqType;
    }

    async request() {
        let result = await collection.find({}).toArray();

        if (result) {
            this.res.status(200).json(result);
        } else {
            this.res.status(401).json({ message: "Not such product found" });
        }
    }
}

class Laptop extends Request {
    constructor(requestProduct, collection, reqType) {
        super(requestProduct, collection, reqType);
    }

    async request() {
        let result;
        switch(this.reqType) {
            case "Second hand" : result = await getSecondHanded(this.collection);
            break;
            case "Most buyed": result = await MostBuyedRequest(this.collection); 
            break;
            case "From cheapest": result = await SortByPrice(this.collection, 1);
            break;
            case "From most expencive": result = await SortByPrice(this.collection, -1);
            break;
            default: result = await GetAllProducts(this.collection);
            break;
        }

        return result;
    }
}

class Computer extends Request {
    constructor(requestProduct, collection, reqType) {
        super(requestProduct, collection, reqType);
    }

    async request() {
        let result;
        switch(this.reqType) {
            case "Second hand" : result = await getSecondHanded(this.collection);
            break;
            case "Most buyed": result = await MostBuyedRequest(this.collection);
            break;
            case "From cheapest": result = await SortByPrice(this.collection, 1);
            break;
            case "From most expencive": result = await SortByPrice(this.collection, -1);
            break;
            case "Gaming computers" : result = await this.collection.find({"characteristics.Best_For" : "Gaming"}).toArray();
            break;
            case "Work computers" : result = await this.collection.find({"characteristics.Best_For" : "Gaming"}).toArray();
            break;
            default: result = await GetAllProducts(this.collection);
            break;
        }

        return result;
    }
}

class Phone extends Request {
    constructor(requestProduct, collection, reqType) {
        super(requestProduct, collection, reqType);
    }

    async request() {
        let result;
        switch(this.reqType) {
            case "Second hand" : result = await getSecondHanded(this.collection);
            break;
            case "Most buyed": result = await MostBuyedRequest(this.collection);
            break;
            case "From cheapest": result = await SortByPrice(this.collection, 1);
            break;
            case "From most expencive": result = await SortByPrice(this.collection, -1);
            break;
            case "Apple Phones" : result = await this.collection.find({"characteristics.OS" : "iOS"}).toArray();
            break;
            case "5G Phones" : result = await this.collection.find({"characteristics.Internet_Type" : "5G"}).toArray();
            break;
            case "With 2 SIM cards" : result = await this.collection.find({"characteristics.Number_Of_SIM_Cards" : 2}).toArray();
            break;
            default: result = await GetAllProducts(this.collection);
            break;
        }

        return result;
    }
}

class Tablet extends Request {
    constructor(requestProduct, collection, reqType) {
        super(requestProduct, collection, reqType);
    }

    async request() {
        let result;
        switch(this.reqType) {
            case "Second hand" : result = await getSecondHanded(this.collection);
            break;
            case "Most buyed": result = await MostBuyedRequest(this.collection);
            break;
            case "From cheapest": result = await SortByPrice(this.collection, 1);
            break;
            case "From most expencive": result = await SortByPrice(this.collection, -1);
            break;
            case "Apple tablets" : result = null;
            break;
            case "5G tablets" : result = null;
            break;
            case "Graffic tablets" : result = null;
            break;
            default: result = await GetAllProducts(this.collection);
            break;
        }

        return result;
    }
}

class Mouse extends Request {
    constructor(requestProduct, collection, reqType) {
        super(requestProduct, collection, reqType);
    }

    async request() {
        let result;
        switch(this.reqType) {
            case "Second hand" : result = await getSecondHanded(this.collection);
            break;
            case "Most buyed": result = await MostBuyedRequest(this.collection);
            break;
            case "From cheapest": result = await SortByPrice(this.collection, 1);
            break;
            case "From most expencive": result = await SortByPrice(this.collection, -1);
            break;
            case "Wireless" : result = await this.collection.find({"characteristics.connectionType" : "Wireless"}).toArray();
            break;
            case "With cable" : result = await this.collection.find({"characteristics.connectionType" : "Wire"}).toArray();
            break;
            case "Gaming mouse" : result = await this.collection.find({"characteristics.numberOfButtons" : {$gt : 2}}).toArray();
            break;
            default: result = await GetAllProducts(this.collection);
            break;
        }

        return result;
    }
}

class Monitor extends Request {
    constructor(requestProduct, collection, reqType) {
        super(requestProduct, collection, reqType);
    }

    async request() {
        let result;
        switch(this.reqType) {
            case "Second hand" : result = await getSecondHanded(this.collection);
            break;
            case "Most buyed": result = await MostBuyedRequest(this.collection);
            break;
            case "From cheapest": result = await SortByPrice(this.collection, 1);
            break;
            case "From most expencive": result = await SortByPrice(this.collection, -1);
            break;
            case "More than 100 Hz" : result = await this.collection.find({"characteristics.refreshRate" : {$gt : 100}}).toArray();
            break;
            case "4K" : result = await this.collection.find({"characteristics.resolution" : "3840 x 2160"}).toArray();
            break;
            default: result = await GetAllProducts(this.collection);
            break;
        }

        return result;
    }
}

class Disk extends Request {
    constructor(requestProduct, collection, reqType) {
        super(requestProduct, collection, reqType);
    }

    async request() {
        let result;
        switch(this.reqType) {
            case "Second hand" : result = await getSecondHanded(this.collection);
            break;
            case "Most buyed": result = await MostBuyedRequest(this.collection);
            break;
            case "From cheapest": result = await SortByPrice(this.collection, 1);
            break;
            case "From most expencive": result = await SortByPrice(this.collection, -1);
            break;
            case "SSD" : result = await this.collection.find({"characteristics.disk_type" : "SSD"}).toArray();
            break;
            case "HDD" : result = await this.collection.find({"characteristics.disk_type" : "HDD"}).toArray();
            break;
            case "Out HDD" : result = await this.collection.find({"characteristics.disk_type" : "HDD"}).toArray();
            break;
            case "512GB or more" : result = await this.collection.find({"characteristics.capacity" : {$gte : 512}}).toArray();
            break;
            default: result = await GetAllProducts(this.collection);
            break;
        }

        return result;
    }
}

class TV extends Request {
    constructor(requestProduct, collection, reqType) {
        super(requestProduct, collection, reqType);
    }

    async request() {
        let result;
        switch(this.reqType) {
            case "Second hand" : result = await getSecondHanded(this.collection);
            break;
            case "Most buyed": result = await MostBuyedRequest(this.collection);
            break;
            case "From cheapest": result = await SortByPrice(this.collection, 1);
            break;
            case "From most expencive": result = await SortByPrice(this.collection, -1);
            break;
            case "Smart TV" : result = await this.collection.find({"characteristics.isSmart" : "Yes"}).toArray();
            break;
            case "More than 100 Hz" : result = await this.collection.find({"characteristics.scanFrequency" : {$gt : 100}}).toArray();
            break;
            case "4K" : result = await this.collection.find({"characteristics.resolution" : "3840 x 2160"}).toArray();
            break;
            default: result = await GetAllProducts(this.collection);
            break;
        }

        return result;
    }
}

class Camera extends Request {
    constructor(requestProduct, collection, reqType) {
        super(requestProduct, collection, reqType);
    }

    async request() {
        let result;
        switch(this.reqType) {
            case "Second hand" : result = await getSecondHanded(this.collection);
            break;
            case "Most buyed": result = await MostBuyedRequest(this.collection);
            break;
            case "From cheapest": result = await SortByPrice(this.collection, 1);
            break;
            case "From most expencive": result = await SortByPrice(this.collection, -1);
            break;
            default: result = await GetAllProducts(this.collection);
            break;
        }

        return result;
    }
}

//------------------------------------------------------------------------------------------

//Functions that represents the most common requests

//Returns all products from the given collection
async function GetAllProducts(collection) {
    let result = await collection.find({}).toArray();

    return result;
}

//Returns the products in order from the one with most purchases to the one with least
async function MostBuyedRequest(collection) {
    let result = await collection.find({}).sort({buyed : 1}).toArray();

    return result;
}

//Returns the products sorted by its price
async function SortByPrice(collection, sortType) {
    let result = await collection.find({}).sort({price : sortType}).toArray();

    return result;
}

//Returns all second handed products from the given collection
async function getSecondHanded(collection) {
    let result = await collection.find({isNew : false}).toArray();

    return result;
}

module.exports = MainClass;