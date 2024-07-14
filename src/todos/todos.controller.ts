import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @Render('todos/index')
  async findAll(@Req() req: Request) {
    const userId = this.getUserId(req);
    const todos = await this.todosService.findAll(userId);
    return { todos, user: req['user'] };
  }

  @Get(':id/edit')
  @Render('todos/edit-modal')
  async edit(@Param('id') id: string, @Req() req: Request) {
    const userId = this.getUserId(req);
    const todo = await this.todosService.findOne(+id, userId);
    return { todo };
  }

  @Post()
  async create(
    @Body() createTodoDto: CreateTodoDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = this.getUserId(req);
    await this.todosService.create(createTodoDto, userId);
    return res.redirect('/todos');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = this.getUserId(req);
    await this.todosService.update(+id, updateTodoDto, userId);
    return res.redirect('/todos');
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = this.getUserId(req);
    await this.todosService.remove(+id, userId);
    return res.redirect('/todos');
  }

  @Patch(':id/done')
  async markAsDone(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = this.getUserId(req);
    const todo = await this.todosService.findOne(+id, userId);
    const updateTodoDto: UpdateTodoDto = { isDone: !todo.isDone };
    await this.todosService.update(+id, updateTodoDto, userId);
    return res.redirect('/todos');
  }

  private getUserId(req: Request): number {
    return req['user'].userId;
  }
}
