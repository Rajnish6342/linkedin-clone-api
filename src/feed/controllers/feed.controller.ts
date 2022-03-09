import { RolesGuard } from './../../auth/guards/roles.guard';
import { Roles } from './../../auth/decorators/roles.decorator';
import { JwtGuard } from './../../auth/guards/jwt.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { FeedPost } from './../models/post.interface';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FeedService } from '../services/feed.service';
import { Role } from 'src/auth/models/role.enum';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  create(@Body() post: FeedPost, @Request() req): Observable<FeedPost> {
    return this.feedService.createPost(req.user, post);
  }

  @Get()
  findALL(
    @Query('take') take: number,
    @Query('skip') skip: number,
  ): Observable<FeedPost[]> {
    return this.feedService.findAllPosts(take, skip);
  }

  @Put(':id')
  update(
    @Body() post: FeedPost,
    @Param('id') id: number,
  ): Observable<UpdateResult> {
    return this.feedService.updatePost(id, post);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.feedService.deletePost(id);
  }
}
