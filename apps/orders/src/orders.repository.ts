import { AbstractRepository } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import {Order } from "./schemas/order.schema";
import { InjectModel, InjectConnection } from "@nestjs/mongoose";
import { Model, Connection } from "mongoose";

@Injectable()
export class OrdersRepository extends AbstractRepository<Order> {
    protected readonly logger = new Logger(OrdersRepository.name);

    constructor(
        @InjectModel(Order.name) orderModel: Model<Order>, 
        @InjectConnection() connection: Connection,
    ) {
        super(orderModel); // Adjusted to pass only one argument
        // If needed, you can handle the connection separately
        this.connection = connection;
    }

    private connection: Connection;
}