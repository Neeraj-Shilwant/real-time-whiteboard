const users =[];

const adduser = ({Name,roomId,userId,host,presenter,socketId})=>{
    const user = {Name,roomId,userId,host,presenter,socketId};
    users.push(user);
    return users.filter((user)=>user.roomId==roomId);
};

const removeuser = (id)=>{
    const index = users.findIndex(user=>user.socketId==id);
    if(index!= -1){
        return users.slice(index,1)[0];
    }
    
};

const getuser = (id)=>{
    
    
    return users.find(user=>user.socketId==id);
};

const getuserroom = ({roomId})=>{
    return users.filter((user)=>user.roomId==roomId);
};

module.exports = {
    adduser,
    removeuser,
    getuser,
    getuserroom
};