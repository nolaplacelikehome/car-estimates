import { IsString, IsNumber, IsLatitude, IsLongitude, Min, Max } from "class-validator";

export class GetEstimateDto {
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
}