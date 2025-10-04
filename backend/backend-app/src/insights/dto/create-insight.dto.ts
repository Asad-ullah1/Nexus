import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsArray,
} from 'class-validator';

export class CreateInsightDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsOptional()
  @IsUrl()
  sourceUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
