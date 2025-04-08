import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from "typeorm";
import { AuthenticationEntity } from "../entities";
import { AuthenticationProvider } from "../providers";

@EventSubscriber()
export class AuthenticationSubscriber
    implements EntitySubscriberInterface<AuthenticationEntity>
{
    listenTo() {
        return AuthenticationEntity;
    }

    async beforeInsert({
        entity,
    }: InsertEvent<AuthenticationEntity>): Promise<void> {
        if (entity.password) {
            const [password, salt] = await AuthenticationProvider.generateHash(entity.password);
            entity.password = password;
            entity.salt = salt;
        };

        if (entity.email) {
            entity.email = entity.email.toLowerCase();
        }
    }

    async beforeUpdate({
        entity,
        databaseEntity,
    }: UpdateEvent<AuthenticationEntity>): Promise<void> {
        if (entity.password) {
            const [password, salt] = await AuthenticationProvider.generateHash(entity.password);

            if (password !== databaseEntity?.password) {
                entity.password = password;
                entity.salt = salt;
            }

        }
    }
}