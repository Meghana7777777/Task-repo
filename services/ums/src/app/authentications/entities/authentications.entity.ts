import { Column, Entity, OneToOne } from "typeorm";
import { UMSAbstractEntity } from "../../../database/common-entities";
import { UserEntity } from "../../users/entities/users.entity";

@Entity('_ums_authentications')
export class AuthenticationEntity extends UMSAbstractEntity {
    @Column('varchar', {
        name: 'email',
        length: 150
    })
    email: string;

    @Column('varchar', {
        name: 'username',
        length: 150
    })
    userName: string;

    @Column('varchar', {
        name: 'password',
        length: 150
    })
    password: string;

    @Column('boolean', { name: 'is_email_verified', nullable: true })
    isEmailVerified: boolean;

    @Column('int', { name: 'no_of_failed_login', nullable: true })
    noOfFailedLogin: number;

    @Column('datetime', {
        name: 'account_locked_on', nullable: true
    })
    accountLockedOn: string;

    @Column('varchar', { name: 'sent_otp', length: 255, nullable: true })
    sentOtp: string;

    @Column('datetime', { name: 'otp_sent_time', nullable: true })
    otpSentTime: string;

    @Column('datetime', { name: 'otp_expiry_time', nullable: true })
    otpExpiryTime: string;

    @Column('varchar', { name: 'salt', nullable: true })
    salt: string;

    @Column('varchar', { name: 'hashed_refresh_token', nullable: true })
    hashedRefreshToken: string;

    @OneToOne(() => UserEntity, (user: UserEntity) => user.authentication)
    user: UserEntity;
}