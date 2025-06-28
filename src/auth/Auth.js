const Auth = {
  isAuthenticated: false,
  signin(cb) {
    this.isAuthenticated = true;
    cb();
  },
  signout(cb) {
    this.isAuthenticated = false;
    cb();
  },
  getAuth() {
    return this.isAuthenticated;
  },
};
export default Auth;
