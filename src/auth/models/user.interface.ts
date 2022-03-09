import { FeedPostEntity } from 'src/feed/models/post.entity';
import { Role } from './role.enum';

export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date;
  feedPosts?: FeedPostEntity[];
}
