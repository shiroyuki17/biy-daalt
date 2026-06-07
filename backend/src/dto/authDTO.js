class RegisterDTO {
  constructor(body) {
    this.username = body.username ? String(body.username).trim() : null;
    this.email = body.email ? String(body.email).trim().toLowerCase() : null;
    this.password = body.password ? String(body.password) : null;
  }
}

class LoginDTO {
  constructor(body) {
    this.email = body.email ? String(body.email).trim().toLowerCase() : null;
    this.password = body.password ? String(body.password) : null;
  }
}

module.exports = {
  RegisterDTO,
  LoginDTO
};
