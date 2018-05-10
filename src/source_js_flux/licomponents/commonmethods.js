class CommonMethod {

    
    convertObjectToArray(stringVal){
        var arr = Object.keys(stringVal).map(function(k) {
            return {key: k, value: stringVal[k]}
        });
        
        return arr;
    }


}

export default CommonMethod;
