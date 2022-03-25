import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase"

import {OperationType} from '../../entities/Statement';
import { ICreateStatementDTO } from "./ICreateStatementDTO";

import {CreateStatementError} from './CreateStatementError'

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository:  InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe('Create Statement', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new  InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase= new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);

  })
  it('Should be able to deposit', async () => {
    const user: ICreateUserDTO = {
      name: "User test",
      email: "test@email.com",
      password: "123456"
    }

    const userCreated = await createUserUseCase.execute(user);

    const statement: ICreateStatementDTO = {user_id: userCreated.id as string, type: OperationType.DEPOSIT, amount: 100, description: 'first deposit' }

    const response = await createStatementUseCase.execute(statement)

    expect(response).toHaveProperty('id');
    expect(response.type).toEqual(statement.type);
    expect(response.amount).toEqual(statement.amount)
  })

  it('Should be able to withdraw', async () => {
    const user: ICreateUserDTO = {
      name: "User test",
      email: "test@email.com",
      password: "123456"
    }

    const userCreated = await createUserUseCase.execute(user);

    await createStatementUseCase.execute({user_id: userCreated.id as string, type: OperationType.DEPOSIT, amount: 100, description: 'first deposit' })

    const statement: ICreateStatementDTO = {user_id: userCreated.id as string, type: OperationType.WITHDRAW, amount: 100, description: 'first withdraw' }

    const response = await createStatementUseCase.execute(statement)

    expect(response).toHaveProperty('id');
    expect(response.type).toEqual(statement.type);
    expect(response.amount).toEqual(statement.amount)
  })

  it('Should NOT be able to a non-existent user create a statement', async () => {
    const statement: ICreateStatementDTO = {user_id: '1' as string, type: OperationType.DEPOSIT, amount: 100, description: 'first deposit' }

    await expect(createStatementUseCase.execute(statement)).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it('Should NOT be able to withdraw with insufficient funds', async () => {
    const user: ICreateUserDTO = {
      name: "User test",
      email: "test@email.com",
      password: "123456"
    }

    const userCreated = await createUserUseCase.execute(user);

    const statement: ICreateStatementDTO = {user_id: userCreated.id as string, type: OperationType.WITHDRAW, amount: 100, description: 'first withdraw' }

    await expect(createStatementUseCase.execute(statement)).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
