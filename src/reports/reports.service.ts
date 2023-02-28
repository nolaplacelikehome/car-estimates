import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report-dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
	constructor(@InjectRepository(Report) private repo: Repository<Report>) {}
	create(report: CreateReportDto, user: User) {
		const createdReport = this.repo.create(report);
		createdReport.user = user;
		return this.repo.save(createdReport); 
	}

	async changeApproval(id: string, approved: boolean) {
		const report = await this.repo.findOne({ where: { id: parseInt(id) } });
		if (!report) {
			throw new NotFoundException('Report not found');
		}
		report.approved = approved;
		return this.repo.save(report);
	}
}
