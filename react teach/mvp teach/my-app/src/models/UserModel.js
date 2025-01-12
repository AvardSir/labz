export class UserModel {
  constructor() {
    this.user = { name: "John Doe", age: 30 };
  }

  /**
   * Gets the current user.
   * @returns {object} The current user.
   */
  getUser() {
    console.log("UserModel: getUser");
    console.log("UserModel: getUser: user:", this.user);
    console.log("UserModel: getUser: returning user:", this.user);
    return this.user;
  }

  updateUser(newData) {
    this.user = { ...this.user, ...newData };
  }
}
