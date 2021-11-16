export class CreatePostDto {
  title: string;
  description: string;
  authorId: string;
}

export class CreatePostDtoWithoutAuthor {
  title: string;
  description: string;
}
