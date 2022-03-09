import { UserEntity } from 'src/auth/models/user.entity';

export interface FeedPost {
  id?: number;
  body?: string;
  author?: UserEntity;
  createdAt?: Date;
}
