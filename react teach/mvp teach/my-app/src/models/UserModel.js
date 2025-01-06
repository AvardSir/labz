export class UserModel {
  constructor() {
    this.user = { name: "John Doe", age: 30 };
  }

  getUser() {
    return this.user;
  }

  updateUser(newData) {
    this.user = { ...this.user, ...newData };
  }
}
