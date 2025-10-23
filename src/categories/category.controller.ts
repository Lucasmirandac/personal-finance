import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
} from './models/category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  async findAllCategories(): Promise<CategoryResponseDto[]> {
    return this.categoryService.findAllCategories();
  }

  @Get(':id')
  async findCategoryById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.findCategoryById(id);
  }

  @Patch(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }

  @Get('admin/test')
  testEndpoint(): { message: string } {
    return { message: 'Category module is working correctly' };
  }
}
