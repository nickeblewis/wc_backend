import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateCakeDto {
  @IsInt()
  id: number;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  comment: string;
  @IsString()
  imageUrl: string;
  @IsInt()
  @Min(1)
  @Max(5)
  yumFactor: number;
}