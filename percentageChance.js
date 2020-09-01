module.exports = async(num, name) => {
    if(isNaN(num)) return null;
    const gen = Math.random();
    if(gen < num) {
        //console.log(gen);
        return gen;
    }else{
        //console.log(gen);
        return null;
    }

}