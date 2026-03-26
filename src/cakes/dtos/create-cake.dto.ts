import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateCakeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  comment: string;
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
  @IsInt()
  @Min(1)
  @Max(5)
  yumFactor: number;
}