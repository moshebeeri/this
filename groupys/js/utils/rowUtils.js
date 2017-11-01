




const splitToArrayRows = (array,numberForRow) => {
    let a = immutableObject(array);
    let newArray = [];
    while (a.length > 0) {

        let chunk = a.splice(0,numberForRow)
        newArray.push(chunk)


    }
    return newArray;
};

const immutableObject = (obj) => {

        let newArray =[];
        obj.forEach(iten => {
            newArray.push(iten)
        });
        return newArray;
        // ...obj

}

export default {
    splitToArrayRows,
};

