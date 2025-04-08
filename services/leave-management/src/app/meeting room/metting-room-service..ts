import { Injectable } from '@nestjs/common';
import { format, parseISO } from 'date-fns';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { MeetingRoomIdReq, RoomBookingDto, RoomStatusEnum, ScheduleStatus } from 'libs/shared-models/src/lib/metting-room';
import { Between, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { CommonResponseModel } from '../../../../../libs/backend-utils/src/lib/exception-handling';
import { DateTimeDto } from './dto/dateTime.dto';
import { MettingRoomDto } from './dto/meetingRoom-dto';
import { ScheduleStatusDto } from './dto/schedule-dto';
import { SlotsDto } from './dto/time-slot-dto';
import { ValidationDto } from './dto/validation-dto';
import { Bookings } from './entity/bookings.entity';
import { MeetingRoomEntity } from './entity/meeting-room-entity';
import { BookingsRepository } from './repo/bookings.repo';
import { MeetingRoomRepository } from './repo/meeting-room-repo';
dayjs.extend(utc); // Extend dayjs plugins outside the class
dayjs.extend(isBetween);
dayjs.extend(utc); // Extend dayjs plugins outside the class
dayjs.extend(timezone);

@Injectable()
export class MettingRoomService {

    constructor(
        private meetingRoomRepo: MeetingRoomRepository,
        private bookingsRepo: BookingsRepository
    ) { }

    async createMeetingRoom(req: MettingRoomDto): Promise<CommonResponseModel> {
        try {

            const entity = new MeetingRoomEntity();
            entity.meetingRoom = req.meetingRoom;
            entity.capacity = req.capacity;
            entity.location = req.location;
            entity.roomApprover = req.roomApprover;
            entity.roomApproverId = req.roomApproverId;
            entity.isActive = req.isActive;
            entity.createdUser = req.createdUser;
            entity.updatedUser = req.updatedUser;
            entity.versionFlag = req.versionFlag;

            const save = await this.meetingRoomRepo.save(entity);
            if (save) {
                return new CommonResponseModel(true, 1, 'Created successfully', save);

            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in meeting room creation', []);

            }
        } catch (err) {
            throw err;
        }
    }

    async getAllMeetingRooms(): Promise<CommonResponseModel> {
        const result = await this.meetingRoomRepo.getAllMeetingRooms()
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        }
        return new CommonResponseModel(true, 1, 'No data found', []);
    }

    async getActiveMeetingRoom(): Promise<CommonResponseModel> {
        const data = await this.meetingRoomRepo.find({
            where: {
                isActive: true
            }
        });

        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No active meeting room found', []);
    }

    async updateMeetingRoom(req: MettingRoomDto): Promise<CommonResponseModel> {
        try {
            const result = await this.meetingRoomRepo.update(
                { id: req.id },
                {
                    meetingRoom: req.meetingRoom,
                    capacity: req.capacity,
                    location: req.location,
                    roomApprover: req.roomApprover,
                    roomApproverId: req.roomApproverId,
                    updatedUser: req.updatedUser,
                    isActive: req.isActive
                }
            );

            if (result.affected > 0) {
                return new CommonResponseModel(true, 1, 'Updated successfully', result);
            } else {
                return new CommonResponseModel(false, 0, 'Update failed', []);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async activateOrDeactivateMeetingRoom(req: MettingRoomDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.meetingRoomRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No meeting room found');
            }

            const update = await this.meetingRoomRepo.update(
                { id: req.id },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );

            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'meeting room deactivated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'meeting room already deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'meeting room activated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'meeting room already activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (err) {
            return err;
        }
    }

    async getActiveMeetingRooms(): Promise<CommonResponseModel> {
        const data = await this.meetingRoomRepo.find({
            where: {
                isActive: true
            }
        });

        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No active meeting room found', []);
    }

    async bookMeetingRoom(req: RoomBookingDto): Promise<CommonResponseModel> {
        const startTime = dayjs(req.startTime, "YYYY-MM-DDTHH:mm:ssZ").toDate();
        const endTime = dayjs(req.endTime, "YYYY-MM-DDTHH:mm:ssZ").toDate();
        const bookingEntity = new Bookings()
        const meetRoom = new MeetingRoomEntity()
        meetRoom.id = req.roomId
        bookingEntity.room = meetRoom
        bookingEntity.purpose = req.purpose
        bookingEntity.startTime = dayjs(req.startTime).toDate()
        bookingEntity.endTime = dayjs(req.endTime).toDate()
        if (req.roomApprover === null) {
            bookingEntity.roomStatus = RoomStatusEnum.BOOKED
            bookingEntity.approveStatus = ScheduleStatus.APPROVED
        } else {
            bookingEntity.roomStatus = RoomStatusEnum.PENDING;
            bookingEntity.approveStatus = ScheduleStatus.OPEN
        }
        bookingEntity.createdUser = req.createdUser;
        const res = await this.bookingsRepo.save(bookingEntity)
        if (res.id) {
            // await this.meetingRoomRepo.update({ id: req.roomId }, { roomStatus: RoomStatusEnum.BOOKED })
        }
        return new CommonResponseModel(true, 1111, "Scheduled successfully", res)
    }

    async getMeetingSchedules(req?: MeetingRoomIdReq): Promise<CommonResponseModel> {
        let data;

        if (req?.id) {
            data = await this.bookingsRepo.find({
                relations: ['room'],
                where: { room: { id: req.id } },
            });
        } else {
            data = await this.bookingsRepo.find({
                relations: ['room'],
            });
        }

        // Convert `startTime` and `endTime` to IST
        const istData = data.map((booking) => ({
            ...booking,
            startTime: dayjs(booking.startTime).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
            endTime: dayjs(booking.endTime).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
            room: {
                ...booking.room,
                createdAt: dayjs(booking.room.createdAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: dayjs(booking.room.updatedAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
            },
        }));

        // console.log(req, istData);

        if (istData.length) {
            return new CommonResponseModel(true, 1111, 'Data retrieved successfully', istData);
        }
        return new CommonResponseModel(true, 1111, 'No data found');
    }

    async getAvailableRooms(): Promise<CommonResponseModel> {
        const data = await this.meetingRoomRepo.find({ where: { roomStatus: RoomStatusEnum.AVAILABLE } })
        if (data.length) {
            return new CommonResponseModel(true, 1111, "Data retreived successfully", data)
        }
        return new CommonResponseModel(true, 1111, "No data found")
    }


    async imageUpload(filePath: string, filename: string, id: number, originalname: string): Promise<CommonResponseModel> {
        try {
            //   const findExistedFile = await this.buyerRepo.findOne({ where: { id: id } })
            //   if (findExistedFile?.fileName) {
            //     const path = join(__dirname, '../../../../', 'image_files', findExistedFile?.fileName)
            //     if (fs.existsSync(path)) {
            //       fs.unlinkSync(path)
            //     }
            //   }
            const filePathUpdate = await this.meetingRoomRepo.update(
                { id: id },
                { filePath: filePath, fileName: filename, originalName: originalname },
            );
            if (filePathUpdate.affected > 0) {
                return new CommonResponseModel(true, 11, 'Uploaded successfully', filePath);
            }
            else {
                return new CommonResponseModel(false, 11, 'Uploaded failed', filePath);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    async getRoomsWithTimeSlots() {

    }

    async updateScheduleStatus(req: ScheduleStatusDto): Promise<CommonResponseModel> {
        try {
            let newRoomStatus: RoomStatusEnum;
            let updatedUser: string;
            if (req.approveStatus === 'Approved') {
                newRoomStatus = RoomStatusEnum.BOOKED;
                updatedUser = req.createdUser;
            } else if (req.approveStatus === 'Canceled') {
                newRoomStatus = RoomStatusEnum.Cancelled;
                updatedUser = req.createdUser;
            } else if (req.approveStatus === 'No Show') {
                newRoomStatus = RoomStatusEnum.NOSHOW;
                updatedUser = req.createdUser;
            } else {
                newRoomStatus = RoomStatusEnum.PENDING;
                updatedUser = req.createdUser;
            }
            const result = await this.bookingsRepo.update(
                { id: req.id },
                {
                    approveStatus: req.approveStatus,
                    roomStatus: newRoomStatus,
                    updatedUser: updatedUser,
                }
            );
            if (result.affected > 0) {
                return new CommonResponseModel(true, 1, 'Updated successfully', result);
            } else {
                return new CommonResponseModel(false, 0, 'Update failed', []);
            }
        } catch (error) {
            console.error('Error updating schedule status:', error);
            throw new Error('An error occurred while updating the schedule status');
        }
    }


    async getScheduleDataByDate(req: SlotsDto): Promise<CommonResponseModel> {
        try {
            if (!req.roomId) {
                return new CommonResponseModel(false, 0, 'Invalid roomId provided', []);
            }

            // Get current date (start and end of the day)
            const startOfDay = dayjs().startOf('day').toDate(); // 00:00:00 of today
            const endOfDay = dayjs().endOf('day').toDate(); // 23:59:59 of today

            // console.log('Start of Day:', startOfDay);
            // console.log('End of Day:', endOfDay);

            // Fetch bookings for the current date
            const data = await this.bookingsRepo.find({
                where: {
                    room: { id: req.roomId },
                    startTime: Between(startOfDay, endOfDay), // Filter by today's date range
                },
                relations: ['room'],
            });

            // console.log('Query Result:', data);

            if (data.length > 0) {
                return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
            } else {
                return new CommonResponseModel(false, 0, 'No bookings found for this room on this date', []);
            }
        } catch (error) {
            console.error('Error fetching schedule data:', error);
            return new CommonResponseModel(false, 0, 'An error occurred', []);
        }
    }

    async getTodayAvailabilitySlots(dto: SlotsDto): Promise<CommonResponseModel> {
        // console.log('Received Room ID:', dto);
        const date = dayjs(dto.date, 'YYYY-MM-DD');
        const startTime = date.set('hour', 9).set('minute', 0).set('second', 0).toDate();
        const endTime = date.set('hour', 20).set('minute', 0).set('second', 0).toDate();

        try {
            const room = await this.meetingRoomRepo.findOne({ where: { id: dto.roomId } });
            if (!room) {
                return new CommonResponseModel(false, 0, 'Room ID not found', []);
            }
            const bookings = await this.bookingsRepo.find({
                where: {
                    room: { id: dto.roomId },
                    startTime: LessThanOrEqual(endTime),
                    endTime: MoreThanOrEqual(startTime),
                    approveStatus: In([ScheduleStatus.APPROVED, ScheduleStatus.OPEN]),
                },
            });
            const slots = [];
            let currentSlot = dayjs(startTime);
            while (currentSlot.isBefore(endTime)) {
                const nextSlot = currentSlot.add(5, 'minute');
                slots.push({
                    roomId: dto.roomId,
                    startTime: currentSlot.toDate(),
                    endTime: nextSlot.toDate(),
                    status: 'Available',
                });
                currentSlot = nextSlot;
            }
            slots.forEach((slot) => {
                const overlappingBooking = bookings.find(
                    (booking) =>
                        dayjs(booking.startTime).isBefore(slot.endTime) &&
                        dayjs(booking.endTime).isAfter(slot.startTime),
                );

                if (overlappingBooking) {
                    slot.status = overlappingBooking.approveStatus;
                    slot.purpose = overlappingBooking.purpose || null;
                }
            });

            const formattedSlots = slots.map((slot) => ({
                roomId: slot.roomId,
                startTime: slot.startTime,
                endTime: slot.endTime,
                status: slot.status,
                purpose: slot.purpose || null,
            }));

            return new CommonResponseModel(true, 1, 'Data retrieved successfully', formattedSlots);
        } catch (error) {
            return new CommonResponseModel(false, 0, 'An error occurred', []);
        }
    }

    async getTodayAvailabilitySlotsT(dto: SlotsDto): Promise<CommonResponseModel> {
        // console.log('Received Room ID:', dto);
        const date = dayjs(dto.date, 'YYYY-MM-DD');
        const startTime = date.set('hour', 9).set('minute', 0).set('second', 0).toDate();
        const endTime = date.set('hour', 20).set('minute', 0).set('second', 0).toDate();

        try {
            const room = await this.meetingRoomRepo.findOne({ where: { id: dto.roomId } });
            if (!room) {
                return new CommonResponseModel(false, 0, 'Room ID not found', []);
            }
            const bookings = await this.bookingsRepo.find({
                where: {
                    room: { id: dto.roomId },
                    startTime: LessThanOrEqual(endTime),
                    endTime: MoreThanOrEqual(startTime),
                    approveStatus: In([ScheduleStatus.APPROVED, ScheduleStatus.OPEN]),
                },
            });
            const slots = [];
            let currentSlot = dayjs(startTime);
            while (currentSlot.isBefore(endTime)) {
                const nextSlot = currentSlot.add(30, 'minute');
                slots.push({
                    roomId: dto.roomId,
                    startTime: currentSlot.toDate(),
                    endTime: nextSlot.toDate(),
                    status: 'Available',
                });
                currentSlot = nextSlot;
            }
            slots.forEach((slot) => {
                const overlappingBooking = bookings.find(
                    (booking) =>
                        dayjs(booking.startTime).isBefore(slot.endTime) &&
                        dayjs(booking.endTime).isAfter(slot.startTime),
                );

                if (overlappingBooking) {
                    slot.status = overlappingBooking.approveStatus;
                    slot.purpose = overlappingBooking.purpose || null;
                }
            });

            const formattedSlots = slots.map((slot) => ({
                roomId: slot.roomId,
                startTime: slot.startTime,
                endTime: slot.endTime,
                status: slot.status,
                purpose: slot.purpose || null,
            }));

            return new CommonResponseModel(true, 1, 'Data retrieved successfully', formattedSlots);
        } catch (error) {
            return new CommonResponseModel(false, 0, 'An error occurred', []);
        }
    }

    async validateTimeSlots(dto: ValidationDto): Promise<CommonResponseModel> {
        const { roomId, startDate, endDate } = dto;
        const start = dayjs(startDate, 'YYYY-MM-DD HH:mm:ss').toDate();
        const end = dayjs(endDate, 'YYYY-MM-DD HH:mm:ss').toDate();
        const overlappingBookings = await this.bookingsRepo.createQueryBuilder('bookings')
            .where('bookings.room_id = :roomId', { roomId })
            .andWhere('bookings.start_time < :end', { end })
            .andWhere('bookings.end_time > :start', { start })
            .getMany();
        if (overlappingBookings.length > 0) {
            return new CommonResponseModel(false, 0, 'The selected time slot overlaps with an existing booking');
        }
        return new CommonResponseModel(true, 1, 'The selected time slot is available.');
    }

    async getScheduleDataWithDate(req: SlotsDto): Promise<CommonResponseModel> {
        try {
            if (!req.roomId) {
                return new CommonResponseModel(false, 0, 'Invalid roomId provided', []);
            }
            const startOfDay = dayjs().set('hour', 9).set('minute', 0).set('second', 0).set('millisecond', 0).toDate();
            const endOfDay = dayjs().set('hour', 20).set('minute', 0).set('second', 0).set('millisecond', 0).toDate();
            const data = await this.bookingsRepo.find({
                where: {
                    room: { id: req.roomId },
                    startTime: Between(startOfDay, endOfDay),
                },
                relations: ['room'],
            });
            const slots = [];
            let currentTime = dayjs(startOfDay);
            while (currentTime.isBefore(endOfDay)) {
                const slotStart = currentTime.format('YYYY-MM-DD HH:mm');
                const slotEnd = currentTime.add(30, 'minutes').format('YYYY-MM-DD HH:mm');

                slots.push({
                    timeSlot: `${slotStart} - ${slotEnd}`,
                    status: 'Available',
                    createdBy: null,
                });

                currentTime = currentTime.add(30, 'minutes');
            }
            for (let booking of data) {
                const bookingStart = dayjs(booking.startTime).format('YYYY-MM-DD HH:mm');
                const bookingEnd = dayjs(booking.endTime).format('YYYY-MM-DD HH:mm');
                let lastBookedSlot = null;
                for (let slot of slots) {
                    if (
                        (dayjs(slot.timeSlot.split(' - ')[0]).isBetween(bookingStart, bookingEnd, null, '[)') ||
                            dayjs(slot.timeSlot.split(' - ')[1]).isBetween(bookingStart, bookingEnd, null, '(]') ||
                            (dayjs(slot.timeSlot.split(' - ')[0]).isBefore(bookingStart) && dayjs(slot.timeSlot.split(' - ')[1]).isAfter(bookingEnd)))
                    ) {
                        if (!lastBookedSlot || dayjs(slot.timeSlot.split(' - ')[0]).isSame(dayjs(lastBookedSlot.timeSlot.split(' - ')[1]))) {
                            slot.status = booking.approveStatus;
                            slot.purpose = booking.purpose;
                            slot.createdBy = booking.createdUser || '';
                            slot.id = booking.id;
                            lastBookedSlot = slot;
                        } else {
                            const mergedSlot = {
                                timeSlot: `${lastBookedSlot.timeSlot.split(' - ')[0]} - ${slot.timeSlot.split(' - ')[1]}`,
                                purpose: booking.purpose,
                                status: booking.approveStatus,
                                createdBy: booking.createdUser || '',
                                id: booking.id,
                            };
                            slots.splice(slots.indexOf(lastBookedSlot), 1, mergedSlot);
                            slots.splice(slots.indexOf(slot), 1);
                            lastBookedSlot = mergedSlot;
                        }
                    }
                }
            }

            if (slots.length > 0) {
                return new CommonResponseModel(true, 1, 'Slots with purposes and statuses retrieved successfully', slots);
            } else {
                return new CommonResponseModel(false, 0, 'No slots available for this room on this date', []);
            }
        } catch (error) {
            console.error('Error fetching schedule data:', error);
            return new CommonResponseModel(false, 0, 'An error occurred', []);
        }
    }

    async getRoomSlots(req: DateTimeDto): Promise<CommonResponseModel> {
        const startDate = parseISO(req.startDate);
        const endDate = parseISO(req.endDate);
        if (endDate <= startDate) {
            return new CommonResponseModel(false, 4001, "End date must be after start date");
        }
        const allRooms = await this.meetingRoomRepo.find({ where: { isActive: true } });
        const bookedSlots = await this.bookingsRepo.find({
            where: {
                approveStatus: ScheduleStatus.APPROVED,
                room: {
                    isActive: true
                }
            },
            relations: ["room"],
        });
        const roomSlots = allRooms.map(room => {
            const roomBookings = bookedSlots.filter(booking => booking.room.id === room.id);
            const isRoomAvailable = !roomBookings.some(booking => {
                const bookingStart = booking.startTime;
                const bookingEnd = booking.endTime;
                return (
                    (startDate < bookingEnd && endDate > bookingStart) // Overlapping time
                );
            });
            return isRoomAvailable
                ? {
                    roomId: room.id,
                    roomName: room.meetingRoom,
                    availableTime: `${format(startDate, 'yyyy-MM-dd HH:mm')} to ${format(endDate, 'yyyy-MM-dd HH:mm')}`,
                }
                : null;
        });
        const availableRooms = roomSlots.filter(Boolean);
        return availableRooms.length
            ? new CommonResponseModel(true, 1111, "Available rooms retrieved successfully", availableRooms)
            : new CommonResponseModel(false, 4002, "No available rooms found in this slot");
    }

    async getAllBookingsForApprover(req: { id: number }): Promise<CommonResponseModel> {
        const approversMeetingRooms = await this.meetingRoomRepo.find({ where: { roomApproverId: req.id }, select: ['id'] })
        const res = await this.bookingsRepo.find({ where: { room: { id: In(approversMeetingRooms) } } })
        return new CommonResponseModel(true, 1111, "success", res)
    }


}