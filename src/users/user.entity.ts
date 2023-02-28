import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Report } from '../reports/report.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column({ default: true })
	admin: boolean;	

	@OneToMany(() => Report, (report) => report.user)
	reports: Report[];

	@AfterInsert()
	logInsert() {
		console.log('Created user with id', this.id);
	}

	@AfterUpdate()
	logUpdate() {
		console.log('Updated id', this.id);
	}

	@AfterRemove()
	logRemove() {
		console.log('Removed id', this.id);
		
	}
}