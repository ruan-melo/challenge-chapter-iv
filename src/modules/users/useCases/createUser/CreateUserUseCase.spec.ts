import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"
import { ICreateUserDTO } from "./ICreateUserDTO";

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase;

describe('Create User', () => {


  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('Should be able to create an user', async () => {
    const user: ICreateUserDTO = {
      name: "User test",
      email: "test@email.com",
      password: "123456"
    }

    const response = await createUserUseCase.execute(user);

    expect(response).toHaveProperty('id');
    expect(response.name).toEqual(user.name);

  })


  it('Should NOT be able to create an user with an email already in use', async () => {
    const user: ICreateUserDTO = {
      name: "User test",
      email: "test@email.com",
      password: "123456"
    }

    await createUserUseCase.execute(user);

    await expect(createUserUseCase.execute({
      name: "User 2",
      email: user.email,
      password: "abc123456"
    })).rejects.toBeInstanceOf(CreateUserError)

  })
})
