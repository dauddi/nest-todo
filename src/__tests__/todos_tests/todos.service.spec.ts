import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodosService } from '../../todos/todos.service';
import { Todo } from '../../todos/entities/todo.entity';

describe('TodosService', () => {
  let service: TodosService;
  let repository: Repository<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    repository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new todo', async () => {
    const createTodoDto = { title: 'Test Todo' };
    const userId = 1;
    const todo = { id: 1, title: 'Test Todo', user: { id: userId } } as Todo;

    jest.spyOn(repository, 'create').mockReturnValue(todo);
    jest.spyOn(repository, 'save').mockResolvedValue(todo);

    expect(await service.create(createTodoDto, userId)).toEqual(todo);
  });

  it('should find all todos for a user', async () => {
    const userId = 1;
    const todos = [
      { id: 1, title: 'Test Todo', user: { id: userId } },
    ] as Todo[];

    jest.spyOn(repository, 'find').mockResolvedValue(todos);

    expect(await service.findAll(userId)).toEqual(todos);
  });

  it('should find one todo by id', async () => {
    const userId = 1;
    const todo = { id: 1, title: 'Test Todo', user: { id: userId } } as Todo;

    jest.spyOn(repository, 'findOne').mockResolvedValue(todo);

    expect(await service.findOne(1, userId)).toEqual(todo);
  });

  it('should update a todo', async () => {
    const userId = 1;
    const updateTodoDto = { title: 'Updated Todo' };
    const todo = { id: 1, title: 'Test Todo', user: { id: userId } } as Todo;

    jest.spyOn(service, 'findOne').mockResolvedValue(todo);
    jest
      .spyOn(repository, 'save')
      .mockResolvedValue({ ...todo, ...updateTodoDto });

    expect(await service.update(1, updateTodoDto, userId)).toEqual({
      ...todo,
      ...updateTodoDto,
    });
  });

  it('should remove a todo', async () => {
    const userId = 1;
    const todo = { id: 1, title: 'Test Todo', user: { id: userId } } as Todo;

    jest.spyOn(service, 'findOne').mockResolvedValue(todo);
    jest.spyOn(repository, 'remove').mockResolvedValue(todo);

    await service.remove(1, userId);
    expect(repository.remove).toHaveBeenCalledWith(todo);
  });
});
