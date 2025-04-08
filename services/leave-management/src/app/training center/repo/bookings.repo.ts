import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Bookings } from '../entity/bookings.entity';

@Injectable()
export class BookingsRepository extends Repository<Bookings> {
  constructor(private dataSource: DataSource) {
    // Correctly initialize the base Repository class
    super(Bookings, dataSource.createEntityManager());
  }

  
 
}
