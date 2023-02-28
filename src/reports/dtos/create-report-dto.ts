import { IsString, IsNumber, Min, Max, IsLatitude, IsLongitude } from 'class-validator';

export class CreateReportDto {
	@IsString()
	make: string;

	@IsString()
	model: string;

	@IsNumber()
	@Min(1900)
	@Max(2030)
	year: number;

	@IsNumber()
	@Min(0)
	@Max(1000000)
	mileage: number;

	@IsLongitude()
	longitude: number;

	@IsLatitude()
	latitude: number;

	@IsNumber()
	@Min(0)
	@Max(1000000)
	price: number;
}