class Users {
  constructor () {
    this.users = [];
  }

  addUser (id, name, room) {
    let user = {id, name, room};
    this.users.push(user);
    return user;
  }
  removeUser (id) {
    let user = this.users.filter((user) => user.id==id)[0];
    if(user) {
      this.users = this.users.filter((user) => user.id != id);
    }
    return user;
  }
  getUser (id) {
    return this.users.filter((user) => user.id==id)[0];
  }
  getUserList (room) {
    let users = this.users.filter((user) => user.room == room);               //chekcks for every user// if returns true it will be kept// if false it will be filtered
    let namesArray = users.map((user)=> user.name);
    return namesArray;
  }
}


let u = new Users();
u.addUser(1,'ashish',"aaaa");
u.addUser(2,'ashu',"aaaa");
console.log(u.removeUser(1));
console.log(u.getUser(1));
module.exports = {Users};
