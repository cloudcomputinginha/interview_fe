export class BadRequestError extends Error {
  constructor(message?: string) {
    super(message || "Bad Request");
    this.name = "BadRequestError";
  }
}

export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message || "Not Found");
    this.name = "NotFoundError";
  }
}

export class UnProcessableError extends Error {
  constructor(message?: string) {
    super(message || "UnProcessable");
    this.name = "UnProcessableError";
  }
}
