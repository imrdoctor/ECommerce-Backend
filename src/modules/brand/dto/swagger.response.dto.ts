import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  Slug: string;
}
export class ImageDto {
  @ApiProperty()
  public_id: string;

  @ApiProperty()
  secure_url: string;
}
export class BrandDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  BrandName: string;

  @ApiProperty()
  Slug: string;

  @ApiProperty()
  CreatedBy: string;

  @ApiProperty()
  IsDeleted: boolean;

  @ApiProperty({ type: CategoryDto })
  Catgory: CategoryDto;

  @ApiProperty({ type: ImageDto })
  Image: ImageDto;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
export class GetAllBrandsResponseDto {
  @ApiProperty({ example: 'Brands retrieved successfully' })
  message: string;

  @ApiProperty({ type: [BrandDto] })
  brands: BrandDto[];
}
export class CrateBrandResponseBrandDto{
  @ApiProperty({ example: 'Brand created successfully' })
  message: string;
  @ApiProperty({ type: [BrandDto] })
  brand: BrandDto
}
export class UpdateBrandResponseDto{
  @ApiProperty({ example: 'Brand updated successfully' })
  message: string;
  @ApiProperty({ type: [BrandDto] })
  updatedBrand: BrandDto
}

export class DeletedBrandResponseDto{
  @ApiProperty({ example: 'Brand deleted successfully' })
  message: string;
  @ApiProperty({ type: [BrandDto] })
  DeletedBrand: BrandDto
}
export class RemoveemployeeBrandResponseDto{
  @ApiProperty({ example: 'Employee Removed successfully' })
  message: string;
  @ApiProperty({ type: [BrandDto] })
  Removeemployee: BrandDto
}
export class AddemployeeBrandResponseDto{
  @ApiProperty({ example: 'Employee added successfully' })
  message: string;
  @ApiProperty({ type: [BrandDto] })
  Addedemployee: BrandDto
}