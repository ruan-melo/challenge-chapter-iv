import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "User test",
      email: "test@email.com",
      password: "123456"
    }

    await createUserUseCase.execute(user);

    const response =  await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(response).toHaveProperty("token")
  })

  it("Should NOT be able to authenticate an user with invalid password", async () => {
    const user: ICreateUserDTO = {
      name: "User test",
      email: "test@email.com",
      password: "123456"
    }

    await createUserUseCase.execute(user);

    await expect( authenticateUserUseCase.execute({
      email:  user.email,
      password: 'wrong' + user.password
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("Should NOT be able to authenticate a non-existent user", async () => {
    const user: ICreateUserDTO = {
      name: "User test",
      email: "test@email.com",
      password: "123456"
    }

    await createUserUseCase.execute(user);

    await expect( authenticateUserUseCase.execute({
      email:   'wrong' + user.email,
      password: user.password
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

})
