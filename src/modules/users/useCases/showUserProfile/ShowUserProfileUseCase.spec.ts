import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import {ShowUserProfileError} from './ShowUserProfileError';


let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase : ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Create User', () => {


  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it('Should be able to show user profile', async () => {

    const user: ICreateUserDTO = {
      name: "User test",
      email: "test@email.com",
      password: "123456"
    }

    const userCreated = await createUserUseCase.execute(user);

    const profile = await showUserProfileUseCase.execute(userCreated.id as string);

    expect(profile).toHaveProperty('id');
    expect(profile.name).toEqual(user.name);

  })


  it('Should NOT be able to show a non-existent user profile', async () => {

    await expect(showUserProfileUseCase.execute('1')).rejects.toBeInstanceOf(ShowUserProfileError)

  })
})
