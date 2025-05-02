import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export class createBrandDto {
  @ApiProperty({
    description: 'Brand Name',
    example: 'Nike',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(2)
  BrandName: string;
  @ApiProperty({
    description: 'Catgory ID',
    example: '607d1b2f1c4ae81234567890',
  })
  @IsMongoId()
  @IsNotEmpty()
  Catgory: Types.ObjectId;
  @ApiProperty({ type: 'string', format: 'binary' })
  img: Express.Multer.File;
}
export class updateBrandDto {
  @ApiProperty({
    description: 'Brand Name',
    example: 'Nike',
  })
  @IsOptional() 
  @IsString()
  @MaxLength(10)
  @MinLength(2)
  BrandName: string;
  @ApiProperty({
    description: 'Catgory ID',
    example: '607d1b2f1c4ae81234567890',
  })
  @IsMongoId()
  @IsOptional()
  Catgory: Types.ObjectId;
  @ApiProperty({ type: 'string', format: 'binary' })
  img: Express.Multer.File;
}
export class employeeDto {
  @ApiProperty({
    description: 'Employee ID',
    example: '607d1b2f1c4ae81234567890',
    })
    @IsMongoId()
    @IsNotEmpty()
    EmployeeId: Types.ObjectId;
}