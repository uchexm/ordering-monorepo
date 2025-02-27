import { NestModule, MiddlewareConsumer, Module } from "@nestjs/common";

import { RmqModule } from "../rmq/rmq.module";
import { AUTH_SERVICE } from "./services";
import * as cookieParser from "cookie-parser";




@Module({
  imports: [RmqModule.register({
    name: AUTH_SERVICE
  })],
  controllers: [],
  providers: [],
  exports: [RmqModule],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieParser).forRoutes('*');
    }
}