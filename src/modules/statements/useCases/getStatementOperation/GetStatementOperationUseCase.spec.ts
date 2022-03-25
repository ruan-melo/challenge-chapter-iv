import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase
let inMemoryUsersRepository:  InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe('Get Statement Operation', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new  InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository()

    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createUserUseCase= new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it('Should be able to get a statement operation', async () => {
    const user: ICreateUserDTO = {
      name: "User test",
      email: "test@email.com",
      password: "123456"
    }

    const userCreated = await createUserUseCase.execute(user);

    const statement: ICreateStatementDTO = {user_id: userCreated.id as string, type: OperationType.DEPOSIT, amount: 100, description: 'first deposit' }

    const statementCreated = await createStatementUseCase.execute(statement)

    const response = await getStatementOperationUseCase.execute({user_id: userCreated.id as string, statement_id: statementCreated.id as string});

    expect(response).toHaveProperty('id');
    expect(response.amount).toEqual(statementCreated.amount);
    expect(response.id).toEqual(statementCreated.id);
    expect(response.user_id).toEqual(userCreated.id);
  })

  it('Should NOT be able to get a statement operation of a non-existent user', async () => {
    const user: ICreateUserDTO = {
      name: "User test",
      email: "test@email.com",
      password: "123456"
    }

    const userCreated = await createUserUseCase.execute(user);

    const statement: ICreateStatementDTO = {user_id: userCreated.id as string, type: OperationType.DEPOSIT, amount: 100, description: 'first deposit' }

    const statementCreated = await createStatementUseCase.execute(statement)

    await expect(getStatementOperationUseCase.execute({user_id: '1', statement_id: statementCreated.id as string})).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it('Should NOT be able to get a non-existent statement operation', async () => {
    const user: ICreateUserDTO = {
      name: "User test",
      email: "test@email.com",
      password: "123456"
    }

    const userCreated = await createUserUseCase.execute(user);

    await expect(getStatementOperationUseCase.execute({user_id: userCreated.id as string, statement_id: '1'})).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
