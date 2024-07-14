import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateTodoDto } from '../../todos/dto/create-todo.dto';
import { UpdateTodoDto } from '../../todos/dto/update-todo.dto';
import { Todo } from '../../todos/entities/todo.entity';
import { TodosController } from '../../todos/todos.controller';
import { TodosService } from '../../todos/todos.service';

describe('TodosController', () => {
  let controller: TodosController;
  let service: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all todos', async () => {
    const userId = 1;
    const todos = [
      { id: 1, title: 'Test Todo', user: { id: userId } },
    ] as Todo[];
    jest.spyOn(service, 'findAll').mockResolvedValue(todos);

    const result = await controller.findAll({ user: { userId } } as any);
    expect(result).toEqual({ todos, user: { userId } });
  });

  it('should create a new todo', async () => {
    const createTodoDto: CreateTodoDto = { title: 'Test Todo' };
    const userId = 1;
    const todo = { id: 1, title: 'Test Todo', user: { id: userId } } as Todo;

    jest.spyOn(service, 'create').mockResolvedValue(todo);

    const res = { redirect: jest.fn() } as any;

    await controller.create(createTodoDto, { user: { userId } } as any, res);

    expect(res.redirect).toHaveBeenCalledWith('/todos');
  });

  it('should update a todo', async () => {
    const updateTodoDto: UpdateTodoDto = { title: 'Updated Todo' };
    const userId = 1;
    const todo = { id: 1, title: 'Updated Todo', user: { id: userId } } as Todo;

    jest.spyOn(service, 'update').mockResolvedValue(todo);

    const res = { redirect: jest.fn() } as any;

    await controller.update(
      '1',
      updateTodoDto,
      { user: { userId } } as any,
      res,
    );

    expect(res.redirect).toHaveBeenCalledWith('/todos');
  });

  it('should remove a todo', async () => {
    const userId = 1;

    jest.spyOn(service, 'remove').mockResolvedValue();

    const res = { redirect: jest.fn() } as any;

    await controller.remove('1', { user: { userId } } as any, res);

    expect(res.redirect).toHaveBeenCalledWith('/todos');
  });

  it('should mark a todo as done', async () => {
    const userId = 1;
    const todo = {
      id: 1,
      title: 'Test Todo',
      isDone: false,
      user: { id: userId },
    } as Todo;
    const doneTodo = { ...todo, isDone: true };

    jest.spyOn(service, 'findOne').mockResolvedValue(todo);
    jest.spyOn(service, 'update').mockResolvedValue(doneTodo);

    const res = { redirect: jest.fn() } as any;

    await controller.markAsDone('1', { user: { userId } } as any, res);

    expect(res.redirect).toHaveBeenCalledWith('/todos');
  });
});
