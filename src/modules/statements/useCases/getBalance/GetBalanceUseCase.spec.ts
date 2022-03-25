import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository:  InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe('Get balance', () => {
  beforeAll(() => {
    inMemoryUsersRepository = new  InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository()

    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository , inMemoryUsersRepository );
    createUserUseCase= new CreateUserUseCase(inMemoryUsersRepository);
  })

  it('Should be able to get user balance',async  () => {
    const user: ICreateUserDTO = {
      name: "User test",
      email: "test@email.com",
      password: "123456"
    }

    const userCreated = await createUserUseCase.execute(user);

    const response = await getBalanceUseCase.execute({user_id: userCreated.id as string})

    expect(response.balance).toEqual(0)
    expect(response.statement.length).toEqual(0);
  })

  it('Should NOT be able to get balance of a non-existent user', async () => {
    await expect(getBalanceUseCase.execute({user_id: '1' as string})).rejects.toBeInstanceOf(GetBalanceError)
  })
})
