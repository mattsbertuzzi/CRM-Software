const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const saltRounds = 10;

const hashPassword = async(password) =>{
    try{
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (e){
        console.log('Error hashing password: ', e.message);
    }
};

const verifyPassword = async(password, hashedPassword) => {
    try{
        const isMatching = await bcrypt.compare(password, hashedPassword);
        return isMatching;
    } catch (e) {
        console.error('Error retrieving password:', e.message);
    }
};

module.exports = {
    hashPassword,
    verifyPassword
};